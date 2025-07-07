import { useEffect, useState } from "react";
import axios from "axios";

export default function useReviews(apiUrl, trigger) {
    const [reviews, setReviews] = useState([]);
    const [replies, setReplies] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiUrl}/api.php?action=get_reviews`)
            .then((res) => {
                if (Array.isArray(res.data)) setReviews(res.data);
                else setReviews([]);
            })
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [apiUrl, trigger]);

    const deleteReview = (id, cb) => {
        axios
            .get(`${apiUrl}/api.php?action=delete_review&id=${id}`)
            .then(() => {
                setReviews((prev) => prev.filter((r) => r.id !== id));
                setReplies([]);
                setSelectedReview(null);
                if (cb) cb();
            });
    };

    const viewReply = (id) => {
        axios
            .get(`${apiUrl}/api.php?action=get_review_replies&id=${id}`)
            .then((res) => {
                setSelectedReview(id);
                if (Array.isArray(res.data)) setReplies(res.data);
                else setReplies([]);
            });
    };

    return { reviews, replies, selectedReview, loading, deleteReview, viewReply };
}
