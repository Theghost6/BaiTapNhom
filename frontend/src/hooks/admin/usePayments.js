import { useEffect, useState } from "react";
import axios from "axios";

export default function usePayments(apiUrl, trigger) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiUrl}/api.php?action=get_payments`)
            .then((res) => {
                if (Array.isArray(res.data)) setPayments(res.data);
                else setPayments([]);
            })
            .catch(() => setPayments([]))
            .finally(() => setLoading(false));
    }, [apiUrl, trigger]);

    return { payments, loading };
}
