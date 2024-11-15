import styles from "./InfoContainer.module.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import style from "./Calendar.module.css";
import { convertTime, calculateTransportTime } from "../../utils/timeFct.js";
import { ThemeContext } from "../../context/ThemeContext.js";
import { useContext } from "react";

export function InfoContainer(props) {
	const themeMode = useContext(ThemeContext);

	const transportData = props.transportDataList
		.filter((obj) => obj.active == true)
		.map((item) => item);

	const now = new Date();
	

	return (
		<div
			className={
				themeMode
					? `${styles.infoContainer} ${styles.infoContainer_darkMode}`
					: `${styles.infoContainer}`
			}>
			<div
				className={
					themeMode
						? `${styles.dataBox} ${styles.dataBox_darkMode}`
						: `${styles.dataBox}`
				}>
				<span>{convertTime(now)}</span>
			</div>

			{transportData.length < 1 ? (
				<div
					className={
						themeMode
							? `${styles.emptyBoxTransportInfo} ${styles.emptyBoxTransportInfo_darkMode}`
							: `${styles.emptyBoxTransportInfo}`
					}>
					<p>DANE TRANSPORTÓW</p>
				</div>
			) : (
				<div
					className={
						themeMode
							? `${styles.transportInfoBox} ${styles.transportInfoBox_darkMode}`
							: `${styles.transportInfoBox}`
					}>
					<div
						className={
							themeMode
								? `${styles.box} ${styles.box_darkMode}`
								: `${styles.box}`
						}>
						<h2>Data Transportu:</h2>
						<p>{transportData[0].transport_date}</p>
					</div>
					<div
						className={
							themeMode
								? `${styles.box} ${styles.box_darkMode}`
								: `${styles.box}`
						}>
						<h2>Godzina Transportu:</h2>
						<p>{transportData[0].time.slice(0, 5)}</p>
					</div>
					<div
						className={
							themeMode
								? `${styles.box} ${styles.box_darkMode}`
								: `${styles.box}`
						}>
						<h2>Czas Transportu:</h2>
						<p>{transportData[0].transport_time.slice(0, 5)}</p>
					</div>
					<div
						className={
							themeMode
								? `${styles.box} ${styles.box_darkMode}`
								: `${styles.box}`
						}>
						<h2>Godzina zakończenia transportu:</h2>
						<p>
							{calculateTransportTime(
								transportData[0].transport_date,
								transportData[0].time,
								transportData[0].transport_time
							).slice(0, 5)}
						</p>
					</div>
					<div
						className={
							themeMode
								? `${styles.box} ${styles.box_darkMode}`
								: `${styles.box}`
						}>
						<h2>Miejsce początkowe Transportu:</h2>
						<p>{transportData[0].starting_place}</p>
					</div>
					<div
						className={
							themeMode
								? `${styles.box} ${styles.box_darkMode}`
								: `${styles.box}`
						}>
						<h2>Miejsce docelowe:</h2>
						<p>{transportData[0].destination}</p>
					</div>
					<div
						className={
							themeMode
								? `${styles.box} ${styles.box_darkMode}`
								: `${styles.box}`
						}>
						<h2>Informacje Dodatkowe:</h2>

						{transportData[0].additional_information ? (
							<p>{transportData[0].additional_information}</p>
						) : (
							<p>Brak</p>
						)}
					</div>
				</div>
			)}

			<div className={styles.calendarBox}>
				<Calendar
					onClickDay={(value) => props.setCurrentDate(value)}
					className={themeMode ? style.darkmode   : ''}
				/>
			</div>
		</div>
	);
}
// `${styles.react-calendar}`