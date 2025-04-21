const hotel = [
  {
    id: 1,
    name: "InterContinental Hanoi Westlake",
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max500/415266730.jpg?k=742704f0730579462e8389fb12f8b1a0d95117921cb6bcf4d402dbc10f168a89&o=",
      "https://cf.bstatic.com/xdata/images/hotel/max500/8878372.jpg?k=56878ea8cd14875b5a52d9d9a53dd425b9fcaae106173d39db055767708faef8&o=",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/324544271.jpg?k=7336f7a046ffd5b7de46df24cd49b1f66e3aa42f375bec20b3bd3a76511482b1&o=&hp=1",
    ],
    description: "Khách sạn 4 sao với tiện nghi hiện đại.",
    fullDescription: "Nằm ở trung tâm TP Hà Nội, khách sạn có hồ bơi, spa, nhà hàng...",
    address: "5 Tu Hoa Street, Tay Ho District, Quận Tây Hồ, Hà Nội",
    rating: 4.9,
    amenities: ["Wifi", "Bể bơi", "Nhà hàng", "Spa", "Bãi đậu xe", "Xe đưa đón", "Bữa sáng tuyệt vời"],
  },
  {
    id: 1,
    name: "Sofitel Legend Metropole Hanoi",
    images: [
      "https://lh3.googleusercontent.com/proxy/ooJcUDpGvXB7bZBGSIejigORc7-Q90TeCIKU-xR-s2tGxRnAZ8P3NDDsrw8xAZzXPLWmkFeHdhbuzTlMw4UkSkrBhJJqIVcyQDrXGA2Fq2TfnVcC62mIP5cLq2I7DkmYHX70wpZR22_9cgj0ksHrdys4mDhThA=s680-w680-h510",
      "https://lh3.googleusercontent.com/p/AF1QipOdlai3bikg29qcUqqlYY0kHJrFUBuedNE5z6Ew=s680-w680-h510",
    ],
    description: "Khách sạn 5 sao lịch sử giữa lòng thủ đô.",
    fullDescription: "Sofitel Metropole là một biểu tượng tại Hà Nội với dịch vụ đẳng cấp thế giới.",
    address: "15 Ngo Quyen, Hoan Kiem, Hà Nội",
    rating: 4.8,
    amenities: ["Wifi", "Nhà hàng", "Spa", "Fitness", "Bar", "Dịch vụ cao cấp"],
  },
  {
    id: 1,
    name: "Lotte Hotel Hanoi",
    images: [
      "https://www.lottecenter.com.vn/vn/wp-content/themes/coralis/images/home/img/mask-group@1x.png",
      "https://www.lottecenter.com.vn/wp-content/themes/coralis/images/home/img/T%C3%B2a%20Nh%C3%A0%20Lotte%201.jpg"
    ],
    description: "Khách sạn cao cấp trong tòa nhà chọc trời Lotte Center.",
    fullDescription: "Tọa lạc trên cao với view tuyệt đẹp, phòng nghỉ sang trọng và tiện nghi hiện đại.",
    address: "54 Lieu Giai, Ba Dinh, Hà Nội",
    rating: 4.6,
    amenities: ["Wifi", "Bể bơi", "Fitness", "Sky Bar", "Trung tâm thương mại"],
  },
  {
    id: 1,
    name: "The Oriental Jade Hotel",
    images: [
      "https://lh3.googleusercontent.com/proxy/Be7lW__dKR3zQtBEuolm3OjoRhx5fguGllM8fZ93vLEROXznk7v01FwmaDW16iE2zWZwZEfLOI3gRa6BKimHdFyvSOoxtMxr-GcBqr-divIBtlCen-fmQwy7nYf_N99AWgWC4QgxWKuA6FYAItacaRkrxaa2Gg=s680-w680-h510",
      "https://lh3.googleusercontent.com/proxy/6DLanFLWcxdzN4HCmIa3lRQfqmrKjBbQ5a6rhkuiuVQ8VGuhl26XEaOlCVTKO70QFtRV4k9QcHTGO-qMiZG_9MD8vvBBCYqZDwC_wR1cwN1vPyCs5MjiimzSAgiLv_RzwCNv6SO8vSUlhz-I0L4dEGxfsOTBmnM=s680-w680-h510"
    ],
    description: "Khách sạn boutique cao cấp tại trung tâm Hà Nội.",
    fullDescription: "The Oriental Jade Hotel nổi bật với hồ bơi tầng thượng, spa và vị trí gần Hồ Hoàn Kiếm.",
    address: "92-94 Hang Trong, Hoan Kiem, Hà Nội",
    rating: 4.7,
    amenities: ["Wifi", "Bể bơi", "Spa", "Sky Bar", "Phòng Gym", "View đẹp"],
  },
  {
    id: 3,
    name: "Khách sạn Mường Thanh Cao Bằng",
    images: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/a3/7a/30/mu-ng-thanh-luxury-cao.jpg?w=900&h=500&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/9f/53/a8/mu-ng-thanh-luxury-cao.jpg?w=900&h=-1&s=1",
    ],
    description: "Khách sạn 4 sao với tiện nghi hiện đại.",
    fullDescription: "Nằm ở trung tâm TP Cao Bằng, khách sạn có hồ bơi, spa, nhà hàng...",
    address: "78 Kim Đồng, TP Cao Bằng, Cao Bằng",
    rating: 4.7,
    amenities: ["Wifi", "Bể bơi", "Nhà hàng", "Spa", "Bãi đậu xe"],
  },
];

// Phần này để nguyên
// export const hotelsList = hotel;
// export function getHotelsByDestinationId(destinationId) {
//   return hotelsList.filter((hotel) => hotel.id === destinationId);
// }
//
// export default hotelsList;
// 2. Cập nhật hàm trong khach_San.js để đảm bảo chức năng lọc hoạt động đúng
export const hotelsList = hotel;

export function getHotelsByDestinationId(destinationId) {
  // Đảm bảo destinationId là số
  const numDestId = parseInt(destinationId);
  // Trả về tất cả các khách sạn có id trùng với destinationId
  return hotelsList.filter((hotel) => hotel.id === numDestId);
}

export default hotelsList;
