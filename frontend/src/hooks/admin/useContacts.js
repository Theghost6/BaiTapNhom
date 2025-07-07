import { useEffect, useState } from "react";
import axios from "axios";

export default function useContacts(apiUrl, trigger) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiUrl}/api.php?action=get_contacts`)
            .then((res) => {
                if (Array.isArray(res.data)) setContacts(res.data);
                else setContacts([]);
            })
            .catch(() => setContacts([]))
            .finally(() => setLoading(false));
    }, [apiUrl, trigger]);

    const deleteContact = (id, cb) => {
        axios
            .get(`${apiUrl}/api.php?action=delete_contact&id=${id}`)
            .then(() => {
                setContacts((prev) => prev.filter((c) => c.id !== id));
                if (cb) cb();
            });
    };

    return { contacts, loading, deleteContact };
}
