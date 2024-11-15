import styles from "./Button.module.css"
import { motion } from "framer-motion"
import { ThemeContext } from "../../context/ThemeContext"
import { useContext } from "react"


export function Button(props) {
    
    const themeMode = useContext(ThemeContext)

    return (
        <motion.button whileHover={{scale: props.disabled ? 1 : 1.1 }} className={themeMode ? `${styles.button} ${styles.button_darkMode}` :  `${styles.button}`} onClick={props.onClick} disabled={props.disabled}>{props.name}</motion.button>
    )
}