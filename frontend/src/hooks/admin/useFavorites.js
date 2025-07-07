import { useEffect, useState } from "react";
import axios from "axios";

export default function useFavorites(apiUrl, trigger) {
    const [favorites, setFavorites] = useState([]);
    const [mostFavorited, setMostFavorited] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiUrl}/wishlist.php?ma_nguoi_dung=0`)
            .then((res) => {
                if (res.data.success && Array.isArray(res.data.items)) {
                    setFavorites(res.data.items);
                    // Tìm sản phẩm được yêu thích nhiều nhất
                    const productCounts = res.data.items.reduce((acc, item) => {
                        acc[item.id_product] = (acc[item.id_product] || 0) + 1;
                        return acc;
                    }, {});
                    const mostFavoritedId = Object.keys(productCounts).reduce((a, b) =>
                        productCounts[a] > productCounts[b] ? a : b, null
                    );
                    const mostFavoritedItem = res.data.items.find(
                        (item) => item.id_product === mostFavoritedId
                    );
                    setMostFavorited(mostFavoritedItem || null);
                } else {
                    setFavorites([]);
                    setMostFavorited(null);
                }
            })
            .catch(() => {
                setFavorites([]);
                setMostFavorited(null);
            })
            .finally(() => setLoading(false));
    }, [apiUrl, trigger]);

    return { favorites, mostFavorited, loading };
}
