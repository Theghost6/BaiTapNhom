import React, { useEffect, useRef, useState } from "react"
import { FaHome, FaInfoCircle, FaBoxOpen, FaServicestack, FaPhone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../style/menu.css"; // <-- Import CSS

export const Variants = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const { height } = useDimensions(containerRef);

    return (
        <div>
            <button className="menu-toggle-button" onClick={() => setIsOpen(!isOpen)}>
                <svg width="23" height="23" viewBox="0 0 23 23">
                    <Path
                        variants={{
                            closed: { d: "M 2 2.5 L 20 2.5" },
                            open: { d: "M 3 16.5 L 17 2.5" },
                        }}
                    />
                    <Path
                        d="M 2 9.423 L 20 9.423"
                        variants={{
                            closed: { opacity: 1 },
                            open: { opacity: 0 },
                        }}
                        transition={{ duration: 0.1 }}
                    />
                    <Path
                        variants={{
                            closed: { d: "M 2 16.346 L 20 16.346" },
                            open: { d: "M 3 2.5 L 17 16.346" },
                        }}
                    />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial={false}
                        animate="open"
                        custom={height}
                        ref={containerRef}
                        className="menu-nav"
                    >
                        <motion.div variants={sidebarVariants} />
                        <Navigation />
                    </motion.nav>
                )}
            </AnimatePresence>
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
}

const Navigation = () => (
    <motion.ul className="menu-list" variants={navVariants}>
        {menuItems.map((item, i) => (
            <MenuItem key={i} color={item.iconColor} label={item.label} icon={item.icon} targetId={item.targetId} />
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
}

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"]

const menuItems = [
    { icon: <FaHome />, iconColor: "#000", label: "Trang chủ", targetId: "hero-slider" },
    { icon: <FaInfoCircle />, iconColor: "#000", label: "Giới thiệu", targetId: "diem-den" },
    { icon: <FaBoxOpen />, iconColor: "#000", label: "Sản phẩm", targetId: "discount" },
    { icon: <FaServicestack />, iconColor: "#000", label: "Dịch vụ", targetId: "dich-vu" },
    { icon: <FaPhone />, iconColor: "#000", label: "Liên hệ", targetId: "dang-ki" }
]

const MenuItem = ({ iconColor, label, icon, targetId }) => {
    return (
        <motion.li
            className="menu-item"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <a href={`#${targetId}`} style={{ display: "flex", textDecoration: "none", color: "inherit" }}>
                <div className="menu-logo" >
                    {icon}
                </div>
                <div className="menu-text" >
                    <span style={{ color: "#000" }}>{label}</span>
                </div>
            </a>
        </motion.li>
    );
}



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
        x: "-100%",
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 40
        }
      }
}

const Path = (props) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        {...props}
    />
);

// const MenuToggle = ({ toggle }) => (
//     <button style={toggleContainer} onClick={toggle}>
//         <svg width="23" height="23" viewBox="0 0 23 23">
//             <Path
//                 variants={{
//                     closed: { d: "M 2 2.5 L 20 2.5" },
//                     open: { d: "M 3 16.5 L 17 2.5" },
//                 }}
//             />
//             <Path
//                 d="M 2 9.423 L 20 9.423"
//                 variants={{
//                     closed: { opacity: 1 },
//                     open: { opacity: 0 },
//                 }}
//                 transition={{ duration: 0.1 }}
//             />
//             <Path
//                 variants={{
//                     closed: { d: "M 2 16.346 L 20 16.346" },
//                     open: { d: "M 3 2.5 L 17 16.346" },
//                 }}
//             />
//         </svg>
//     </button>
// )


/**
 * ==============   Utils   ================
 */
const useDimensions = (ref) => {
    const dimensions = useRef({ width: 0, height: 0 })

    useEffect(() => {
        if (ref.current) {
            dimensions.current.width = ref.current.offsetWidth
            dimensions.current.height = ref.current.offsetHeight
        }
    }, [ref])

    return dimensions.current
}
