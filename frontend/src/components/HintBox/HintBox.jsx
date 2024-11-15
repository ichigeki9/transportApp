import { useContext } from "react";
import styles from "./HintBox.module.css";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export function HintBox(props) {
	
	const themeMode = useContext(ThemeContext)

	const variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	  }

	return (
		<motion.div transition={{ type: "Inertia ", stiffness: 50 }} initial={{x: -330, opacity:0}} animate={{x: props.isExpanded? 0 : -80 , opacity:props.isExpanded ? 1 : 0, display:props.isExpanded ? 1 : 0}} className={themeMode ? `${styles.container} ${styles.container_darkMode}` : `${styles.container}`}>
			<div className={styles.hintBox}>
			<h3>Czasy Transportów</h3>
			</div>
			<motion.div layout initial={{height:38}} whileHover={{height:70}} className={styles.hintBox} variants={variants}>
				<p>Białystok</p> <motion.span variants={variants}> dom / szpital: 4h</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Ełk</p> <motion.span variants={variants}> dom: 45min | Poradnia: 1h 30min</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Giżycko</p> <motion.span variants={variants}> dom / szpital: 2h</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Gołdap</p> <motion.span variants={variants}> dom / szpital: 3h</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Grajewo</p> <motion.span variants={variants}> dom / szpital: 2h</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Olecko</p> <motion.span variants={variants}> dom / szpital: 2h</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Nowa Wieś</p> <motion.span variants={variants}> dom: 45min</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Prostki</p> <motion.span variants={variants}> dom: 1h 20min</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Stare Juchy</p> <motion.span variants={variants}> dom: 1h 30min</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Suwałki</p> <motion.span variants={variants}> dom / szpital: 2h</motion.span>
			</motion.div>
			<motion.div  initial={{height:38}} whileHover={{height:70}} className={styles.hintBox}>
				<p>Węgorzewo</p> <motion.span variants={variants}> dom / szpital: 3h</motion.span>
			</motion.div>
		</motion.div>
	);
}
