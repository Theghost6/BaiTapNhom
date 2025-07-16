import { useState, useEffect } from 'react';

const useHeroSlides = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeroSlides = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_HOST}/products.php`);
                const data = await response.json();

                if (data.success && data.data) {
                    // Get 3 random products for hero slides
                    const shuffled = data.data.sort(() => 0.5 - Math.random());
                    const selectedProducts = shuffled.slice(0, 3);

                    const heroSlides = selectedProducts.map((product, index) => ({
                        id: product.ma_sp || product.id || `slide_${index}`,
                        image: product.images?.[0] || "/photos/default.jpg",
                        title: product.ten_sp || product.ten || 'Featured Product',
                        description: `${product.ten_nha_san_xuat || 'Quality'} - ${product.danh_muc || product.ten_danh_muc || 'Premium Hardware'}`
                    }));

                    setSlides(heroSlides);
                } else {
                    throw new Error('Failed to fetch products for hero slides');
                }
            } catch (err) {
                setError(err.message);

                // Fallback to default slides
                setSlides([
                    {
                        id: "gpu001",
                        image: "/photos/k.jpg",
                        title: "NVIDIA GeForce RTX 4090",
                        description: "Sức mạnh đồ họa vượt trội cho game thủ",
                    },
                    {
                        id: "peripheral009",
                        image: "/photos/n.jpg",
                        title: "Keychron K6",
                        description: "Trải nghiệm gõ phím tuyệt vời với đèn RGB",
                    },
                    {
                        id: "peripheral004",
                        image: "/photos/j.jpg",
                        title: "Logitech MX Master 3S",
                        description: "Chuột chơi game với cảm biến HERO 25K",
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroSlides();
    }, []);

    return { slides, loading, error };
};

export default useHeroSlides;
