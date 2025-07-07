import React, { useEffect, useRef, useState } from "react";
import { FaHome, FaInfoCircle, FaBoxOpen, FaServicestack, FaPhone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export const Variants = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const { height } = useDimensions(containerRef);

    // Hàm để xử lý việc điều hướng và đóng menu sau khi click
    const handleNavigate = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => setIsOpen(false), 500);
        }
    };

    return (
        <div>
            <div style={{ position: "relative" }}>
                {/* Nút toggle: luôn hiển thị ở góc phải dưới header */}
                <div 
                    className="menu-toggle-button"
                    style={{ 
                        position: "fixed", 
                        top: 80, 
                        left: 20, 
                        zIndex: 9999,
                        width: 60, 
                        height: 60, 
                        backgroundColor: "white", 
                        borderRadius: "50%", 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)" 
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f3f3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                >
                    <MenuToggle toggle={() => setIsOpen(!isOpen)} />
                </div>

                {/* Menu chỉ hiện khi mở */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.nav
                            initial="closed"
                            animate="open"
                            exit="closed"
                            custom={height}
                            ref={containerRef}
                            style={{
                                position: "fixed",
                                top: 70,
                                left: 0,
                                width: "100px",
                                height: "350px",
                                backgroundColor: "white",
                                zIndex: 9999,
                                boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
                                borderRadius: "10px",
                            }}
                        >
                            <motion.div style={background} variants={sidebarVariants} />
                            <Navigation handleNavigate={handleNavigate} />
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const navVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

const Navigation = ({ handleNavigate }) => (
    <motion.ul style={list} variants={navVariants}>
        {menuItems.map((item, i) => (
            <MenuItem 
                key={i} 
                color={item.iconColor} 
                label={item.label} 
                icon={item.icon} 
                targetId={item.targetId}
                onClick={() => handleNavigate(item.targetId)}
            />
        ))}
    </motion.ul>
);

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

const menuItems = [
    { icon: <FaHome />, iconColor: "#FF008C", label: "Trang chủ", targetId: "hero-slider" },
    { icon: <FaInfoCircle />, iconColor: "#D309E1", label: "Linh kiện hot", targetId: "linhkien" },
    { icon: <FaBoxOpen />, iconColor: "#9C1AFF", label: "Ưu đãi", targetId: "uudai" },
    { icon: <FaServicestack />, iconColor: "#7700FF", label: "Dịch vụ", targetId: "dich-vu" },
    { icon: <FaPhone />, iconColor: "#4400FF", label: "Liên hệ", targetId: "dang-ki" }
];

const MenuItem = ({ color, label, icon, targetId, onClick }) => {
    const border = `2px solid ${color}`;
    return (
        <motion.li
            className="menu-item"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
        >
            <div style={{ display: "flex", textDecoration: "none", color: "inherit", cursor: "pointer", padding: 10 }} >
                <div style={{ ...iconPlaceholder, border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                </div>
                <div className="menu-text" >
                    <span style={{ color: "#000", fontWeight: "600" }}>{label}</span>
                </div>
            </div>
        </motion.li>
    );
};

const sidebarVariants = {
    open: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    },
    closed: {
        x: "100%",
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 40
        }
    }
};

const Path = (props) => (
    <motion.path
        fill="transparent"
        strokeWidth="5" // Tăng độ dày gạch
        stroke="#000000"
        strokeLinecap="round"
        {...props}
    />
);

const MenuToggle = ({ toggle }) => (
    <button style={toggleContainer} onClick={toggle}>
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: "block" }}>
            <path d="M 8 12 L 32 12" fill="transparent" strokeWidth="5" stroke="#000000" strokeLinecap="round" />
            <path d="M 8 20 L 32 20" fill="transparent" strokeWidth="5" stroke="#000000" strokeLinecap="round" />
            <path d="M 8 28 L 32 28" fill="transparent" strokeWidth="5" stroke="#000000" strokeLinecap="round" />
        </svg>
    </button>
);
/**
 * ==============   Styles   ================
 */

const background = {
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 200,
    borderRadius: "10px",
};

const toggleContainer = {
    outline: "none",
    border: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const list = {
    listStyle: "none",
    padding: 10,
    margin: 0,
    position: "absolute",
    top: 10,
    width: 201,
};

const listItem = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    margin: 0,
    listStyle: "none",
    marginBottom: 20,
    cursor: "pointer",
};

const iconPlaceholder = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    flex: "40px 0",
    marginRight: 20,
};

const textPlaceholder = {
    borderRadius: 5,
    width: 80,
    height: 25,
    flex: 1,
    padding: 10,
};

/**
 * ==============   Utils   ================
 */
const useDimensions = (ref) => {
    const dimensions = useRef({ width: 0, height: 0 });

    useEffect(() => {
        if (ref.current) {
            dimensions.current.width = ref.current.offsetWidth;
            dimensions.current.height = ref.current.offsetHeight;
        }
    }, [ref]);

    return dimensions.current;
};
