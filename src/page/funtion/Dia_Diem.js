const destinations = [
  {
    id: 1,
    name: "Hà Nội",
    image: 
      "https://media.loveitopcdn.com/40838/thumb/upload/images/tour-tham-quan-thu-do-ha-noi.jpg",
    images:[
      "https://media.loveitopcdn.com/40838/thumb/upload/images/tour-tham-quan-thu-do-ha-noi.jpg",
      "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/pho-co-ha-noi-1.jpg",
      "https://media.istockphoto.com/id/481045024/vi/anh/tran-quoc-pagoda.jpg?s=612x612&w=0&k=20&c=yPbbMc3B_WSMM7QG1WrsqgpzNhf9KATeyO6mllBgDfE=",
      "https://vcdn1-dulich.vnecdn.net/2022/09/09van-mieu-quoc-tu-giam-ha-noi-1.jpg"
    ],
    description: "36 phố phường ngàn năm văn hiến",
    fulldescription:
      " Hà nội, thủ đô của Viẹt Nam, là thành phố có lịch sử hơn 1000 năm tuổi, với sự giao thoa giữa kiến trúc Pháp thuộc và văn hóa truyền thống, Hà nội mang đến cho du khách trải nghiệm văn hóa đặc sắc. Phố cổ Hà Nội với 36 phố phường, mỗi phố mang tên một nghề thủ công truyền thống là không thể bỏ qua. Hồ Hoàn kiếm với tháp Rùa huyền thoại nằm giữa nằm giữa lòng thành phố tạo lên biểu tượng của thủ đô ngàn năm văn hiến. Hà Nội còn nổi tiếng với ẩm thực phong phú, như phở bún cá, cà phê trứng, và nhiều món ăn đường phố đặc sắc khác ",
    rating: 5.0,
    price: "2,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Hà+Nội"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị giày dép thoải mái để đi bộ.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo phố cổ."
    ],
    
    Highlights:[
      "Tham quan phố cổ",
      "Thưởng thức ẩm thực đường phố",
      "Thăm lăng Chủ tịch Hồ chí Minh ",
    ],
    
    tag:["Văn hóa","Lịch sử","Ẩm thực","Thành phố","Thủ Đô"]
  },
  
  {
    id: 2,
    name: "Sapa-Lào Cai",
    image: "https://www.kkday.com/vi/blog/wp-content/uploads/du-lich-sapa.jpg",
    images:[
      "https://combotour.net/wp-content/uploads/2021/05/fansipanthienphuoctravel.com_.jpg",
      "https://booking.muongthanh.com/upload_images/images/H%60/sa-pa-thi-tran-trong-suong.jpg",
      "https://tourdulichsapagiare.com/view/at_hanh-trinh-kham-pha-sapa-ham-rong-lao-chai-ta-van-fansipan-3-ngay-4-dem_2c39c225bfc763a04a261dded1cec915.jpg",
      "https://cdn3.ivivu.com/2022/07/du-lich-sa-pa-ivivu-2.jpg"
    ],
    description: "Săn mây thành phố mờ sương",
    fulldescription:
      "Sapa- Thành phố trong sương nổi tiếng với với cảnh quan núi non hùng vĩ, khí hậu trong lành hoang sơ, quanh năm mát mẻ sẽ giúp bạn có được những giờ phút nghỉ dưỡng đúng nghĩa. Đến với tour Sapa bạn sẽ được trải nghiệm ngắm tuyết rơi vào mùa Đông, trèo lên đỉnh núi Fansipan - nơi được mệnh danh là nóc nhà Đông Dương, và được dạo quanh thung lũng Mường Hoa làm say lòng người. Thông qua tour du lich Sapa du khách còn có dịp được trải nghiệm nhiều nét văn hóa độc đáo với cuộc sống của đồng bào dân tộc thiểu số vùng Miền núi phía Bắc, thưởng thức các món ăn truyền thống đặc sắc nơi đây.",
    rating: 4.5,
    price: "3,500,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Lào+Cai"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị giày dép thoải mái để đi bộ.",
      "Đem theo bản đồ du lịch Sapa để không bị lạc đường"
    ],
    Highlights:[
      "Tham quan đỉnh Fansipan,Núi Hàm Rồng,Bản Cát Cát ",
      "Thưởng thức ẩm thực ở Sapa",
      "Săn mây ở Đỉnh núi Hàm Rồng, Cổng trời Sa Pa ",
    ],
    tag:["Văn hóa","Ẩm thực"],
  },

  {
    id: 3,
    name: "Thác Bản Giốc-Cao Bằng",
    image:
      "https://dulichhoangha.com/upload/files/bvcl_1cdn_vn-2023-03-01-_anh-1-thac-ban-doc.jpg",
    images: [
      "https://images.vietnamtourism.gov.vn/vn//images/2019/CNMN/16.10._Thac_Ban_gioc_ve_dep_ky_vi_giua_non_nuoc_cao_bang_3.jpg",
      "https://scontent.iocvnpt.com/resources/portal/Images/CBG/minhtiep/ThacBanGioc/636577604848121428_1.png",
      "https://bcp.cdnchinhphu.vn/334894974524682240/2024/5/22/03102017thacbangioccb-17163618233341571967593.jpg",
      "https://cattour.vn/images/upload/images/nen-di-thac-ban-gioc-mua-nao/nhanh-cao.jpg"
    ],
    description: "Vẻ đẹp hùng vĩ nơi biên giới",
    fulldescription:
      "Nằm trên đường biên giới Việt - Trung, thác Bản Giốc được mệnh danh là một trong những thác nước đẹp nhất Việt Nam, là thác nước tự nhiên lớn nhất khu vực Đông Nam Á và là thác lớn thứ tư thế giới trong các thác nước nằm trên một đường biên giới. Thác Bản Giốc cao hơn 60m với chỗ dốc dài nhất 30m. Chia thành nhiều tầng đá vôi nối tiếp nhau và trải rộng đến cả trăm mét. Giữa thác có mô đất rộng với nhiều cây xanh bao phủ, chia con sông thành ba nhánh khác nhau.Đến với Bản Giốc, du khách không những được chiêm ngưỡng vẻ đẹp của cảnh quan thiên nhiên hùng vĩ, mà còn được đắm mình trong câu chuyện tình yêu đậm màu sắc huyền thoại của đôi trai gái miền sơn cước. ",
    rating: 4.6,
    price: "2,500,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Thác+Bản+Giốc,+Cao+Bằng"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Các loại vật dụng y tế như urgo, băng gạc, thuốc cảm, dầu gió, kem chống nắng và chống côn trùng",
      "Bạn cần đem theo áo ấm, giày cao cổ đế mềm, khăn choàng để không bị lạnh",
      "Nếu đi phượt thì đem theo đèn pin, lều bạt, cồn."
    ],
    Highlights:[
      "Trải nghiệm đi bè tre trên sông Quây Sơn",
      "Thưởng thức ẩm thực Cao Bằng : Vịt quay 7 vị, bánh cuốn Cao Bằng,...",
      "Tham quan Động Ngườm Ngao, Hồ Thang Hen ",
    ],
    tag:["Văn hóa","Thác nước"],
  },

  {
    id: 4,
    name: "Mai Châu-Hòa Bình",
    image:
      "https://annambooking.vn/wp-content/uploads/2021/03/Mai-Chau-Hoa-Binh.jpg.jpg",
    images: [
      "https://vcdn1-dulich.vnecdn.net/2022/04/12/MaiChauHoaBinh-1649752704-4229-1649760590.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=PjuhzqUORm3sVijlrQzsmQ",
      "https://maichauhoabinh.com/wp-content/uploads/2018/11/tour-du-lich-mai-chau-hoa-binh-2-ngay-1-dem-0.jpg",
      "https://gaohouse.vn/wp-content/uploads/2024/01/du-lich-mai-chau-hoa-binh-5.jpg",
      "https://tamsusaigon.com/wp-content/uploads/2022/11/thien-duong-xanh-mai-chau-hideaway-khu-nghi-duong-thien-nhien-nui-rung-tay-bac-40.jpg"
    ],
    description: "Vẻ đẹp mộc mạc giữa núi rừng",
    fulldescription:
      "Mai Châu là một thị trấn nhỏ nằm ở phía Tây Bắc tỉnh Hòa Bình, cách trung tâm Hà Nội 135 km, tiếp giáp với Mộc Châu của Sơn La và Pù Luông của Thanh Hóa. Thung lũng Mai Châu được bao quanh bởi những dãy đá vôi đồ sộ, khung cảnh núi rừng hùng vĩ, nên thơ, những cánh đồng xanh mát bình yên cùng bầu không khí trong lành, mát mẻ.Đến với vùng đất xinh đẹp Mai Châu, bạn sẽ được hòa mình vào thiên nhiên, tận hưởng những phút giây thư giãn, bình yên, khám phá cuộc sống và nét đẹp văn hóa của dân tộc Thái, thưởng thức những món ăn đặc sản độc đáo mà không nơi nào có được.",
    rating: 3.9,
    price: "2,300,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Mai+Châu,+Hòa+Bình"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Các loại vật dụng y tế như urgo, băng gạc, thuốc cảm, dầu gió, kem chống nắng và chống côn trùng",
      "Chuẩn bị giày dép thoải mái để đi lại.",
      "Nếu đi phượt thì đem theo đèn pin, lều bạt, cồn."
    ],
    Highlights:[
      "Tham quan các bản văn Mai Châu, bảo tàng Thái ",
      "Thưởng thức ẩm thực ở Hòa Bình : cơm lam, xôi xương, măng đắng,...",
    ],
    tag:["Văn hóa","Tây Bắc","rừng núi"],
  },

  {
    id: 5,
    name: "Mộc Châu-Sơn La",
    image:
      "https://6.img.izshop.vn/tv31/images/tour/2020/05/origin/ccabd16d42c0f061647a7ad75759a33b.jpg",
    images : [
      "https://moitruongdulich.vn/wp-content/uploads/2024/10/267Sonla.jpg",
      "https://dulichmocchau.net/uploads/news/2020_03/moc-chau-3-1.jpg",
      "https://thiennhienmoitruong.vn/upload/images/btv/btv-6.5/h21.png",
      "https://cdn.tapchitoaan.vn/media/files/vnm%201.jpg",
      "https://hellotrip.vn/wp-content/uploads/2021/11/khu-nghi-duong-phoenix-moc-chau-son-la-13412.jpg"
    ],
    description: "Phong cảnh đậm chất miền núi phía Bắc",
    fulldescription:
      "Cao nguyên Mộc Châu được thiên nhiên ưu ái với những cảnh quan đặc sắc, với nhiều phong cảnh đẹp, hệ thống hang động, thác nước, cảnh quan núi rừng hùng vĩ, như: Hang Dơi, Ngũ động Bản Ôn, thác Dải Yếm; thác Tạt Nàng, thác Nàng Tiên; rừng thông bản Áng, núi Pha Luông; hệ thống suối nước nóng tại bản Phụ Mẫu,... Nơi đây còn là vùng đất của nhiều loài hoa, nổi bật là hoa đào, mận, hoa ban, hoa cải trắng… Những đồi chè xanh ngát cũng là điểm nhấn thu hút du khách khi đến với Khu du lịch quốc gia Mộc Châu.",
    rating: 4.6,
    price: "3,100,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Mộc+Châu,+Sơn+La"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Các loại vật dụng y tế như urgo, băng gạc, thuốc cảm, dầu gió, kem chống nắng và chống côn trùng",
      "Chuẩn bị giày dép thoải mái để đi lại.",
      "Nếu đi phượt thì đem theo đèn pin, lều bạt, cồn."
    ],
    Highlights:[
      "Tham quan đồi chè trái tim,thác Dải Yếm ",
      "Thưởng thức ẩm thực ở Mộc Châu : sữa tươi Mộc Châu,Mận",
      "Check-in ở thung lũng mận Phiêng Cành, bản Pa Phách,thác Nàng Tiên, ",
    ],
    tag:["Văn hóa","hoa mận","rừng núi"],
  },

  {
    id: 6,
    name: "Đồng Văn-Hà Giang",
    image:
      "https://cdn.tgdd.vn/Files/2022/01/18/1411528/10-dia-diem-du-lich-mien-bac-dep-phai-di-mot-lan-trong-doi-202202161448024074.jpg",
    images : [
      "https://sinhtour.vn/wp-content/uploads/2022/07/cao-nguyen-da-dong-van-10-1.jpg",
      "https://dulichtaybac.vn/wp-content/uploads/2023/08/du-lich-mua-thu-bung-no-voi-tour-ha-giang-sapa-hut-khach-16437-2.jpg",
      "https://saigontourist.net/uploads/destination/TrongNuoc/mienbac/Ha-giang/Ethnic-minority-village-ha-giang_1047733480.jpg",
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/539/761/products/du-lich-ha-giang-cong-troi-quan-ba-3fa18736-3122-4b05-9288-27d1bf82ad38.jpg?v=1742964449980",
      "https://www.vietnambooking.com/wp-content/uploads/2021/01/du-lich-ha-giang-thang-1-2.jpg",
      "https://mia.vn/media/uploads/blog-du-lich/muon-mau-muon-ve-cho-phien-dong-van-ha-giang-3-1642330904.jpeg"
    ],
    description: "Cao nguyên đá hoang sơ tuyệt đẹp",
    fulldescription:
      "Đồng Văn là một huyện miền núi thuộc tỉnh Hà Giang, đồng thời là huyện cực Bắc của Việt Nam. Nơi đây nổi tiếng với vẻ đẹp hoang sơ với những dãy núi đá vôi hùng vĩ, ruộng bậc thang mênh mông, và văn hóa truyền thống đặc sắc. Hãy bỏ lại phố thị ồn ào để tận hưởng cảnh quan thiên nhiên tươi đẹp và đắm chìm trong cuộc sống của các dân tộc thiểu số đầy sắc màu tại nơi đây!",
    rating: 4.5,
    price: "2,700,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Đồng+Văn,+Hà+Giang"
    },
    notes: [
      "Các loại vật dụng y tế như urgo, băng gạc, thuốc cảm, dầu gió, kem chống nắng và chống côn trùng.",
      "mang theo đầy đủ giấy tờ tùy thân như giấy phép lái xe, chứng minh nhân dân.",
      "Đi phượt,mua xăng dự trữ (khoảng chai 1,5 lít) và mượn những đồ sửa xe cơ bản."
    ],
    transport: "Otô, Máy bay",
    Highlights:[
      "Tham quan phố cổ Đồng Văn,cột cờ Lũng Cú, chợ phiên xã Phố Cáo",
      "Thưởng thức ẩm thực ở Hà Giang : cháo ấu tẩu, mèn mén,...",
      "Check-in ở khu dinh thự nhà Vương, cánh đồng hoa tam giác mạch sủng Là ",
    ],
    tag:["Văn hóa","ruộng bậc thang","rừng núi","cực bắc Việt Nam"],
  },

  {
    id: 7,
    name: "Vịnh Hạ Long-Quảng Ninh ",
    image:
      "https://special.nhandan.vn/30-nam-mot-chang-duong-di-san-Vinh-Ha-Long/assets/HLCklusX0n/things-to-do-in-ha-long-bay-banner-1-1920x1080.jpg",
    images : [
      "https://wowcher.vn/wp-content/uploads/2022/02/Voucher-du-thuyen-ha-long.webp",
      "https://ik.imagekit.io/tvlk/blog/2022/10/kinh-nghiem-du-lich-vinh-ha-long-cover.jpeg",
      "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1682051732.jpg&w=3840&q=75",
      "https://hitour.vn/storage/images/upload/tour-du-lich-vinh-ha-long-4-ngay-3-dem-gallery-1666029594-12.webp",
      "https://www.vietnambooking.com/wp-content/uploads/2021/04/dia-diem-di-ha-long-13.jpg"
    ],
    description: "Vẻ đẹp kỳ quan thiên nhiên Thế giới",
    fulldescription:
      " Vịnh Hạ Long một trong Bảy kỳ quan thiên nhiên thế giới mới, và được Thế giới công nhận là di sản thiên nhiên thế giới. Chính bởi vẻ đẹp hùng vĩ và nguyên sơ, du lịch Hạ Long luôn là một sự lựa chọn hàng đầu được nhiều du khách cả trong và ngoài nước tìm đến để khám phá tham quan và du lịch. Vịnh Hạ Long Không chỉ nổi tiếng bởi vẻ đẹp của một bức tranh thủy mạc đẹp vô vàn, từ các đảo lớn nhỏ cho đến những hang động đá vôi huyền bí, Vịnh Hạ Long hiện lên sừng sững trên tờ tiền Polime 200.000đ mang nét đẹp văn hóa Việt Nam.",
    rating: 4.8,
    price: "4,200,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Long+Hạ+Long,+Hạ+Long"
    },
    transport: "Otô, Máy bay, Du thuyền",
    notes: [
      "Chuẩn bị mũ, dù, áo mưa, kính mát, kem chống nắng để bảo vệ làn da nhé!",
      "Mang theo đầy đủ giấy tờ tùy thân như giấy phép lái xe, chứng minh nhân dân.",
      "Nên đi du lịch Hạ Long vào đầu hoặc cuối hè ."
    ],
    Highlights:[
      "Tham quan động Thiên Cung, hang Đầu Gỗ,... ",
      "Thưởng thức ẩm thực ở Quảng Ninh : chả mực giã tay, hải sản",
      "Chèo thuyền kayak,tắm biển trên vịnh,...",
    ],
    tag:["Du lịch","kì quan thế giới","Chả mực giã tay"],
  },

  {
    id: 8,
    name: "Tràng An-Ninh Bình",
    image:
      "https://cdn.tgdd.vn/Files/2022/01/18/1411528/10-dia-diem-du-lich-mien-bac-phai-den-1-lan-trong-doi-202202161351023625.jpg",
    images : [
      "https://maichautourist.vn/wp-content/uploads/2019/07/6-diem-du-lich-o-ninh-binh-tuyet-dep-khong-the-bo-qua.jpg",
      "https://hdtransport.vn/hinhanh/sanpham/f06043489e5b64053d4a12.jpg",
      "https://canthotourist.vn/public/upload/images/du-lich-ninh-binh.jpg",
      "https://baothainguyen.vn/file/oldimage/baothainguyen/UserFiles/image/08062021_Dulichninhbinh.jpg",
      "https://www.vietnambooking.com/wp-content/uploads/2018/11/bikip-dulich-ninhbinh-tron-ven-dong-day-yeu-thuong-13112018-13.jpg"
    ],
    description: "Vẻ đẹp thiên nhiên hùng vĩ",
    fulldescription:
      "Tràng An là một khu du lịch sinh thái nằm trong Quần thể danh thắng Tràng An thuộc tỉnh Ninh Bình. Nơi đây đã được Chính phủ Việt Nam xếp hạng di tích quốc gia đặc biệt quan trọng và UNESCO công nhận là di sản thế giới kép từ năm 2014.Khu du lịch Tràng An Ninh Bình từ lâu đã nổi tiếng là một tuyệt tác thiên nhiên với quần thể núi đá vôi, hang động và đầm phá hùng vĩ, lung linh. Nơi đây được thiên nhiên ban tặng đã được hình thành từ hàng triệu năm trước, hệ thống núi đá vôi này là tượng điêu khắc tự nhiên của thời gian, thể hiện sự đa dạng và độc đáo trong từng chi tiết . Trải qua hàng 250 triệu năm, những dãy núi đá vôi đã chịu tác động nhiều bởi khí hậu và thời tiết. Các núi đá vôi ở Tràng An có hình dáng độc đáo cao vút, từng bức tranh núi đa dạng tạo nên một cảnh quan thiên nhiên hùng vĩ và cuốn hút chính vì thế mỗi năm rất nhiều du khách đến tham quan.",
    rating: 4.8,
    price: "3,700,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Tràngràng+An,+Ninh+Bình"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Chuẩn bị mũ, dù, áo mưa, kính mát, kem chống nắng để bảo vệ làn da nhé!",
      "Mang theo đầy đủ giấy tờ tùy thân như giấy phép lái xe, chứng minh nhân dânn.",
      "Bạn cần chuẩn bị những bộ trang phục thoải mái, gọn nhẹ và một đôi giày thể thao để phòng trường hợp tham gia các hoạt động cần đến việc leo núi."
    ],
    Highlights:[
      "Tham quan động Am Tiên, Tam Cốc-Bích Động, Cố đô Hoa LưLư ",
      "Thưởng thức ẩm thực ở Ninh Bình : cơm cháy, các món dê núi,miến lươn",
      "Đi du thuyền để xem hết toàn cảnh Tràng An",
    ],
    
    tag:["Du lịch","Cố đô Hoa Lư","Dê núi"],
  },

  {
    id: 9,
    name: "Đảo Cát Bà-Hải Phòng",
    image: "https://catba.net.vn/wp-content/uploads/2024/10/cat-ba-1.jpg",
    images: [
      "https://www.homepaylater.vn/static/3f99493036343321047e12cfbf30ed99/2ff6b/2_cat_ba_duoc_lot_top_10_diem_den_than_thien_nhat_viet_nam_32d74da982.jpg",
      "https://tour.dulichvietnam.com.vn/uploads/tour/tmp_1617337815.jpg",
      "https://catbafreedom.com/pic/AboutUs/Cat-B_637807094437182654_HasThumb.jpg",
      "https://cdn-i.vtcnews.vn/resize/th/upload/2024/04/17/halo-travel-10361222.jpg",
      "https://www.homepaylater.vn/static/4650cb98b4078cd3178690d350b04253/1471f/4_cat_ba_mang_ve_dep_xung_danh_dao_ngoc_dat_bac_84c3d599b2.jpg"
    ],
    description: "Hòn đảo ngọc giữa vịnh Bắc Bộ",
    fulldescription:
      "Cát Bà là điểm du lịch sinh thái và nghỉ dưỡng hấp dẫn với hệ sinh thái phong phú. Gần một nửa số đảo ở Cát Bà có bãi tắm, thu hút rất đông du khách khi hè đến để thỏa sức đắm mình trong những bãi tắm đẹp, cát trắng mịn và tham gia vào những hoạt động trải nghiệm thú vị như: leo núi, lặn biển, qua đêm trên vịnh… Trong đó, những hành trình được du khách ưa thích nhất là tham quan, khám phá vịnh Lan Hạ, đảo Khỉ, vườn quốc gia Cát Bà, Pháo đài Thần công...",
    rating: 4.6,
    price: "3,500,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Đảo+Cát+Bà,+Hải+Phòng"
    },
    transport: "Otô, Máy bay, Du thuyền",
    notes: [
      "Chuẩn bị mũ, dù, áo mưa, kính mát, kem chống nắng để bảo vệ làn da nhé!",
      "Mang theo đầy đủ giấy tờ tùy thân như giấy phép lái xe, chứng minh nhân dânn.",
      "Không nên tắm biển sau 18h vì thủy triều lên cao."
    ],
    Highlights:[
      "Tham quan làng chài cổ Cái Bèo, đảo khỉ, vườn quốc gia Cát Bà ",
      "Thưởng thức ẩm thực ở Hải Phòng : sam biển, tôm hùm, bề bề",
    ],
    tag:["Du lịch","Hòn ngọc xanh"],
  },
  
  {
    id: 10,
    name: "Chùa Tam Chúc-Hà Nam",
    image:
      "https://imagevietnam.vnanet.vn//MediaUpload/Org/2024/12/13/213-11-8-37.jpg",
      images:[
        "https://dulich9.com/wp-content/uploads/2023/01/Kinh-nghiem-du-lich-chua-Tam-Chuc-03.jpg",
        "https://dulich9.com/wp-content/uploads/2023/01/Kinh-nghiem-du-lich-chua-Tam-Chuc-05.jpg",
        "https://leadtravel.com.vn/wp-content/uploads/2022/01/chua-tam-chuc-ha-nam.jpg",
        "https://ik.imagekit.io/tvlk/blog/2024/08/dia-diem-du-lich-ha-nam-3-1024x673.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2"
      ],
    description: "Nét đẹp cổ kính giữa chốn non nước",
    fulldescription:
      "Chùa Tam Chúc là một trong những ngôi chùa Phật giáo nổi tiếng nhất ở Việt Nam, và cũng là một trong những ngôi chùa lớn nhất thế giới. Chùa Tam Chúc tọa lạc trong một khung cảnh thơ mộng, với trước mặt là hồ nước bát ngát, bao quanh là những dãy núi đá vôi và những khu rừng tự nhiên, mang đến bầu không khí thanh bình, tĩnh lặng cho mọi du khách ghé thăm.",
    rating: 4.6,
    price: "2,700,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Chùa+Tam+Chúc,+Hà+Nam"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo."
    ],
    
    Highlights:[
      "Tham quan du lịch chùa Tam Chúc và các ngôi chùa cổ ở Hà Nam",
      "Tham quan các làng nghề hay các hang động tuyệt đẹp.",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương.",
    ],
   
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 11,
    name: "Đà Nẵng",
    image:
      "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-2.jpg",
    images:[
      "https://i1-dulich.vnecdn.net/2022/06/01/tau-hoa-6702-1654080409.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2dWHXtZM65SsPgFiyiHEQ",
      "https://i1-dulich.vnecdn.net/2022/06/02/gieng-troi-ba-na-nui-chua-da-n-4755-7978-1654169672.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=brbMpDv-EWqD0CpFngGqmA",
      "https://i1-dulich.vnecdn.net/2022/06/02/deo-hai-van-jpeg-2870-1654151745.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=GilXeLUCa4d0TAKOBRRlEA",
      "https://i1-dulich.vnecdn.net/2022/06/02/ghenh-bang-2321-1654169672.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=AAaWcWxk0CTY5wN2h45g1A"
    ],
    description: "Thành phố đáng sống với bãi biển tuyệt đẹp và cầu Rồng.",
    fulldescription:
      "Với những bãi biển xanh mát, những cánh rừng bạt ngàn, những cây cầu “độc nhất vô nhị”, những khu vui chơi giải trí đầy hấp dẫn… Đà Nẵng được ví như một “thiên đường” – nơi có thể đáp ứng mọi nhu cầu giải trí cho bất cứ ai, dù là với những vị khách khó tính nhất. Vì vậy, các địa điểm du lịch Đà Nẵng ngày càng thu hút đông đảo khách tham quan cả trong và ngoài nước.Đà Nẵng là “thành phố du lịch” không chỉ nổi tiếng ở Việt Nam mà còn được yêu thích bởi bạn bè trên khắp năm châu. Nhắc tới Đà Nẵng, người ta không chỉ nghĩ ngay tới những người dân hiền lành và hiếu khách, những khách sạn tiện nghi và độc đáo hay những món ăn có vị ngon khó cưỡng, mà còn cả những địa điểm du lịch vô cùng hấp dẫn và thú vị.",
    rating: 4.8,
    price: "3,500,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Đà+Nẵng"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo."
    ],
    
    Highlights:[
      "Đi du lịch Bà Nà Hills.",
      "Tham quan đảo Sơn Trà, đi trải nghiệm đèo Hải Vân và vô số địa điểm khác.",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương.",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 12,
    name: "Phố cổ Hội An - Quảng Nam ",
    image:
      "https://statics.vinpearl.com/pho-co-hoi-an-di-san-kien-truc-an-tuong-cua-the-gioi-4-1617433336_1660791794.jpg",
    images:[
      "https://toplist.vn/images/800px/pho-co-hoi-an-739076.jpg",
      "https://bazantravel.com/cdn/medias/uploads/72/72226-hoi-an-da-nang-den-long.jpg",
      "https://i1-dulich.vnecdn.net/2022/06/01/Hoi-An-VnExpress-5851-16488048-4863-2250-1654057244.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2ea_f0O7kgGZllKmJF92g",
      "https://i1-dulich.vnecdn.net/2022/06/01/rung-dua-Bay-Mau-1143-16499126-9001-4318-1654057250.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=UIFAbygeKl3283HSd3dlCA"
    ],
    description: "Phố cổ lãng mạn với những chiếc đèn lồng đầy màu sắc.",
    fulldescription:
      "Nằm bên bờ bắc hạ lưu sông Thu Bồn, Hội An là một đô thị cổ tại Quảng Nam, cách thành phố Đà Nẵng hơn 30 km, cách Huế 122 km. Nhắc tới Hội An là phải kể tới các dãy nhà cổ màu vàng nghệ, dòng sông lung linh hoa đăng khi đêm xuống, hay những món ăn ngon giá bình dân. Khí hậu Hội An đan xen khí hậu giữa miền Nam và miền Bắc, rõ rệt mùa mưa và mùa khô. Mỗi mùa phố cổ lại có những nét đẹp riêng. Không ồn ào, náo nhiệt, Hội An mang vẻ đẹp bình lặng và cổ kính. Sức hấp dẫn của đô thị hơn 400 năm tuổi xuất phát từ những kiến trúc cổ, những nhà mái ngói rêu phong, những con phố đèn lồng đầy màu sắc... ",
    rating: 4.9,
    price: "2,800,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Phố+Cổ+Hội+An,+Quảng+Nam"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo."
    ],
    
    Highlights:[
      "Đi dạo phố cổ về đêm.",
      "Tham quan, trải nghiệm các làng nghề, rừng dừa Bảy Mẫu.",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương.",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 13,
    name: "Nha Trang",
    image:
      "https://media.istockphoto.com/id/827359312/vi/anh/to%C3%A0n-c%E1%BA%A3nh-th%C3%A0nh-ph%E1%BB%91-nha-trang-%E1%BB%9F-vi%E1%BB%87t-nam-t%E1%BB%AB-quan-%C4%91i%E1%BB%83m-m%C3%A1y-bay-kh%C3%B4ng-ng%C6%B0%E1%BB%9Di-l%C3%A1i.jpg?s=612x612&w=0&k=20&c=coljvNU4PTpoKVPfTfuNsHh6u9Xs36BI-o6Pmnhq55I=",
    images:[
      "https://activeasia.co.nz/wp-content/uploads/2018/03/Vietnam-Nha-Trang-Destination-3.jpg",
      "https://content.r9cdn.net/rimg/dimg/3c/08/1a8e1f7d-city-46568-169828ca9a6.jpg?width=1366&height=768&xhint=1577&yhint=769&crop=true",
      "https://th.bing.com/th/id/OIP.gqxRsKoqkzQdf6FljbJ99wHaEH?rs=1&pid=ImgDetMain",
      "https://th.bing.com/th/id/OIP.T3GM0LzYnG73y3zioOSZgQHaEK?rs=1&pid=ImgDetMain"
    ],
    description:
      "Thiên đường biển với các resort sang trọng và ẩm thực hải sản.",
    fulldescription:
      "Không hổ danh là thành phố du lịch, Nha Trang nổi tiếng với những resort cao cấp, bãi tắm thơ mộng, hoang sơ, tháp chàm cổ kính, khu vui chơi hiện đại và ẩm thực vùng miền đặc trưng.Ẩm thực ở Hòn Tằm cũng là một điểm níu chân khách du lịch tại nơi đây với những loại hải sản tươi ngon được chế biến vô cùng hấp dẫn. Là 1 nơi đáng để đến du lịch 1 lần trong đời.",
    rating: 4.7,
    price: "4,200,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Nha+Trang"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo."
    ],
    
    Highlights:[
      "Tham quan Vinwonders hay thủy cung Trí Nguyên",
      "Tham quan các hòn đảo xinh đẹp ở Nha Trang",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 14,
    name: "Đà Lạt",
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-da-lat.jpg",
    images:[
      "https://ik.imagekit.io/tvlk/blog/2024/12/dinh-bao-dai.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2024/12/daltala.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2024/12/cau-dat-farm.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2024/12/rung-thong-nui-voi-1024x748.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2"
    ],
    description:
      "Thành phố ngàn hoa với không khí se lạnh và cảnh đẹp thơ mộng.",
    fulldescription:
      "Đà Lạt, thành phố mộng mơ nằm trên cao nguyên Lâm Viên, từ lâu đã là điểm đến yêu thích của du khách trong và ngoài nước. Với khí hậu mát mẻ quanh năm, cảnh quan thiên nhiên tuyệt đẹp và vô số địa điểm du lịch Đà Lạt hấp dẫn, thành phố ngàn hoa hứa hẹn mang đến cho bạn những trải nghiệm khó quên. Từ những thác nước hùng vĩ, những đồi thông xanh ngát đến những công trình kiến trúc độc đáo mang đậm dấu ấn lịch sử, Đà Lạt có đủ sức hút để níu chân bất kỳ ai. Dù bạn là người yêu thích khám phá thiên nhiên, đam mê tìm hiểu văn hóa hay đơn giản chỉ muốn tìm một nơi yên bình để thư giãn, Đà Lạt đều có thể đáp ứng.",
    rating: 4.8,
    price: "4,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Đà+Lạt"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo."
    ],
    
    Highlights:[
      "Nhiều địa điểm check-in tuyệt đẹp và thơ mộng",
      "Tham quan dinh thự Dinh Bảo Đại-vị hoàng đế cuối cùng của Việt Nam",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 15,
    name: "Cố Đô Huế",
    image:
      "https://sohanews.sohacdn.com/160588918557773824/2024/11/5/hmccdinhhoanghoangthanh001-1730775869077-1730775869562679988470.jpg",
    images:[
      "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Falbums%2F17554%2F047e4c5f1fe7501c7af2e6c5afac843c.jpg&w=1920&q=75",
      "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Falbums%2F17554%2F1d192f0ed7a7237695684925b4ccc976.jpg&w=1920&q=75",
      "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Falbums%2F17554%2F37c1ef924faacbbafd7b87b637d9028d.jpg&w=1920&q=75",
      "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Falbums%2F17554%2F016dfa30064d060f4b36267e22ab007a.jpg&w=1920&q=75"
    ],
    description: "Nét đẹp nghìn lịch sử vùng đất Huế",
    fulldescription:
      "Huế, cố đô yên bình bên dòng sông Hương thơ mộng, níu chân du khách bởi vẻ đẹp cổ kính, trầm mặc của những lăng tẩm, đền đài. Đến với Huế, bạn không chỉ được chiêm ngưỡng những công trình kiến trúc độc đáo, mang đậm dấu ấn lịch sử, mà còn được thưởng thức nền ẩm thực cung đình đặc sắc, lắng nghe những làn điệu ca Huế ngọt ngào.Khi du lịch Huế, bạn sẽ đắm mình trong không gian cổ kính của Đại Nội, lăng tẩm, chùa chiền, khám phá những nét độc đáo của văn hóa cung đình, và thưởng thức những món ăn đặc sản đậm đà hương vị miền Trung. Huế còn là nơi lưu giữ những giá trị văn hóa phi vật thể quý giá như nhã nhạc cung đình, ca Huế, và các lễ hội truyền thống. ",
    rating: 4.7,
    price: "3,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Cố+Đô+Huế"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo."
    ],
    
    Highlights:[
      "Đi dạo về đêm, cầu Trường Tiền bắc qua sông Hương thơ mộng về đêm ",
      "Tham quan các di tích lịch sử gắn liền với Cố Đô Huế",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 16,
    name: "Động Phong Nha Kẻ Bàng-Quảng Bình",
    image:
      "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482781qBa/anh-mo-ta.png",
    images:[
      "https://i1-dulich.vnecdn.net/2023/06/15/ho-sut-1-vong-khung-long-8204-1686802737.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=K-nvGBZgMpsysRnm0Imy2Q",
      "https://i1-dulich.vnecdn.net/2023/06/15/ho-sut-2-nhin-tu-tren-cao-2672-1686802737.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=alZ9brw1gtwn9iob2bbeGQ",
      "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-quang-binh-8.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2023/11/go-and-share-dia-diem-du-lich-quang-binh-doc-dao-6-1024x768.webp?tr=q-70,c-at_max,w-500,h-300,dpr-2"
    ],
    description: "Hang động có cửa hang cao và rộng nhất",
    fulldescription:
      "Với nhiều danh lam thắng cảnh nổi tiếng với vẻ đẹp thiên nhiên hoang sơ hùng vĩ, Quảng Bình là điểm đến hấp dẫn của khách du lịch yêu thiên nhiên và đam mê mạo hiểm.Được vinh danh là di sản thiên nhiên thế giới, quần thể hang động Phong Nha – Kẻ Bàng là một điểm đến không thể bỏ lỡ khi du lịch Quảng Bình. Quần thế vườn quốc gia Phong Nha – Kẻ Bàng được tạo hoá ban tặng cho tài nguyên thiên nhiên vô cùng quý giá với hệ thống hang động đá vôi nguyên sơ hùng vĩ và thảm động – thực vật phong phú.",
    rating: 4.7,
    price: "3,200,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Động+Phong+Nha+Kẻ+Bàng,+Quảng+Bình"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo, mang thêm đồ ăn nhẹ khi tham quan ."
    ],
    
    Highlights:[
      "Tham quan các hang động nổi tiếng như hang Sơn Đoòng",
      "Tham quan các di tích lịch sử ",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 17,
    name: "Kỳ Co Beach-Quy Nhơn",
    image:
      "https://ik.imagekit.io/tvlk/blog/2024/07/I2jZ97hQ-dia-diem-du-lich-quy-nhon-0.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
    images:[
      "https://i1-dulich.vnecdn.net/2022/06/17/eogio-chimom-4705-1593164115-1-6736-5082-1655448397.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=cn5aRoYGDxku2K2zk8qm-w",
      "https://ik.imagekit.io/tvlk/blog/2024/07/dia-diem-du-lich-quy-nhon-3.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2024/07/dia-diem-du-lich-quy-nhon-4.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2024/07/dia-diem-du-lich-quy-nhon-5.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2"
    ],
    description: "Vẻ đẹp hoang sơ tại thiên đường biển đảo Quy Nhơn",
    fulldescription:
      "Quy Nhơn - thành phố biển tỉnh Bình Định với những đường bờ biển dài thơ mộng nằm uốn lượn nép mình bên cạnh những dãy núi xinh đẹp. Với đặc trưng phía trước là biển, phía sau là núi đã biến Quy Nhơn trở thành một trong những thành phố du lịch biển xinh đẹp nhất.",
    rating: 4.4,
    price: "3,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Kỳ+Co+Beach,+Quy+Nhơn"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo ."
    ],
    
    Highlights:[
      "Địa điểm check-in với thiên nhiên xanh mướt",
      "Trải nghiệm các hoạt động như lặn biển, dù lượn,... ở Kỳ Co",
      "Ẩm thực phong phú, độc đáo với những món ăn đặc sản địa phương",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },

  {
    id: 18,
    name: "Vịnh Vân Phong - Khánh Hòa",
    image:
      "https://top7vietnam.sgtiepthi.vn/wp-content/uploads/2023/07/diep-son-sa.jpg",
    images:[
      "https://th.bing.com/th/id/OIP.MGCiQuaGvtYlFlBtd5c_jAHaJO?rs=1&pid=ImgDetMain",
      "https://globalopentour.com/wp-content/Uploads/Article/xu-tram-huong-khanh-hoa.jpg",
      "https://th.bing.com/th/id/R.025b1716d2d42bd85a149bb3471d869c?rik=D41LZbWWpMOkhQ&pid=ImgRaw&r=0",
      "https://cdn.tgdd.vn/Files/2022/02/20/1416377/10-dia-diem-du-lich-noi-tieng-nhat-tai-tinh-khanh-hoa-202309261447215189.jpg"
    ],
    description: "Eo Biển Kín Gió Rộng Lớn Tuyệt Đẹp",
    fulldescription:
      "Là một tỉnh thuộc toạ độ du lịch Nam Trung Bộ, Khánh Hòa có bờ biển kéo dài 385km với gần 200 đảo lớn, nhỏ ven bờ và trên 100 đảo, bãi đá ngầm thuộc quần đảo Trường Sa. Khánh Hoà nổi tiếng cho du lịch vì có nhiều bãi tắm đẹp, cát trắng, nước biển trong xanh. Khánh Hòa cũng có Khánh Sơn, được ví như một tiểu Đà Lạt thu nhỏ với khí hậu mát mẻ, trong lành quanh năm.",
    rating: 4.6,
    price: "2,400,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Vịnh+Vân+Phong,+Khánh+Hòa"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo ."
    ],
    
    Highlights:[
      "Check-in Mũi Đôi - Cực Đông trên dất liền Việt Nam ",
      "Tham quan tòa tháp Bảo Tích được làm từ vỏ ốc tại chùa Từ Vân",
      "Ẩm thực phong phú, độc đáo",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 19,
    name: "Đảo Lý Sơn - Quảng Ngãi",
    image:
      "https://images2.thanhnien.vn/528068263637045248/2024/8/29/photo-1724921216696-1724921218643849112847.jpeg",
    images:[
      "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/09/sa-huynh.jpg",
      "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/09/thac-minh-long.jpg",
      "https://i1-dulich.vnecdn.net/2022/05/31/DSCF6510-3680-1592107902-3230-9633-4279-1653965070.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=KL-6WBZOcn8VKTNQYq4UWg",
      "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/09/Kon-chu-rang-flycam.jpg"
    ],
    description: "Kỳ quan thiên nhiên độc đáo",
    fulldescription:
      "Quảng Ngãi là một tỉnh miền Trung của Việt Nam với những bãi biển đẹp và ẩm thực phong phú làm du khách say mê.Là một tỉnh có đường bờ biển rất dài cùng nhiều danh lam thắng cảnh đẹp nổi tiếng, thế nên du lịch Quảng Ngãi luôn là một lựa chọn yêu thích cho những ai muốn khám phá mảnh đất duyên hải miền Trung này.",
    rating: 4.6,
    price: "3,500,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Đảo+Lý+sơn,+Quảng+Ngãi"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo ."
    ],
    
    Highlights:[
      "Tham quan cánh đồng tỏi xanh ngút ngàn",
      " Nhiều địa điểm check-in sống ảo ",
      "Ẩm thực đường phố độc đáo",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 20,
    name: "Mũi Né Beach - Phan Thiết",
    image: 
      "https://static.vinwonders.com/production/du-lich-mui-ne-1.webp",
    images:[
      "https://saigontourist.net/uploads/destination/TrongNuoc/Phanthiet/Mui-Ne_131634443.jpg",
      "https://dhtravel.com.vn/upload/product/centara-mirage-resort-mui-ne-7169.jpeg",
      "https://kenhhomestay.com/wp-content/uploads/2019/02/Dia-diem-du-lich-Phan-Thiet-Mui-Ne-Binh-Thuan-32.jpg",
      "https://th.bing.com/th/id/OIP._P3FI5ygOqkaJPPWrhukAAHaHa?rs=1&pid=ImgDetMain"
    ],
    description: "Nét đẹp hoang sơ và hiện đại trên vùng biển",
    fulldescription:
      "Phan Thiết có diện tích khoảng 200 km2, cảnh quan thiên nhiên đa dạng, có tuyến đường ven biển đẹp dài hàng chục km và những di tích lịch sử của nền văn minh Chăm Pa hưng thịnh một thời.",
    rating: 4.4,
    price: "2,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Mũi+Né+Beach,+Phan+Thiết"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo ."
    ],
    
    Highlights:[
      "Check-in sống ảo đến biển đá Ông Địa",
      "Trải nghiệm các hoạt động ở đồi Cát Bay",
      "Ẩm thực đường phố độc đáo",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 21,
    name: "Hồ Chí Minh",
    image:
      "https://th.bing.com/th/id/R.4406947c331766e13e13e67f143e19f1?rik=bK1DCfWAKPeihA&pid=ImgRaw&r=0",
    images:[
      "https://lh4.googleusercontent.com/xMNioNmaZwNMIy5-vCWvOZRahKpGhL-DjGtnmct1BO3GpXFFlfd5bDkM-PdfXd64GTaEjawYuGBg6ASGG-eBfNiXGKQsN8xhRoUr-Cb6EvSwjZxkYMZhiB8zQLaQ9MgAHSdJzN-Eew0h0wajp-G8Ijo",
      "https://lh3.googleusercontent.com/zEKzZBVplA4mBq6TBgW1Ofi6cmh_6sEta7Q4U6zPTgQoC79arEjbeNvPXmABlAvrxylWPeX4wJWe-EoBKnECC0w625cg0ylNIIXbwFoY2RR-rEMuIAV0L27XwhVvsxX516shsSX3I7qHkt9Xh13A6go",
      "https://lh3.googleusercontent.com/D1e21TvKYZYRCD5Gqm8eE2xjI04nkGKXo9ru9toqJyCQAHloSbX1vcYVENyiRy7MZbkplvGbEbw6A2fePaj6N3qj0jm1ECz4U6mvpwqe3nheFTBowFOCXEUQZyHqYJrz98OAb6AryVvfh0qNw7tjDro",
      "https://lh5.googleusercontent.com/qGwjokO-2yegHswtiD2ZijIuKIgzR_NNKfAyC3h-O6g4VdkIzrjlzLyPhEfY2GWJr1kfYTDMw7iZDBJrWi3e71UDA2xyGyF4ZyhFTqLEEH7EpwLQxH54-9HY5Eml4m4WYtlGzm8UV0MbEQ4BQbPR5Uk"
    ],
    description:
      "Thành phố sôi động với nền ẩm thực phong phú, di tích lịch sử và nhịp sống hiện đại.",
    fulldescription:
      "TP HCM là nơi hội tụ nhiều nền văn hóa, với các sản phẩm du lịch đa dạng, là thành phố không ngủ với những hoạt động vui chơi, giải trí sôi động cả ngày lẫn đêm..Với sự kết hợp giữa vẻ đẹp của thiên nhiên, kiến trúc độc đáo, văn hóa nổi bật và sự phong phú trong ẩm thực, TP.HCM là một trong những điểm du lịch hàng đầu tại Việt Nam. Du khách sẽ có thể tận hưởng những trải nghiệm độc đáo và khám phá những điều mới mẻ trong thành phố này.",
    rating: 5.0,
    price: "5,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Thành+phố+Hồ+Chí+Minh"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo ."
    ],
    
    Highlights:[
      "Dinh Độc Lập là một trong những địa điểm tham quan k thể bỏ qua ",
      "Tham quan di tích Địa đạo củ chi ",
      "Ẩm thực đường phố tại phố Tây",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 22,
    name: "Cột mốc Quốc gia Đất Mũi - Cà Mau",
    image:
      "https://th.bing.com/th/id/OIP.2x0ylcZ-HQOjF-Osn3JgAgHaFj?w=287&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    images:[
      "https://th.bing.com/th/id/R.87ec9a148af4d8a8e17b8fb6fa2ab1ff?rik=uGT5fxFOZrthdw&riu=http%3a%2f%2fadvmotorcycletours.com%2fwp-content%2fuploads%2f2016%2f10%2fCa-Mau-Vietnam.jpg&ehk=FA2TeVkTDSoz4S5PNVMc%2bkpkxZlegsL0h6NxdN%2frciI%3d&risl=&pid=ImgRaw&r=0",
      "https://thamhiemmekong.com/wp-content/uploads/2020/05/khudulichhondabac.jpg",
      "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/14-2.jpg",
      "https://vietnamtouristvn.com/upload/elfinder/NewFolder/C%C3%80%20MAU/R637951991061234440.png"
    ],
    description: "Đất Mũi - Cà Mau: Nơi tận cùng phía Nam của tổ quốc.",
    fulldescription:
      "Mảnh đất cực Nam Tổ Quốc – Cà Mau sông nước là điểm đến thu hút khách du lịch bởi những con người chân chất, thật thà cùng cảnh sắc thiên nhiên miền sông nước trữ tình. Cà Mau là tỉnh cực nam của Việt Nam, thuộc khu vực Đồng bằng châu thổ sông Cửu Long. Mảnh đất tận cùng của tổ quốc có ba mặt tiếp giáp với biển: phía đông là biển Đông, phía tây và phía nam là vịnh Thái Lan, phía Bắc giáp Bạc Liêu và Kiên Giang. Về Cà Mau, du khách sẽ nghe chuyện Bác Ba Phi, đờn ca tài tử, du ngoạn sông nước, ăn đặc sản của rừng, cua biển...",
    rating: 4.6,
    price: "3,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Cột+mốc+Quốc+gia+Đất+Mũi,+Cà+Mau"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo ."
    ],
    
    Highlights:[
      "Tham quan di tích lịch sử Hòn Đá Bạc",
      "Đến rừng quốc gia U Minh Hạ Ngồi thuyền đi giữa cánh rừng nguyên sơ ",
      "Ẩm thực phong phú, đa dạng, người dân hiền hòa, nhân hậu",
    ],
   
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 23,
    name: "Bạc Liêu",
    image:
      "https://cdn.tgdd.vn/Files/2021/07/02/1365015/22-dia-diem-du-lich-bac-lieu-vo-cung-hap-dan-tha-ho-check-in-202206041924462109.jpg",
    images:[
      "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-bac-lieu-cover.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-bac-lieu-2.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-bac-lieu-22.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-bac-lieu-36.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2"
    ],
    description:
      "Vùng đất miền Tây sông nước, giai thoại về cuộc đời Công tử Bạc Liêu.",
    fulldescription:
      "Bạc Liêu là 1 trong 13 tỉnh của miền Tây Nam Bộ và thuộc khu vực đồng bằng sông Cửu Long. Nơi đây còn là một vùng đất “phủ” vàng bởi nhiều cánh đồng lúa trù phú và nổi tiếng với câu chuyện công tử Bạc Liêu. So với nhiều tỉnh miền Tây khác, Bạc Liêu được xem là một trong những “thiên đường” du lịch với cực nhiều điểm check-in thú vị. ",
    rating: 4.5,
    price: "3,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Bạc+Liêu"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo ."
    ],
    
    Highlights:[
      "Nghe đờn ca tài tử với bài Dạ cổ hoài lang",
      "Tham quan các di tích như Nhà công tử Bạc Liêu ",
      "Ẩm thực phong phú, đa dạng, người dân hiền hòa, nhân hậu",
    ],
    
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 24,
    name: "Đồng Tháp",
    image:
      "https://th.bing.com/th/id/OIP.VXtUmvY2AtW9-zWtQwhiTgHaDt?rs=1&pid=ImgDetMain",
    images:[
      "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-dong-thap-4.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-dong-thap-15.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://th.bing.com/th/id/OIP.XREGuSVIXr34BmCvJAtIigHaFS?rs=1&pid=ImgDetMain",
      "https://th.bing.com/th/id/OIP.KIdL_Bs7q3p2IgcIwAPBXQHaFY?w=1746&h=1268&rs=1&pid=ImgDetMain"
    ],
    description:
      "Những cánh đồng hoa sen bát ngát, nét bình yên của khung cảnh làng quê thanh bình.",
    fulldescription:
      "Với diện tích trải rộng ở cả hai bờ sông Tiền, Đồng Tháp nổi tiếng với các cánh đồng lúa trù phú chạy dọc theo những con kênh hiền hòa cùng những cánh rừng nguyên sinh và hồ sen thơm ngát. Không chỉ có thiên nhiên rực rỡ, vùng đất miền Tây Nam Bộ này còn có rất nhiều tọa độ du lịch thú vị.Cùng với làng hoa Sa Đéc, nhà cổ Huỳnh Thủy Lê cũng là điểm tham quan hấp dẫn ở Đồng Tháp gắn liền với lịch sử phát triển của vùng đất này. Được xây dựng từ năm 1895 tại khu vực mua bán sầm uất ven sông Sa Đéc, ngôi nhà đã trải qua trùng tu và trở thành công trình kết hợp hài hòa giữa kiến trúc phương Đông và phương Tây.",
    rating: 4.6,
    price: "2,600,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Đồng+Pháp"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo và nên đi vào tháng 9 - tháng 11."
    ],
    
    Highlights:[
      "Check-in ở làng hoa Sa Đéc",
      "Khu du lịch Xẻo Quýt để chiêm ngưỡng vẻ hoang sơ ",
      "Ẩm thực phong phú, đa dạng",
    ],
   
    tag:["Thiên nhiên","Ẩm thực","Văn hóa","Lịch sử"]
  },
  {
    id: 25,
    name: "Phú Quốc - Kiên Giang",
    image:
      "https://th.bing.com/th/id/OIP.zyD01et0TLnf5EErrHeR4QHaEA?rs=1&pid=ImgDetMain",
    images:[
      "https://th.bing.com/th/id/R.4f6baec488b8b4e134dc0b7ad8202145?rik=5%2fs5WqrljbpQmg&riu=http%3a%2f%2finboundvietnam.com%2ffiles%2fimages%2fCam-nang%2f07.jpg&ehk=rJZ7AcswB2eCGTNUr8V6ASmm5yhvF3126NMxrarzlyE%3d&risl=&pid=ImgRaw&r=0",
      "https://th.bing.com/th/id/R.241dad844dcbc68923c8d025f3c52ed5?rik=xB7%2bxW82xxZ1yg&pid=ImgRaw&r=0",
      "https://th.bing.com/th/id/OIP.5KFn1-1Oiiadc7_3qcufuAHaE8?rs=1&pid=ImgDetMain",
      "https://i1-dulich.vnecdn.net/2022/04/08/shutterstock-1528713263-5275-1-9438-7316-1649405357.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=0l2L0SItOJBteHCDLHdSbg"
    ],
    description: "Hòn đảo đẹp nhất miền Nam.",
    fulldescription:
        "Quần đảo Phú Quốc nằm trong vịnh Thái Lan, cách TP HCM khoảng 400 km về hướng tây. Nơi đây thu hút du khách trong và ngoài nước bởi các loại hình du lịch đa dạng, với tài nguyên biển, đảo phong phú; hệ sinh thái rừng, biển đa dạng.Vùng biển Phú Quốc có 22 hòn đảo lớn, nhỏ, tổng diện tích khoảng 589,23 km2. Trong đó, đảo Phú Quốc lớn nhất được chia thành bắc đảo và nam đảo. Thị trấn Dương Đông nằm ở trung tâm.",
    rating: 4.8,
    price: "5,600,000",
    location:{
      mapUrl:"https://www.google.com/maps?q=Phú+Quốc,+Kiên+Giang"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo và tinh thần sẵn sàng cho chuyến đi chơi."
    ],
   
    Highlights:[
      "Đi Công Viên VinWonders Phú Quốc",
      "Sống Ảo Ở Sunset Sanato Beach Club,Bay Dù Lượn ở Sunset Town Phú Quốc",
      "Ẩm thực phong phú, đa dạng",
    ],
   
    tag:["Thiên nhiên","Ẩm thực","Văn hóa"]
  },

  {
    id: 26,
    name: "Núi Bà Đen - Tây Ninh",
    image:
      "https://images.vietnamtourism.gov.vn/vn/images/2021/thang_8/2508.du_lich_nui_ba_den_chinh_phuc_noc_nha_nam_bo_1.jpg",
    images:[
      "https://diadiemvietnam.vn/wp-content/uploads/2022/12/Nui-Ba-Den.jpg",
      "https://statics.vinpearl.com/hinh-anh-du-lich-nui-ba-den-tay-ninh-4.jpg",
      "https://th.bing.com/th/id/OIP.N_iYLMEgEIy56zZzzQxaOQHaFj?rs=1&pid=ImgDetMain",
      "https://52hz.vn/wp-content/uploads/2022/11/ma-thien-lanh-tay-ninh-toan-canh.jpg"
    ],
    description: "Nơi được mệnh danh là Đệ nhất thiên sơn",
    fulldescription:
        "Tây Ninh từ lâu đã ghi dấu ấn trên bản đồ du lịch Việt Nam như một vùng đất thấm đẫm văn hóa tâm linh, nơi hội tụ những giá trị truyền thống và tín ngưỡng độc đáo.Bên cạnh những công trình tôn giáo quen thuộc, hành trình du lịch tâm linh tại Tây Ninh còn đưa bạn đến với hai tàn tích cổ xưa: Tháp Cổ Bình Thạnh và Tháp Chóp Mạt, nơi lưu giữ hơi thở của nền văn minh đã lùi vào dĩ vãng.",
    rating: 4.5,
    price: "4,200,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Núi+Bà+Đen,+Tây+Ninh"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
      "Tránh mang theo nhiều tiền mặt khi đi dạo."
    ],
    
    Highlights:[
      "Tham quan các Tháp cổ",
      "Lên núi Bà Đen, cắm trại săn mây trên đỉnh núi",
      "Ẩm thực phong phú, đa dạng",
    ],
    
    tag:["Thiên nhiên","Lịch sử","Ẩm thực","Văn hóa"]
  },

  {
    id: 27,
    name: "Tp Cần Thơ",
    image:
      "https://tourcantho.vn/wp-content/uploads/kien-truc-cau-tinh-yeu.jpg",
    images:[
      "https://th.bing.com/th/id/R.da762b58a51395444a48de30505dbe11?rik=sCGIUEbH6otc1w&pid=ImgRaw&r=0",
      "https://ticotravel.com.vn/wp-content/uploads/2022/05/Can-Tho-co-gi-vui-12-1024x550.jpg",
      "https://th.bing.com/th/id/OIP.eESWGUmqI9hPuW2ZZsnamAHaE7?rs=1&pid=ImgDetMain",
      "https://thamhiemmekong.com/wp-content/uploads/2019/05/langdulichmykhanh-02-1024x682.jpg"
    ],
      description: "Duyên thầm của mảnh đất phương Nam.",
      fulldescription:
        "Cần Thơ là xứ Tây Đô với những con người chân phương và cảnh sắc miền sông nước bình dị mà cuốn hút. Với chợ đầu mối chuyên trao đổi, mua bán các mặt hàng nông sản, trái cây, thực phẩm, ăn uống đồng thời là địa điểm tham quan mang đậm bản sắc vùng sông nước,bến Ninh Kiều, chợ đêm hay những câu ca dân ca Nam Bộ.",
      rating: 5.0,
      price: "4,500,000đ",
      location:{
        mapUrl:"https://www.google.com/maps?q=Thành+phố,+Cần+Thơ",
      },
      transport: "Otô, Máy bay",
      notes: [
        "Mang theo giấy tờ tùy thân bản gốc.",
        "Chuẩn bị  giày, dép đi bộ thoải mái và quần áo đẹp cho nhưng chuyến đi chơi.",
        "Tránh đi vào các ngày cuối tuần, ngày lễ Tết."
      ],
      
      Highlights:[
        "Trải nghiệm chợ nổi Cái Răng",
        "Bến Ninh Kiều về đêm",
        "Ẩm thực phong phú, đa dạng",
      ],
      
      tag:["Thiên nhiên","Lịch sử","Ẩm thực","Văn hóa"]
  },
  {
    id: 28,
    name: "Côn Đảo - Bà Rịa-Vũng Tàu ",
    image:
      "https://th.bing.com/th/id/R.067ea9871006caae2cb80b6ac7583338?rik=cfOjUu4Ief4ExA&pid=ImgRaw&r=0",
    images:[
      "https://hinhanhonline.com/Images/Album/DulichVietNam/du-lich-con-dao-01.jpg",
      "https://ik.imagekit.io/tvlk/blog/2023/01/go-and-share-trai-nghiem-choi-gi-o-con-dao-21-1024x768.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2023/01/go-and-share-trai-nghiem-choi-gi-o-con-dao-26-1024x768.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
      "https://ik.imagekit.io/tvlk/blog/2023/09/nha-tu-con-dao-3.jpeg?tr=dpr-2,w-675"
    ],
    description: "Hòn đảo hoang dại và quyến rũ bậc nhất.",
    fulldescription:
      "Côn đảo là một quần đảo ngoài khơi Bà Rịa - Vũng Tàu. Quần đảo rộng 76 km2 này bao gồm 16 hòn đảo, lớn nhất là đảo Côn Sơn. Côn Đảo cách Vũng Tàu 185 km, cách TP HCM 230 km, cách Cần Thơ khoảng 83 km. Dịch vụ giao thông, lữ hành, lưu trú, ăn uống trên đảo phát triển khiến địa danh này ngày càng thăng hạng trên bản đồ du lịch.",
    rating: 4.4,
    price: "6,000,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Côn+Đảo,+Bà+Rịa+Vũng+Tàu",
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày đi bộ thoải mái và quần áo nhẹ cho các cuộc phiêu lưu ngoài trời.",
      "Nhớ mang theo thuốc chống côn trùng, một ít đồ ăn nhẹ ."
    ],
    
    Highlights:[
      "Tham quan nhà tù Côn Đảo",
      "Trải nghiệm du lịch sinh thái ngoài khơi Côn Đảo.",
      "Ẩm thực phong phú, đa dạng",
    ],
    
    tag:["Thiên nhiên","Lịch sử","Ẩm thực","Văn hóa"]
  },
  {
    id: 29,
    name: "Rừng Tràm Trà Sư - An Giang",
    image:
      "https://top10angiang.vn/wp-content/uploads/2021/06/rung-tram-tra-su-an-giang-1-1536x1536.jpg",
    images:[
      "https://thamhiemmekong.com/wp-content/uploads/2019/09/rung-tram-tra-su-an-giang-1024x684.jpg",
      "https://thamhiemmekong.com/wp-content/uploads/2019/09/rungtramtrasu-3-1024x683.jpg",
      "https://thamhiemmekong.com/wp-content/uploads/2019/09/rungtramtrasu1-1-1024x667.jpg",
      "https://thamhiemmekong.com/wp-content/uploads/2019/09/rungtramtrasu-1-1024x768.jpg"
    ],
    description: "Nét đẹp của đồng bằng & núi đồi hòa quyện.",
    fulldescription:
      " Rừng tràm Trà Sư là tên gọi cánh rừng có nhiều cây tràm tọa lạc gần khu vực núi Trà Sư của huyện Tịnh Biên, An Giang.Với không gian bạt ngàn màu xanh của tràm cùng với bức tranh muôn màu muôn vẻ của hệ thống thực, động vật… rừng tràm Trà Sư không chỉ là điểm đến khó thể bỏ qua đối với du khách, mà còn được được đánh giá có tầm quan trọng quốc tế trong công tác bảo tồn đất ngập nước tại Đồng bằng sông Cửu Long.",
    rating: 4.4,
    price: "5,500,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Rừng+Tràm+Trà+Sư,+An+Giang"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày đi bộ thoải mái và quần áo nhẹ cho các cuộc phiêu lưu ngoài trời.",
      "Nhớ mang theo thuốc chống côn trùng, một ít đồ ăn nhẹ ."
    ],
    
    Highlights:[
      "Trải nghiệm không gian thiên nhiên rừng tràm",
      "Ngắm hệ sinh thái động thực vật khi mùa lũ về.",
      "Trải nghiệm món ăn ngon",
    ],
    
    tag:["Thiên nhiên","Lịch sử","Ẩm thực","Văn hóa"]
  },
  {
    id: 30,
    name: "Vườn quốc gia Cát Tiên",
    image:
      "https://52hz.vn/wp-content/uploads/2021/12/52hz-nam-cat-tien.jpg",
    images:[
      "https://4.bp.blogspot.com/-kFOXM_jbX5E/WwUin_GmEUI/AAAAAAAASv4/y8D2aqPIkSoGeyxnxCwB2BO8OuVViKAuwCLcBGAs/s1600/vuon-quoc-gia-cat-tien-7.jpg",
      "https://th.bing.com/th/id/OIP.YuWpOiMVQ0hCcJIz0lDcCwHaFj?rs=1&pid=ImgDetMain",
      "https://1.bp.blogspot.com/-mZYWIK9syEo/WwUhAqDL1UI/AAAAAAAAStY/Log26VOh8qQ75wsYI3L48rW74no0PCaZwCLcBGAs/s1600/vuon-quoc-gia-cat-tien-1.jpg",
      "https://th.bing.com/th/id/R.0e0e7bb9bb1ab64e04d5e802f7bc6a80?rik=56inNvAPXuAC3w&riu=http%3a%2f%2freviewvilla.vn%2fwp-content%2fuploads%2f2022%2f06%2fdu-lich-vuon-quoc-gia-cat-tien-1.jpg&ehk=igJckCMDoAHCYddjUZHsO1duO81XbBqaY2jTaBZtHQE%3d&risl=&pid=ImgRaw&r=0"
      ],
    description: "Nét đơn sơ, mộc mạc của đất miền Nam.",
    fulldescription:
      " Trải dài trên 3 tỉnh Đồng Nai, Lâm Đồng và Bình Phước với diện tích 71.187,9 ha được bao quanh bởi hơn 80 km sông Đồng Nai, chứa đựng nguồn gene đa dạng sinh học phong phú, Vườn quốc gia Cát Tiên có chức năng quan trọng trong việc kiến tạo hệ sinh thái, bảo tồn đa dạng sinh học, đồng thời đóng góp vai trò to lớn trong việc tạo sinh kế và củng cố đời sống cho người dân vùng đệm.",
    rating: 4.8,
    price: "1,500,000đ",
    location:{
      mapUrl:"https://www.google.com/maps?q=Vườn+Quốc+Gia+Cát+Tiên"
    },
    transport: "Otô, Máy bay",
    notes: [
      "Mang theo giấy tờ tùy thân bản gốc.",
      "Chuẩn bị  giày đi bộ thoải mái và quần áo nhẹ cho các cuộc phiêu lưu ngoài trời.",
      "Nhớ mang theo thuốc chống côn trùng, một ít đồ ăn nhẹ ."
    ],
    
    Highlights:[
      "Trải nghiệm trekking, đi bộ xuyên rừng tại VQG. Nam Cát Tiên",
      "Đi thuyền trên hồ Bàu Sấu",
      "Bản làng Tà Lài",
    ],
   
    tag:["Thiên nhiên","Lịch sử","Ẩm thực"]
  },
];

export default destinations;


