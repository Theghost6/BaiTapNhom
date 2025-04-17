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
    fullDescription:
      "Nằm ở trung tâm TP Hà Nội, khách sạn có hồ bơi, spa, nhà hàng...",
    address: "5 Tu Hoa Street, Tay Ho District, Quận Tây Hồ, Hà Nội",
    rating: 4.9,
    amenities: ["Wifi", "Bể bơi", "Nhà hàng", "Spa", "Bãi đậu xe","Xe đưa đón","Bữa sáng tuyệt vời"],
  },
  {
    id: 3,
    name: "Khách sạn Mường Thanh Cao Bằng",
    images: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/a3/7a/30/mu-ng-thanh-luxury-cao.jpg?w=900&h=500&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/9f/53/a8/mu-ng-thanh-luxury-cao.jpg?w=900&h=-1&s=1",
    ],
    description: "Khách sạn 4 sao với tiện nghi hiện đại.",
    fullDescription:
      "Nằm ở trung tâm TP Cao Bằng, khách sạn có hồ bơi, spa, nhà hàng...",
    address: "78 Kim Đồng, TP Cao Bằng, Cao Bằng",
    rating: 4.7,
    amenities: ["Wifi", "Bể bơi", "Nhà hàng", "Spa", "Bãi đậu xe"],
  },
];

//Phần này để nguyên
export const hotelsList = hotel;
export function getHotelsByDestinationId(destinationId) {
  return hotelsList.filter((hotel) => hotel.id === destinationId);
}

export default hotelsList;
