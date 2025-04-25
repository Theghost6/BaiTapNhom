const products = {
  cpu: [
    {
      id: "cpu001",
      ten: "Intel Core i9-13900K",
      hang: "Intel",
      gia: 14000000,
      thong_so: {
        cores: 24,
        threads: 32,
        baseClock: "3.0 GHz",
        boostClock: "5.8 GHz",
        socket: "LGA 1700"
      },
      so_luong: 50,
      images: [" ảnh 1", " ảnh 2"]
    },
    {
      id: "cpu001",
      ten: "Intel Core i9-13900K",
      hang: "Intel",
      gia: 14000000,
      thong_so: {
        cores: 24,
        threads: 32,
        baseClock: "3.0 GHz",
        boostClock: "5.8 GHz",
        socket: "LGA 1700"
      },
      so_luong: 50,
      images: ["", ""]
    }
  ],
  mainboard: [
    {
      id: "mb001",
      ten: "ASUS ROG Strix Z790-E Gaming",
      hang: "ASUS",
      gia: 10000000,
      thong_so: {
        chipset: "Z790",
        socket: "LGA 1700",
        formFactor: "ATX",
        memorySlots: 4,
        maxMemory: "128GB"
      },
      so_luong: 20,
      images: ["images/mainboard/asus-z790-e-1.jpg"]
    }
  ],
  ram: [
    {
      id: "ram001",
      ten: "G.Skill Trident Z5 RGB 32GB",
      hang: "G.Skill",
      gia: 3500000, 
      thong_so: {
        capacity: "32GB (2x16GB)",
        speed: "DDR5-6000",
        latency: "CL36",
        voltage: "1.35V"
      },
      so_luong: 25,
      images: ["images/ram/gskill-trident-z5-1.jpg"]
    }
  ],
  // Ổ đĩa
  storage: [
    {
      id: "ssd001",
      ten: "Samsung 990 Pro 1TB",
      hang: "Samsung",
      gia: 2000000,
      thong_so: {
        type: "NVMe SSD",
        capacity: "1TB",
        readSpeed: "7450 MB/s",
        writeSpeed: "6900 MB/s",
        interface: "PCIe 4.0"
      },
      so_luong: 69,
      images: ["images/storage/samsung-990-pro-1.jpg"]
    }
  ],
  // Card màn hình rời
  gpu: [
    {
      id: "gpu001",
      ten: "NVIDIA GeForce RTX 4090",
      hang: "NVIDIA",
      gia: 40000000, 
      thong_so: {
        vram: "24GB GDDR6X",
        cudaCores: 16384,
        boostClock: "2.52 GHz",
        power: "450W"
      },
      so_luong: 10,
      images: ["images/gpu/rtx-4090-1.jpg"]
    }
  ],
  //Nguồn máy tính
  psu: [
    {
      id: "psu001",
      ten: "Corsair RM850x",
      hang: "Corsair",
      gia: 3750000, 
      thong_so: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modular: "Fully Modular",
        connectors: "ATX 24-pin, EPS 8-pin"
      },
      so_luong: 40,
      images: ["images/psu/corsair-rm850x-1.jpg"]
    }
  ],
  //Quạt tản nhiệt
  cooling: [
    {
      id: "cool001",
      ten: "Noctua NH-D15",
      hang: "Noctua",
      gia: 2500000, 
      thong_so: {
        type: "Air Cooler",
        fanSize: "140mm",
        height: "165mm",
        compatibility: "AM4, AM5, LGA 1700"
      },
      so_luong: 35,
      images: ["images/cooling/noctua-nh-d15-1.jpg"]
    }
  ],
  //Vỏ máy tính
  case: [
    {
      id: "case001",
      ten: "Lian Li PC-O11 Dynamic",
      hang: "Lian Li",
      gia: 3500000, 
      thong_so: {
        type: "Mid Tower",
        material: "Steel, Tempered Glass",
        motherboardSupport: "ATX, Micro-ATX, Mini-ITX",
        dimensions: "446 x 272 x 445 mm"
      },
      so_luong: 15,
      images: ["images/case/lian-li-o11-1.jpg"]
    }
  ],
  //Linh kiện khác như chuột,bàn phím
  peripherals: [
    {
      id: "mouse001",
      ten: "Logitech G Pro X Superlight",
      hang: "Logitech",
      gia: 3750000, 
      thong_so: {
        type: "Wireless Mouse",
        sensor: "HERO 25K",
        dpi: "100-25600",
        weight: "63g",
        connectivity: "USB Receiver, Wireless"
      },
      so_luong: 80,
      images: ["images/peripherals/logitech-g-pro-x-superlight-1.jpg"]
    },
    {
      id: "kb001",
      ten: "Keychron K8 Pro",
      hang: "Keychron",
      gia: 2500000, 
      thong_so: {
        type: "Mechanical Keyboard",
        switchType: "Gateron Red",
        layout: "Tenkeyless",
        connectivity: "USB-C, Bluetooth",
        backlighting: "RGB"
      },
      so_luong: 45,
      images: ["images/peripherals/keychron-k8-pro-1.jpg"]
    }
  ]
};

export default products;
