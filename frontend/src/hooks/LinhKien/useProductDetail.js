import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../cart/useCart";
import { AuthContext } from "../../page/function/AuthContext";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_HOST;

export function useProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart, cartItems } = useCart();
    const { isAuthenticated, user } = useContext(AuthContext) || {};

    // State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedTab, setSelectedTab] = useState("Tổng quan");
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ so_sao: 5, binh_luan: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyForms, setReplyForms] = useState({});
    const [isSubmittingReply, setIsSubmittingReply] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [canReply, setCanReply] = useState(false);
    const [purchaseDebug, setPurchaseDebug] = useState(null);
    const tabs = ["Tổng quan", "Thông số kỹ thuật", "Đánh giá"];

    // Fetch product, wishlist, reviews, related products
    useEffect(() => {
        let ignore = false;
        async function fetchProductData() {
            setLoading(true);
            setWishlistLoading(true);
            try {
                const res = await fetch(`${apiUrl}/products.php?id=${id}`);
                const data = await res.json();
                if (!ignore && data.success && data.data) {
                    setProduct(data.data);
                } else if (!ignore) {
                    setProduct(null);
                    toast.error("Không tìm thấy sản phẩm");
                }
                // Fetch reviews
                if (!ignore && data.success && data.data) {
                    const foundProduct = data.data;
                    const ma_sp = foundProduct.ma_sp || foundProduct.id_product || foundProduct.id || id;
                    try {
                        const reviewRes = await fetch(`${apiUrl}/reviews.php?ma_sp=${ma_sp}`);
                        const reviewData = await reviewRes.json();
                        setReviews(reviewData.success && Array.isArray(reviewData.data) ? reviewData.data : []);
                    } catch {
                        setReviews([]);
                    }
                    // Fetch wishlist
                    if (isAuthenticated && user?.id && ma_sp) {
                        try {
                            const wishRes = await fetch(`${apiUrl}/wishlist.php?ma_nguoi_dung=${user.id}&ma_sp=${ma_sp}`);
                            const wishData = await wishRes.json();
                            setIsInWishlist(wishData.success ? wishData.isInWishlist : false);
                        } catch {
                            setIsInWishlist(false);
                        }
                    } else {
                        setIsInWishlist(false);
                    }
                    // Fetch related products
                    try {
                        const relatedRes = await fetch(`${apiUrl}/products.php?danh_muc=${encodeURIComponent(foundProduct.danh_muc)}`);
                        const relatedData = await relatedRes.json();
                        setRelatedProducts(relatedData.success && Array.isArray(relatedData.data)
                            ? relatedData.data.filter((item) => item.id !== foundProduct.id).slice(0, 4)
                            : []);
                    } catch {
                        setRelatedProducts([]);
                    }
                }
            } catch (e) {
                if (!ignore) toast.error("Không thể tải thông tin sản phẩm");
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setWishlistLoading(false);
                }
            }
        }
        fetchProductData();
        return () => { ignore = true; };
    }, [id, isAuthenticated, user?.id, location.pathname]);

    // Update stock in cart
    useEffect(() => {
        if (product && cartItems) {
            const existingItem = cartItems.find(
                (item) => item.id_product === product.id || item.id === product.id_product
            );
            setIsInCart(!!existingItem);
        }
    }, [product, cartItems]);

    // Check if user can review
    useEffect(() => {
        if (isAuthenticated && user?.id && product) {
            const ma_sp = product.ma_sp || product.id_product || product.id;
            if (!ma_sp) {
                setCanReview(false);
                setPurchaseDebug({ error: "Thiếu mã sản phẩm (ma_sp)" });
                return;
            }

            // Admin chỉ có thể reply, không thể viết bình luận mới
            if (user.role === 'admin') {
                setCanReview(false); // Admin không được viết bình luận
                setCanReply(true);   // Admin có thể reply
                setPurchaseDebug({ success: true, da_mua: 0, note: "Admin chỉ có quyền phản hồi, không được viết bình luận" });
                return;
            }

            const url = `${apiUrl}/lich_su_dh.php?ma_nguoi_dung=${user.id}&ma_sp=${ma_sp}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setPurchaseDebug(data);
                    const hasPurchased = data.success && data.da_mua === 1;
                    setCanReview(hasPurchased);
                    setCanReply(hasPurchased); // Người dùng thường cần mua mới có thể reply
                })
                .catch((err) => {
                    setCanReview(false);
                    setCanReply(false);
                    setPurchaseDebug({ error: err.message });
                });
        } else {
            setCanReview(false);
            setCanReply(false);
            setPurchaseDebug({ error: "Thiếu mã sản phẩm (ma_sp) hoặc chưa đăng nhập" });
        }
    }, [product, isAuthenticated, user?.id, location.pathname]);

    // Handler: Wishlist toggle
    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
            navigate("/register", { state: { returnUrl: `/linh-kien/${id}` } });
            return;
        }
        try {
            setWishlistLoading(true);
            const ma_sp = product.ma_sp;
            if (!ma_sp) {
                toast.error("Sản phẩm này không có mã sản phẩm hợp lệ (ma_sp). Không thể thêm vào danh sách yêu thích!");
                setWishlistLoading(false);
                return;
            }
            if (user?.role === 'admin') {
                toast.error("Tài khoản admin không được phép thêm yêu thích!");
                return;
            }
            const response = await fetch(`${apiUrl}/wishlist.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ma_nguoi_dung: user.id,
                    ma_sp: ma_sp,
                    action: isInWishlist ? "remove" : "add",
                }),
            });
            const data = await response.json();
            if (data.success) {
                setIsInWishlist(!isInWishlist);
                toast.success(isInWishlist ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!");
            } else {
                toast.error(data.message || "Không thể cập nhật danh sách yêu thích!");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật danh sách yêu thích!");
        } finally {
            setWishlistLoading(false);
        }
    };

    // Handler: Quantity change
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 0 && value <= (product?.so_luong || 0)) {
            setQuantity(value);
        } else if (value > (product?.so_luong || 0)) {
            toast.warning(`Chỉ còn ${product?.so_luong} sản phẩm trong kho!`);
            setQuantity(product?.so_luong || 0);
        }
    };
    const increaseQuantity = () => {
        if (quantity < (product?.so_luong || 0)) {
            setQuantity(quantity + 1);
        } else {
            toast.warning(`Chỉ còn ${product?.so_luong} sản phẩm trong kho!`);
        }
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Handler: Add to cart
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            navigate("/register", { state: { returnUrl: `/linh-kien/${id}` } });
            return;
        }
        if (user?.role === 'admin') {
            toast.error("Tài khoản admin không được phép thêm vào giỏ hàng!");
            return;
        }
        if (!product) return;
        addToCart({ ...product, quantity });
        setIsInCart(true);

    };

    // Handler: Buy now
    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để mua ngay!");
            navigate("/register", { state: { returnUrl: `/linh-kien/${id}` } });
            return;
        }
        if (user?.role === 'admin') {
            toast.error("Tài khoản admin không được phép mua hàng!");
            return;
        }
        if (!product) return;

        // Tạo product object với quantity được người dùng chọn, không bị ghi đè bởi so_luong
        const productForCheckout = {
            ...product,
            quantity: quantity  // Đảm bảo quantity do người dùng chọn được ưu tiên
        };

        navigate("/checkout", {
            state: {
                product: productForCheckout,
                quantity: quantity
            }
        });
    };

    // Handler: Review change
    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: name === "so_sao" ? parseInt(value) : value });
    };

    // Handler: Submit review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để đánh giá!");
            navigate("/register", { state: { returnUrl: `/linh-kien/${id}` } });
            return;
        }

        // Kiểm tra quyền đánh giá: Chỉ người đã mua mới được viết bình luận
        if (!canReview) {
            toast.error("Bạn cần mua sản phẩm này trước khi có thể đánh giá!");
            return;
        }

        if (!newReview.binh_luan.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá");
            return;
        }
        setIsSubmitting(true);
        const ma_sp = product.ma_sp || product.id_product || product.id;
        const reviewData = {
            ma_sp: ma_sp,
            ma_nguoi_dung: user?.id,
            so_sao: newReview.so_sao,
            binh_luan: newReview.binh_luan
        };
        try {
            const response = await fetch(`${apiUrl}/reviews.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData),
            });
            const result = await response.json();
            if (result.success) {
                setReviews([
                    ...reviews,
                    {
                        id: result.id,
                        ...reviewData,
                        ten_nguoi_dung: user.ten || "Ẩn danh",
                        replies: [],
                        created_at: new Date().toISOString(),
                    },
                ]);
                setNewReview({ so_sao: 5, binh_luan: "" });
                toast.success("Cảm ơn bạn đã đánh giá!");
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi đánh giá: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler: Toggle reply form
    const toggleReplyForm = (reviewId) => {
        setReplyForms((prev) => ({
            ...prev,
            [reviewId]: {
                noi_dung: prev[reviewId]?.noi_dung || "",
                isOpen: !prev[reviewId]?.isOpen,
            },
        }));
    };
    // Handler: Reply change
    const handleReplyChange = (reviewId, value) => {
        setReplyForms((prev) => ({
            ...prev,
            [reviewId]: {
                ...prev[reviewId],
                noi_dung: value,
            },
        }));
    };
    // Handler: Submit reply
    const handleSubmitReply = async (e, reviewId) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để gửi phản hồi!");
            navigate("/register", { state: { returnUrl: `/linh-kien/${id}` } });
            return;
        }

        // Kiểm tra quyền phản hồi: Admin hoặc người đã mua
        if (!canReply) {
            toast.error("Bạn cần mua sản phẩm này trước khi có thể phản hồi!");
            return;
        }

        if (!replyForms[reviewId]?.noi_dung.trim()) {
            toast.error("Vui lòng nhập nội dung phản hồi");
            return;
        }
        setIsSubmittingReply((prev) => ({ ...prev, [reviewId]: true }));
        const replyData = {
            id_danh_gia: reviewId,
            ma_nguoi_tra_loi: user?.id,
            noi_dung: replyForms[reviewId].noi_dung,
            ngay: new Date().toISOString().split("T")[0],
        };
        try {
            const response = await fetch(`${apiUrl}/reply_review.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(replyData),
            });
            const result = await response.json();
            if (result.success) {
                const updatedReviews = reviews.map((review) => {
                    if (review.id === reviewId) {
                        return {
                            ...review,
                            replies: [
                                ...(review.replies || []),
                                {
                                    id: result.id,
                                    ...replyData,
                                    ten_nguoi_tra_loi: user.ten || "Ẩn danh",
                                },
                            ],
                        };
                    }
                    return review;
                });
                setReviews(updatedReviews);
                setReplyForms((prev) => ({
                    ...prev,
                    [reviewId]: { noi_dung: "", isOpen: false },
                }));
                toast.success("Phản hồi đã được gửi!");
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi phản hồi: " + error.message);
        } finally {
            setIsSubmittingReply((prev) => ({ ...prev, [reviewId]: false }));
        }
    };

    return {
        id, product, loading, isInCart, quantity, setQuantity, selectedTab, setSelectedTab,
        reviews, setReviews, newReview, setNewReview, isSubmitting, setIsSubmitting,
        replyForms, setReplyForms, isSubmittingReply, setIsSubmittingReply,
        relatedProducts, setRelatedProducts, isInWishlist, setIsInWishlist,
        wishlistLoading, setWishlistLoading, showFullDescription, setShowFullDescription,
        canReview, setCanReview, canReply, setCanReply, purchaseDebug, setPurchaseDebug,
        addToCart, cartItems, isAuthenticated, user, navigate, location,
        handleToggleWishlist, handleAddToCart, handleBuyNow, handleQuantityChange,
        increaseQuantity, decreaseQuantity, handleReviewChange, handleSubmitReview,
        toggleReplyForm, handleReplyChange, handleSubmitReply, tabs
    };
}
