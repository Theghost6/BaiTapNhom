import React from 'react';
import '../../style/Blog.css';

// Sample image import (you can replace this with actual images for each post)
import image1 from '/photos/a.jpg';
import image2 from '/photos/a.jpg';
import image3 from '/photos/a.jpg';
import image4 from '/photos/a.jpg';
import image5 from '/photos/a.jpg';
import { image } from 'framer-motion/client';

const Blog = () => {
  const blogData = [
    {
      title: 'DDR5 RAM: Bước tiến tốc độ trong build PC 2025',
      description: 'DDR5 ngày càng phổ biến trong các bộ PC hiệu năng cao, mang lại tốc độ vượt trội và hỗ trợ tối ưu cho các vi xử lý thế hệ mới.',
      date: 'April 8, 2025',
      category: 'Hardware',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/ram.jpg',
    },
    {
      title: 'Top 5 phần mềm tối ưu hệ thống Windows không thể thiếu',
      description: 'Giới thiệu những phần mềm hàng đầu giúp dọn dẹp, tối ưu hiệu suất và bảo vệ máy tính Windows khỏi rác và phần mềm độc hại.',
      date: 'May 1, 2025',
      category: 'Software',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/w.jpg',
    },
    {
      title: 'M.2 Gen 5 SSD: Chuẩn lưu trữ siêu nhanh cho gaming và sáng tạo nội dung',
      description: 'Ổ cứng M.2 Gen 5 mang lại tốc độ vượt trội, phù hợp cho người dùng chuyên nghiệp và game thủ muốn giảm thời gian tải xuống gần như bằng 0.',
      date: 'March 18, 2025',
      category: 'Storage',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/ssd.jpg',
    },
    {
      title: 'Mini PC Workstation: Xu hướng làm việc nhỏ gọn mà mạnh mẽ',
      description: 'Mini PC đang thay thế dần desktop truyền thống trong văn phòng hiện đại, nhờ thiết kế gọn nhẹ nhưng vẫn mạnh mẽ và dễ nâng cấp.',
      date: 'February 20, 2025',
      category: 'PC Builds',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/mini.jpg',
    },
    {
      title: 'Chuột công thái học 2025: Bảo vệ cổ tay khi làm việc lâu dài',
      description: 'Dụng cụ ngoại vi như chuột công thái học ngày càng được ưu tiên, giúp giảm đau cổ tay và tăng hiệu suất làm việc.',
      date: 'January 30, 2025',
      category: 'Accessories',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/mouse.jpg',
    }
    ,
    {
      title: 'Build PC chơi game 2K với RTX 4070 Super: Cân mọi tựa game 2025',
      description: 'Một cấu hình lý tưởng để chiến game ở độ phân giải 1440p, tận dụng sức mạnh của RTX 4070 Super và CPU AMD Ryzen 7 7800X3D.',
      date: 'May 5, 2025',
      category: 'PC Builds',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/stream.jpg',

    },
    {
      title: 'Cấu hình tối ưu cho streamer: Vừa chơi vừa livestream mượt mà',
      description: 'Khám phá cấu hình cân bằng giữa GPU mạnh mẽ và CPU đa nhân để hỗ trợ quay màn hình, encode và livestream cùng lúc không giật lag.',
      date: 'April 18, 2025',
      category: 'Streaming Setup',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/build(1).jpg',

    },
    {
      title: 'PC mini ITX siêu nhỏ gọn mà vẫn mạnh mẽ – Xu hướng 2025',
      description: 'Những bộ máy ITX nhỏ nhưng đầy đủ sức mạnh cho game và công việc, phù hợp không gian làm việc hiện đại và di động.',
      date: 'March 26, 2025',
      category: 'Mini PC',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/mini(2).jpg',

    },
    {
      title: 'Build PC tiết kiệm dưới 15 triệu VNĐ cho học sinh – sinh viên',
      description: 'Một cấu hình hợp lý dành cho học tập, giải trí nhẹ, có khả năng nâng cấp trong tương lai mà không tốn quá nhiều ngân sách.',
      date: 'February 12, 2025',
      category: 'Budget Builds',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/build(2).jpg',
    },
    {
      title: 'Chọn nguồn PSU chuẩn ATX 3.1 cho card màn hình thế hệ mới',
      description: 'Các GPU mới yêu cầu nguồn chuẩn ATX 3.1 có dây 12VHPWR – tìm hiểu cách chọn PSU an toàn, hiệu quả cho build PC hiện đại.',
      date: 'January 28, 2025',
      category: 'Power Supply',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/psu.jpg',
    },
    {
      title: 'Cách chọn CPU phù hợp: Ưu tiên hiệu năng hay số nhân?',
      description: 'Tìm hiểu cách chọn vi xử lý cho từng nhu cầu: gaming, đồ họa hay làm việc đa nhiệm, cùng những lưu ý khi so sánh Intel và AMD.',
      date: 'May 7, 2025',
      category: 'CPU Guide',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/amd.jpg',
    },
    {
      title: 'Mainboard thế nào là đủ? Chọn bo mạch chủ đúng nhu cầu và ngân sách',
      description: 'Bo mạch chủ ảnh hưởng lớn đến khả năng nâng cấp và hiệu suất – bài viết giúp bạn chọn đúng chipset, khe cắm và tính năng cần thiết.',
      date: 'April 22, 2025',
      category: 'Motherboard',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/asus.jpg',

    },
    {
      title: 'Hướng dẫn chọn RAM: Dung lượng, bus, và timing có thật sự quan trọng?',
      description: 'Giải thích chi tiết các thông số RAM và mẹo chọn đúng loại tương thích tối ưu với hệ thống của bạn.',
      date: 'March 30, 2025',
      category: 'Memory',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/t-force.jpg',

    },
    {
      title: 'Lựa chọn card đồ họa: Ưu tiên hiệu năng hay VRAM?',
      description: 'Cách xác định GPU phù hợp cho mục đích gaming, dựng video hay AI – và những điều cần tránh khi mua card cũ.',
      date: 'March 10, 2025',
      category: 'GPU Guide',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/msi.jpg',

    },
    {
      title: 'Chọn case và tản nhiệt: Đừng để máy đẹp mà nóng!',
      description: 'Cách chọn thùng máy và giải pháp làm mát (air vs AIO) phù hợp với không gian và linh kiện bên trong.',
      date: 'February 25, 2025',
      category: 'Cooling & Case',
      commentLink: '#',
      readMoreLink: '#',
      image: '/photos/case.jpg',

    }
  ]
  return (
    <div className="news-guides">
      <div className="news-header">
        <h2 className="news-title">Tin Tức & Hướng Dẫn</h2>
        <p className="news-subtitle">Cập nhật những bài viết mới nhất và hướng dẫn hữu ích</p>
      </div>
      <div className="blog-grid">
        {blogData.map((post, index) => (
          <div className="blog-post" key={index}>
            <img src={post.image} alt={post.title} className="blog-image" />
            <div className="blog-content">
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-description">{post.description}</p>
              <div className="blog-meta">
                <span className="blog-date">{post.date}</span> | <span className="blog-category">{post.category}</span> |{' '}
                <a href={post.commentLink} className="blog-comment">Post a Comment</a>
              </div>
              <a href={post.readMoreLink} className="read-more">Read More </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;