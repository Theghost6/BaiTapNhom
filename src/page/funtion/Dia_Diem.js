const destinations = [
  {
    id: 1,
    name: "Hà Nội",
    image:
      "https://media.loveitopcdn.com/40838/thumb/upload/images/tour-tham-quan-thu-do-ha-noi.jpg",
    images: [
      "https://media.loveitopcdn.com/40838/thumb/upload/images/tour-tham-quan-thu-do-ha-noi.jpg",
      "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/pho-co-ha-noi-1.jpg",
      "https://media.istockphoto.com/id/481045024/vi/anh/tran-quoc-pagoda.jpg?s=612x612&w=0&k=20&c=yPbbMc3B_WSMM7QG1WrsqgpzNhf9KATeyO6mllBgDfE=",
      "https://vcdn1-dulich.vnecdn.net/2022/09/09van-mieu-quoc-tu-giam-ha-noi-1.jpg",
    ],
    description: "36 phố phường ngàn năm văn hiến",
    fulldescription:
      " Hà nội, thủ đô của Viẹt Nam, là thành phố có lịch sử hơn 1000 năm tuổi, với sự giao thoa giữa kiến trúc Pháp thuộc và văn hóa truyền thống, Hà nội mang đến cho du khách trải nghiệm văn hóa đặc sắc. Phố cổ Hà Nội với 36 phố phường, mỗi phố mang tên một nghề thủ công truyền thống là không thể bỏ qua. Hồ Hoàn kiếm với tháp Rùa huyền thoại nằm giữa nằm giữa lòng thành phố tạo lên biểu tượng của thủ đô ngàn năm văn hiến. Hà Nội còn nổi tiếng với ẩm thực phong phú, như phở bún cá, cà phê trứng, và nhiều món ăn đường phố đặc sắc khác ",
    rating: 4.9,
    price: "2,000,000đ",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị giày dép thoải mái để đi bộ.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo phố cổ.",
    ],
    duration: "3 Ngày 2 đêm",
    Highlights: [
      "Tham quan phố cổ",
      "Thưởng thức ẩm thực đường phố",
      "Thăm lăng bác",
    ],
    reviews: [
      {
        user: "Đỗ Hoàng toong",
        comment: "Quá đẹp, thức ăn quá osi",
        rating: 5,
      },
    ],
    tag: ["Văn hóa", "Lịch sử", "Ẩm thực", "Thành phố"],
    location: {
      address: "Quận Hoàng Kiếm,Hà Nội",
      latitude: 21.028511,
      longitude: 105.804817,
      mapUrl: "https://www.google.com/maps?q=Hà+Nội",
    },
  },
  {
    id: 2,
    name: "Sapa-Lào Cai",
    image: "https://www.kkday.com/vi/blog/wp-content/uploads/du-lich-sapa.jpg",
    description: "Săn mây thành phố mờ sương",
    rating: 4.5,
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị giày dép thoải mái để đi bộ.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo phố cổ.",
    ],
    duration: "3 Ngày 2 đêm",
    fulldescription:
      " Hà nội, thủ đô của Viẹt Nam, là thành phố có lịch sử hơn 1000 năm tuổi, với sự giao thoa giữa kiến trúc Pháp thuộc và văn hóa truyền thống, Hà nội mang đến cho du khách trải nghiệm văn hóa đặc sắc. Phố cổ Hà Nội với 36 phố phường, mỗi phố mang tên một nghề thủ công truyền thống là không thể bỏ qua. Hồ Hoàn kiếm với tháp Rùa huyền thoại nằm giữa nằm giữa lòng thành phố tạo lên biểu tượng của thủ đô ngàn năm văn hiến. Hà Nội còn nổi tiếng với ẩm thực phong phú, như phở bún cá, cà phê trứng, và nhiều món ăn đường phố đặc sắc khác ",

    Highlights: [
      "Tham quan phố cổ",
      "Thưởng thức ẩm thực đường phố",
      "Thăm lăng bác",
    ],
    price: "3,500,000đ",
    tag: ["Văn hóa,", " Lịch sử,", " Ẩm thực,", " Thành phố,"],
  },
  {
    id: 3,
    name: "Thác Bản Giốc-Cao Bằng",
    image:
      "https://dulichhoangha.com/upload/files/bvcl_1cdn_vn-2023-03-01-_anh-1-thac-ban-doc.jpg",
    description: "Vẻ đẹp hùng vĩ nơi biên giới",
    rating: 4.6,
    price: "1,800,000đ",
  },
  {
    id: 4,
    name: "Mai Châu-Hòa Bình",
    image:
      "https://annambooking.vn/wp-content/uploads/2021/03/Mai-Chau-Hoa-Binh.jpg.jpg",
    description: "Vẻ đẹp mộc mạc giữa núi rừng",
    rating: 4.6,
    price: "1,600,000đ",
  },
  {
    id: 5,
    name: "Mộc Châu-Sơn La",
    image:
      "https://6.img.izshop.vn/tv31/images/tour/2020/05/origin/ccabd16d42c0f061647a7ad75759a33b.jpg",
    description: "Phong cảnh đậm chất miền núi phía Bắc",
    rating: 4.6,
    price: "2,500,000đ",
  },
  {
    id: 6,
    name: "Đồng Văn-Hà Giang",
    image:
      "https://cdn.tgdd.vn/Files/2022/01/18/1411528/10-dia-diem-du-lich-mien-bac-dep-phai-di-mot-lan-trong-doi-202202161448024074.jpg",
    description: "Cao nguyên đá hoang sơ tuyệt đẹp",
    rating: 4.5,
    price: "1,400,000đ",
  },
  {
    id: 7,
    name: "Vịnh Hạ Long-Quảng Ninh ",
    image:
      "https://special.nhandan.vn/30-nam-mot-chang-duong-di-san-Vinh-Ha-Long/assets/HLCklusX0n/things-to-do-in-ha-long-bay-banner-1-1920x1080.jpg",
    description: "Vẻ đẹp kỳ quan thiên nhiên Thế giới",
    rating: 4.8,
    price: "3,500,000đ",
  },
  {
    id: 8,
    name: "Tràng An-Ninh Bình",
    image:
      "https://cdn.tgdd.vn/Files/2022/01/18/1411528/10-dia-diem-du-lich-mien-bac-phai-den-1-lan-trong-doi-202202161351023625.jpg",
    description: "Vẻ đẹp thiên nhiên hùng vĩ",
    rating: 4.8,
    price: "2,200,000đ",
  },
  {
    id: 9,
    name: "Đảo Cát Bà-Hải Phòng",
    image: "https://catba.net.vn/wp-content/uploads/2024/10/cat-ba-1.jpg",
    description: "Hòn đảo ngọc giữa vịnh Bắc Bộ",
    rating: 4.6,
    price: "2,000,000đ",
  },
  {
    id: 10,
    name: "Chùa Tam Chúc-Hà Nam",
    image:
      "https://imagevietnam.vnanet.vn//MediaUpload/Org/2024/12/13/213-11-8-37.jpg",
    description: "Nét đẹp cổ kính giữa chốn non nước",
    rating: 4.6,
    price: "2,200,000đ",
  },
  {
    id: 11,
    name: "Đà Nẵng",
    image:
      "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-2.jpg",
    description: "Thành phố đáng sống với bãi biển tuyệt đẹp và cầu Rồng.",
    rating: 4.8,
    price: "3,500,000đ",
  },
  {
    id: 12,
    name: "Phố cổ Hội An - Quảng Nam ",
    image:
      "https://hoianpark.com/userfiles/image/du-lich/net-dep-ha/ky-uc-hoi-an-ve-dem/ky-uc-hoi-an-ve-dem-1.jpg",
    description: "Phố cổ lãng mạn với những chiếc đèn lồng đầy màu sắc.",
    rating: 4.9,
    price: "2,800,000đ",
  },
  {
    id: 13,
    name: "Nha Trang",
    image:
      "https://media.istockphoto.com/id/827359312/vi/anh/to%C3%A0n-c%E1%BA%A3nh-th%C3%A0nh-ph%E1%BB%91-nha-trang-%E1%BB%9F-vi%E1%BB%87t-nam-t%E1%BB%AB-quan-%C4%91i%E1%BB%83m-m%C3%A1y-bay-kh%C3%B4ng-ng%C6%B0%E1%BB%9Di-l%C3%A1i.jpg?s=612x612&w=0&k=20&c=coljvNU4PTpoKVPfTfuNsHh6u9Xs36BI-o6Pmnhq55I=",
    description:
      "Thiên đường biển với các resort sang trọng và ẩm thực hải sản.",
    rating: 4.7,
    price: "4,200,000đ",
  },
  {
    id: 14,
    name: "Đà Lạt",
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-da-lat.jpg",
    description:
      "Thành phố ngàn hoa với không khí se lạnh và cảnh đẹp thơ mộng.",
    rating: 4.8,
    price: "3,200,000đ",
  },
  {
    id: 15,
    name: "Cố Đô Huế",
    image:
      "https://sohanews.sohacdn.com/160588918557773824/2024/11/5/hmccdinhhoanghoangthanh001-1730775869077-1730775869562679988470.jpg",
    description: "Nét đẹp nghìn lịch sử vùng đất Huế",
    rating: 4.6,
    price: "3,000,000đ",
  },
  {
    id: 16,
    name: "Động Phong Nha Kẻ Bàng-Quảng Bình",
    image:
      "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482781qBa/anh-mo-ta.png",
    description: "Hang động có cửa hang cao và rộng nhất",
    rating: 4.7,
    price: "2,000,000đ",
  },
  {
    id: 17,
    name: "Kỳ Co Beach-Quy Nhơn",
    image:
      "https://cdnphoto.dantri.com.vn/75MTzLTi_7Ys_reS6Va31bGWBk4=/zoom/1200_630/2018/7/1/anh-1-1530460120717428571836.jpg",
    description: "Vẻ đẹp hoang sơ tại thiên đường biển đảo Quy Nhơn",
    rating: 4.6,
    price: "1,500,000đ",
  },

  {
    id: 18,
    name: "Vịnh Vân Phong - Khánh Hòa",
    image:
      "https://top7vietnam.sgtiepthi.vn/wp-content/uploads/2023/07/diep-son-sa.jpg",
    description: "Eo Biển Kín Gió Rộng Lớn Tuyệt Đẹp",
    rating: 4.6,
    price: "2.400,000đ",
  },
  {
    id: 19,
    name: "Đảo Lý Sơn - Quảng Ngãi",
    image:
      "https://images2.thanhnien.vn/528068263637045248/2024/8/29/photo-1724921216696-1724921218643849112847.jpeg",
    description: "Kỳ quan thiên nhiên độc đáo",
    rating: 4.6,
    price: "2,500,000đ",
  },
  {
    id: 20,
    name: "Mũi Né Beach - Phan Thiết",
    image: "https://static.vinwonders.com/production/du-lich-mui-ne-1.webp",
    description: "Nét đẹp hoang sơ và hiện đại trên vùng biển",
    rating: 4.4,
    price: "1,500,000đ",
  },
  {
    id: 21,
    name: "Thành phố Hồ Chí Minh",
    image:
      "https://th.bing.com/th/id/R.4406947c331766e13e13e67f143e19f1?rik=bK1DCfWAKPeihA&pid=ImgRaw&r=0",
    description:
      "Thành phố sôi động với nền ẩm thực phong phú, di tích lịch sử và nhịp sống hiện đại.",
    rating: 4.8,
    price: "5,000,000đ",
  },
  {
    id: 22,
    name: "Cột mốc Quốc gia Đất Mũi - Cà Mau",
    image:
      "https://th.bing.com/th/id/OIP.2x0ylcZ-HQOjF-Osn3JgAgHaFj?w=287&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    description: "Đất Mũi - Cà Mau: Nơi tận cùng phía Nam của tổ quốc.",
    rating: 4.6,
    price: "2,800,000đ",
  },
  {
    id: 23,
    name: "Bạc Liêu",
    image:
      "https://cdn.tgdd.vn/Files/2021/07/02/1365015/22-dia-diem-du-lich-bac-lieu-vo-cung-hap-dan-tha-ho-check-in-202206041924462109.jpg",
    description:
      "Vùng đất miền Tây sông nước, giai thoại về cuộc đời Công tử Bạc Liêu.",
    rating: 4.5,
    price: "3,000,000đ",
  },
  {
    id: 24,
    name: "Đồng Tháp",
    image:
      "https://th.bing.com/th/id/OIP.VXtUmvY2AtW9-zWtQwhiTgHaDt?rs=1&pid=ImgDetMain",
    description:
      "Những cánh đồng hoa sen bát ngát, nét bình yên của khung cảnh làng quê thanh bình.",
    rating: 4.6,
    price: "2,600,000đ",
  },
  {
    id: 25,
    name: "Phú Quốc - Kiên Giang",
    image:
      "https://th.bing.com/th/id/OIP.zyD01et0TLnf5EErrHeR4QHaEA?rs=1&pid=ImgDetMain",
    description: "Hòn đảo đẹp nhất miền Nam.",
    rating: 4.8,
    price: "5,600,000",
  },
  {
    id: 26,
    name: "Núi Bà Đen - Tây Ninh",
    image:
      "https://images.vietnamtourism.gov.vn/vn/images/2021/thang_8/2508.du_lich_nui_ba_den_chinh_phuc_noc_nha_nam_bo_1.jpg",
    description: "Nơi được mệnh danh là Đệ nhất thiên sơn",
    rating: 4.5,
    price: "4,200,000đ",
  },
  {
    id: 27,
    name: "Tp Cần Thơ",
    image:
      "https://tourcantho.vn/wp-content/uploads/kien-truc-cau-tinh-yeu.jpg",
    description: "Duyên thầm của mảnh đất phương Nam.",
    rating: 5.0,
    price: "4,500,000đ",
  },
  {
    id: 28,
    name: "Côn Đảo - Bà Rịa-Vũng Tàu ",
    image:
      "https://th.bing.com/th/id/R.067ea9871006caae2cb80b6ac7583338?rik=cfOjUu4Ief4ExA&pid=ImgRaw&r=0",
    description: "Hòn đảo hoang dại và quyến rũ bậc nhất.",
    rating: 4.4,
    price: "6,000,000đ",
  },
  {
    id: 29,
    name: "Rừng Tràm Trà Sư - An Giang",
    image:
      "https://top10angiang.vn/wp-content/uploads/2021/06/rung-tram-tra-su-an-giang-1-1536x1536.jpg",
    description: "Nét đẹp của đồng bằng & núi đồi hòa quyện.",
    rating: 4.4,
    price: "5,500,000đ",
  },
  {
    id: 30,
    name: "Vườn quốc gia Cát Tiên",
    image:
      "https://api.toploigiai.vn/storage/uploads/bai-viet-tieng-anh-ve-vuon-quoc-gia-cat-tien_1",
    description: "Nét đơn sơ, mộc mạc của đất miền Nam.",
    rating: 4.8,
    price: "1,500,000đ",
  },
];

export default destinations;
