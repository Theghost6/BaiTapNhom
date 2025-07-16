import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const useProductData = (productIds, fallbackData) => {
    const [products, setProducts] = useState(fallbackData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get API URL
    const apiUrl = import.meta.env.VITE_HOST || 'http://localhost/BaiTapNhom/backend';

    useEffect(() => {
        if (!productIds || productIds.length === 0) {
            setProducts(fallbackData);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const promises = productIds.map(async (id) => {
                    const url = `${apiUrl}/products.php?id=${id}`;

                    const response = await fetch(url);
                    const result = await response.json();


                    if (result.success && result.data) {
                        return result.data;
                    }
                    return null;
                });

                const apiResults = await Promise.all(promises);

                // Simple merge logic
                const mergedProducts = fallbackData.map((fallbackItem, index) => {
                    const apiProduct = apiResults[index];

                    if (apiProduct) {

                        const merged = {
                            ...fallbackItem,
                            ...apiProduct,
                            images: fallbackItem.images || apiProduct.images || [],
                            // Ensure we have the key fields for display
                            ten_sp: apiProduct.ten_sp,
                            ten_nha_san_xuat: apiProduct.ten_nha_san_xuat,
                            gia_sau: apiProduct.gia_sau
                        };


                        return merged;
                    }

                    return fallbackItem;
                });

                setProducts(mergedProducts);

            } catch (err) {
                setError(err.message);
                setProducts(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [productIds, fallbackData, apiUrl]);

    return { products, loading, error };
};

export default useProductData;
