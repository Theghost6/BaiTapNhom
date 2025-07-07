import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random

def get_cpu_data():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    url = 'https://cellphones.com.vn/linh-kien/cpu.html'
    
    try:
        print("Đang kết nối đến website...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        print("Đang phân tích dữ liệu...")
        soup = BeautifulSoup(response.text, 'html.parser')
        
        products = []
        product_items = soup.find_all('div', {'class': 'product-item'})
        
        print(f"Tìm thấy {len(product_items)} sản phẩm")
        
        for item in product_items:
            # Product name
            name_tag = item.find('a', {'class': 'product__name'})
            name = name_tag.get_text(strip=True) if name_tag else 'N/A'
            
            # Image URL
            img_tag = item.find('img', {'class': 'product__img'})
            img_url = img_tag['src'] if img_tag else 'N/A'
            
            # Current price
            price_tag = item.find('p', {'class': 'product__price--show'})
            current_price = price_tag.get_text(strip=True) if price_tag else 'N/A'
            
            # Old price
            old_price_tag = item.find('p', {'class': 'product__price--through'})
            old_price = old_price_tag.get_text(strip=True) if old_price_tag else 'N/A'
            
            # Promotion
            promo_tag = item.find('div', {'class': 'product__promo'})
            promo = promo_tag.get_text(strip=True) if promo_tag else 'N/A'
            
            products.append({
                'Tên sản phẩm': name,
                'Link ảnh': img_url,
                'Giá mới': current_price,
                'Giá cũ': old_price,
                'Khuyến mãi': promo
            })
            
            # Random delay to avoid being blocked
            time.sleep(random.uniform(0.5, 1.5))
        
        return products
    
    except Exception as e:
        print(f"Lỗi khi crawl dữ liệu: {e}")
        return []

def save_to_excel(data, filename='cpu_products.xlsx'):
    df = pd.DataFrame(data)
    df.to_excel(filename, index=False)
    print(f"Đã lưu dữ liệu vào file {filename}")

if __name__ == '__main__':
    print("Bắt đầu quá trình crawl dữ liệu CPU từ Cellphones.com.vn")
    products = get_cpu_data()
    
    if products:
        save_to_excel(products)
        print("\nKết quả crawl:")
        for idx, product in enumerate(products[:3], 1):  # Hiển thị 3 sản phẩm đầu tiên
            print(f"\nSản phẩm {idx}:")
            print(f"Tên: {product['Tên sản phẩm']}")
            print(f"Ảnh: {product['Link ảnh']}")
            print(f"Giá mới: {product['Giá mới']}")
            print(f"Giá cũ: {product['Giá cũ']}")
            print(f"Khuyến mãi: {product['Khuyến mãi']}")
    else:
        print("Không thể crawl dữ liệu. Vui lòng kiểm tra lại kết nối hoặc cấu trúc website.")