import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

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

const menuItems = [
    { iconColor: "#FF008C", label: "Trang chủ" },
    { iconColor: "#D309E1", label: "Giới thiệu" },
    { iconColor: "#9C1AFF", label: "Sản phẩm" },
    { iconColor: "#7700FF", label: "Dịch vụ" },
    { iconColor: "#4400FF", label: "Liên hệ" }
]

const Navigation = () => (
    <motion.ul style={list} variants={navVariants}>
        {menuItems.map((item, i) => (
            <MenuItem key={i} color={item.iconColor} label={item.label} />
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

const MenuItem = ({ color, label }) => {
    const border = `2px solid ${color}`
    return (
        <motion.li
            style={listItem}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <div style={{ ...iconPlaceholder, border }} />
            <div style={{ ...textPlaceholder, border: "2px solid red" }}>
                {label}
            </div>
        </motion.li>
    )
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
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flex: 1,
    width: 500,
    maxWidth: "100%",
    height: 400,
    backgroundColor: "var(--accent)",
    borderRadius: 20,
    overflow: "hidden",
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
    top: 18,
    left: 15,
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "transparent",
}

const list = {
    listStyle: "none",
    padding: 25,
    margin: 0,
    position: "absolute",
    top: 80,
    width: 230,
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
    width: 200,
    height: "auto",
    flex: 1,
    display: "flex",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#ffffff",  // thêm nền trắng để kiểm tra
    color: "#000000",            // đảm bảo chữ màu đen
    fontSize: 16,
    fontWeight: "500",
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
