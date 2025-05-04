import React, { useEffect, useRef, useState } from "react"
import { FaHome, FaInfoCircle, FaBoxOpen, FaServicestack, FaPhone } from "react-icons/fa";
import * as motion from "motion/react-client"

export const Variants = () => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)
    const { height } = useDimensions(containerRef)

    return (
        <div>
            <div style={container}>
                <motion.nav
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    custom={height}
                    ref={containerRef}
                    style={nav}
                >
                    <motion.div style={background} variants={sidebarVariants} />
                    <Navigation />
                    <MenuToggle toggle={() => setIsOpen(!isOpen)} />
                </motion.nav>
            </div>
        </div>
    )
}

const navVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
}

const Navigation = () => (
    <motion.ul style={list} variants={navVariants}>
        {menuItems.map((item, i) => (
            <MenuItem key={i} color={item.iconColor} label={item.label} icon={item.icon} />
        ))}
    </motion.ul>
)

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

const MenuItem = ({ color, label, icon, targetId }) => {
    const border = `2px solid ${color}`;
    return (
        <motion.li
            style={listItem}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <a href={`#${targetId}`} style={{ display: "flex", textDecoration: "none", color: "inherit" }}>
                <div style={{ ...iconPlaceholder, border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                </div>
                <div style={{ ...textPlaceholder, border }}>
                    <span style={{ color: "#000" }}>{label}</span>
                </div>
            </a>
        </motion.li>
    );
}


const sidebarVariants = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
        },
    }),
    closed: {
        clipPath: "circle(30px at 40px 40px)",
        transition: {
            delay: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 40,
        },
    },
}

const Path = (props) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        {...props}
    />
)

const MenuToggle = ({ toggle }) => (
    <button style={toggleContainer} onClick={toggle}>
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
)

/**
 * ==============   Styles   ================
 */

const container = {
    position: "fixed",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flex: 1,
    width: 210,
    maxWidth: "100%",
    height: 420,
    backgroundColor: "var(--accent)",
    borderRadius: 0,
    overflow: "hidden",
    zIndex: 1000,
}

const nav = {
    width: 300,
}

const background = {
    backgroundColor: "#f5f5f5",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
}

const toggleContainer = {
    outline: "none",
    border: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    cursor: "pointer",
    position: "absolute",
    top: 19,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: "0%",
    background: "transparent",
}

const list = {
    listStyle: "none",
    padding: 15,
    margin: 0,
    position: "absolute",
    top: 60,
    width: 170,
}

const listItem = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    margin: 0,
    listStyle: "none",
    marginBottom: 20,
    cursor: "pointer",
}

const iconPlaceholder = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    flex: "40px 0",
    marginRight: 20,
}

const textPlaceholder = {
    borderRadius: 5,
    width: 80,
    height: 25,
    flex: 1,
    padding: 10,
}

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
