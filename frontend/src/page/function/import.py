import json
import mysql.connector
import sys
import os
from datetime import datetime

# Cấu hình kết nối database
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "form",
    "port": 3306
}

def get_or_create(cursor, table, col_name, value, additional_fields=None):
    if value is None:
        return None
        
    query = f"SELECT id FROM {table} WHERE {col_name} = %s"
    cursor.execute(query, (value,))
    row = cursor.fetchone()
    
    if row:
        return row[0]
    
    if additional_fields:
        fields = list(additional_fields.keys())
        values = list(additional_fields.values())
        columns = f"{col_name}, " + ", ".join(fields)
        placeholders = "%s, " + ", ".join(["%s"] * len(fields))
        cursor.execute(f"INSERT INTO {table} ({columns}) VALUES ({placeholders})", [value] + values)
    else:
        cursor.execute(f"INSERT INTO {table} ({col_name}) VALUES (%s)", (value,))
    
    return cursor.lastrowid

def import_products(json_path):
    try:
        # Kiểm tra file JSON
        if not os.path.exists(json_path):
            print(f"❌ File {json_path} không tồn tại")
            return

        with open(json_path, "r", encoding="utf-8") as f:
            try:
                products = json.load(f)
            except json.JSONDecodeError as e:
                print(f"❌ Lỗi đọc file JSON: {e}")
                return

        if not isinstance(products, list):
            print("❌ File JSON phải chứa một mảng các sản phẩm")
            return

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Lấy thông tin cấu trúc bảng
        cursor.execute("DESCRIBE san_pham")
        san_pham_columns = [column[0] for column in cursor.fetchall()]

        total_imported = 0
        skipped_products = 0

        for p in products:
            try:
                # Kiểm tra dữ liệu bắt buộc
                if "ten_sp" not in p or not p["ten_sp"]:
                    print(f"❌ Bỏ qua sản phẩm thiếu tên")
                    skipped_products += 1
                    continue

                # Xử lý giá cả
                gia_sau = p.get("gia_sau")
                gia_truoc = p.get("gia_truoc")
                
                # Nếu không có giá sau, dùng giá trước
                if gia_sau is None:
                    gia_sau = gia_truoc
                
                # Nếu vẫn null và cột NOT NULL, gán giá trị mặc định
                if gia_sau is None and 'gia_sau' in san_pham_columns:
                    gia_sau = 0
                
                if gia_truoc is None and 'gia_truoc' in san_pham_columns:
                    gia_truoc = 0

                # Xử lý danh mục
                if "loai" not in p or not p["loai"]:
                    print(f"❌ Bỏ qua sản phẩm thiếu danh mục: {p['ten_sp']}")
                    skipped_products += 1
                    continue
                
                id_danh_muc = get_or_create(cursor, "danh_muc", "ten_danh_muc", p["loai"], {
                    "trang_thai": 1,
                    "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })

                # Xử lý nhà sản xuất
                hang_sx = p.get("thong_so", {}).get("hang_san_xuat", "Khác")
                id_nha_sx = get_or_create(cursor, "nha_san_xuat", "ten_nha_san_xuat", hang_sx, {
                    "trang_thai": 1,
                    "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })

                # Chuẩn bị dữ liệu sản phẩm
                product_data = {
                    "ten_sp": p["ten_sp"],
                    "gia_sau": gia_sau,
                    "gia_truoc": gia_truoc,
                    "so_luong": p.get("so_luong", 0),
                    "bao_hanh": p.get("bao_hanh", ""),
                    "mo_ta": p.get("mo_ta", ""),
                    "id_danh_muc": id_danh_muc,
                    "id_nha_san_xuat": id_nha_sx,
                    "trang_thai": 1,
                    "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }

                # Thêm các trường tùy chọn nếu có trong JSON và database
                optional_fields = {
                    "ma_sp": p.get("ma_sp"),
                    "khuyen_mai": p.get("khuyen_mai"),
                    "ngay_phat_hanh": p.get("ngay_phat_hanh")
                }

                for field, value in optional_fields.items():
                    if value is not None and field in san_pham_columns:
                        product_data[field] = value

                # Tạo câu lệnh SQL
                columns = ", ".join(product_data.keys())
                placeholders = ", ".join(["%s"] * len(product_data))
                
                sql = f"""
                    INSERT INTO san_pham ({columns})
                    VALUES ({placeholders})
                """
                
                cursor.execute(sql, list(product_data.values()))
                id_sp = cursor.lastrowid

                # Thêm ảnh sản phẩm
                for i, url in enumerate(p.get("images", [])):
                    if url:  # Chỉ thêm nếu URL không rỗng
                        cursor.execute("""
                            INSERT INTO anh_sp (id_sp, url, thu_tu, created_at)
                            VALUES (%s, %s, %s, %s)
                        """, (id_sp, url, i, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))

                # Thêm thông số kỹ thuật
                for i, (key, val) in enumerate(p.get("thong_so", {}).items()):
                    if key.lower() != "hang_san_xuat" and val is not None:
                        cursor.execute("""
                            INSERT INTO thong_so (id_sp, ten_thong_so, gia_tri_thong_so, thu_tu)
                            VALUES (%s, %s, %s, %s)
                        """, (id_sp, key, str(val), i))

                total_imported += 1
                print(f"✔ Đã import sản phẩm: {p['ten_sp']}")

            except mysql.connector.Error as err:
                print(f"❌ Lỗi database khi import sản phẩm {p.get('ten_sp', 'Không có tên')}: {err}")
                conn.rollback()
                skipped_products += 1
            except Exception as e:
                print(f"❌ Lỗi khi import sản phẩm {p.get('ten_sp', 'Không có tên')}: {e}")
                conn.rollback()
                skipped_products += 1

        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"\n✅ Kết quả import:")
        print(f"- Tổng sản phẩm: {len(products)}")
        print(f"- Import thành công: {total_imported}")
        print(f"- Bỏ qua: {skipped_products}")
        if skipped_products > 0:
            print("ℹ️ Kiểm tra log trên để biết lý do bỏ qua từng sản phẩm")

    except Exception as e:
        print(f"❌ Lỗi không xác định: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Vui lòng chỉ định đường dẫn file JSON")
        print("Cách sử dụng: python import.py <đường_dẫn_file_json>")
        sys.exit(1)
    
    json_file = sys.argv[1]
    import_products(json_file)