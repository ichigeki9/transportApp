import { useContext, useState } from "react";
import styles from "./TransportManageContainer.module.css";
import { Button } from "../Button/Button";
import { calculateTransportTime, convertTime } from "../../utils/timeFct";
import { ErrorBlock } from "../ErrorBlock/ErrorBlock";
import Logo from "../../assets/logoT.png";
import LogoNight from "../../assets/logoTNight.png";
import { ThemeContext } from "../../context/ThemeContext";

export function TransportManageContainer(props) {
	const [error, setError] = useState(false);
	const themeMode = useContext(ThemeContext);

	const now = new Date();

	function deteleTransport(id) {
		fetch(`http://192.168.25.7:5000/transports/${id}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) {
					props.setTransportDataList((prevVal) =>
						prevVal.filter((item) => item.id !== id)
					);
				} else {
					throw new Error("Błąd przy usuwaniu ");
				}
			})
			.catch((e) => {
				setError(true);
				setTimeout(() => {
					setError(false);
				}, 2000);
			});
	}

	const TransportList = props.transportDataList
		.sort((a, b) => a.time > b.time)
		.map((transport, index) => (
			<li
				key={transport.id}
				className={
					themeMode
						? transport.active
							? ` ${styles.transportListBox}  ${styles.active_darkMode} ${styles.transportListBox_darkMode}`
							: `${styles.transportListBox} ${styles.transportListBox_darkMode}`
						: transport.active
						? `${styles.transportListBox} ${styles.active}`
						: `${styles.transportListBox}`
				}
				onClick={(e) => {
					props.setTransportDataList((prevVal) => {
						const mapArray = prevVal.map((item) => {
							if (item.id === transport.id) {
								return { ...item, active: true };
							} else {
								return { ...item, active: false };
							}
						});

						return mapArray;
					});
					// calculateTransportTime(transport.transport_date,transport.time,transport.transport_time)
				}}>
				<div className={styles.lpBox}>
					<p>{index + 1}</p>
				</div>
				<div className={styles.dataBox}>
					<p>{transport.transport_date}</p>
				</div>
				<div className={styles.timeBox}>
					<p>{transport.time.slice(0, 5)}</p>
				</div>
				<div className={styles.timeBox}>
					<p>{transport.transport_time.slice(0, 5)}</p>
				</div>
				<div className={styles.timeBox}>
					<p>
						{calculateTransportTime(
							transport.transport_date,
							transport.time,
							transport.transport_time
						)}
					</p>
				</div>
				<div>
					<p>{transport.starting_place}</p>
				</div>
				<div>
					<p>{transport.destination}</p>
				</div>
				<div className={styles.additional_information}>
					<p>{transport.additional_information}</p>
				</div>
			</li>
		));

	const activeObj = props.transportDataList.filter((obj) => obj.active == true);
	// console.log(activeObj.length === 0);

	return (
		<>
			{error && <ErrorBlock message={"Błąd podczas usuwania transportu !"} />}
			<div className={styles.TransportList}>
				<div
					className={
						themeMode
							? `${styles.topBox} ${styles.topBox_darkMode}`
							: `${styles.topBox}`
					}>
						<div className={styles.titleToPrint}>
							<p>Transporty</p>
							<span>{convertTime(now)}</span>
						</div>
					<div className={styles.logoBox}>
						<img src={ themeMode ? LogoNight : Logo} alt="Logo" />
					</div>

					<div className={styles.buttonsBox}>
						<Button
							name={"Dodaj"}
							onClick={() => props.setAddModalVisible(true)}></Button>
						<Button
							name={"Edytuj"}
							onClick={() => props.setEditModalVisible(true)}
							disabled={activeObj.length === 0}></Button>
						<Button
							name={"Usuń"}
							disabled={activeObj.length === 0}
							onClick={() => deteleTransport(activeObj[0].id)}></Button>
						<Button
							name={"Drukuj"}
							disabled={props.transportDataList.length === 0}
							onClick={() => window.print()}></Button>
					</div>

					<div className={styles.switchBox}>
						<button onClick={() => props.setDarkMode(!themeMode)}>
						{themeMode ? <i className="fa-regular fa-moon" style={{color: "#fff"}} ></i> : <i className="fa-regular fa-sun"></i>		}		
						</button>
					</div>

					<div
						className={
							themeMode
								? `${styles.userInfoBox} ${styles.userInfoBox_darkMode}`
								: `${styles.userInfoBox}`
						}>
						<i className="fa-solid fa-user"></i>
						<span>User</span>
					</div>
				</div>
				<ul
					className={
						themeMode
							? `${styles.transportListContainer} ${styles.transportListContainer_darkMode}`
							: `${styles.transportListContainer}`
					}>
					<li
						className={
							themeMode
								? `${styles.transportListBox} ${styles.transportListBox_darkMode}`
								: `${styles.transportListBox}`
						}>
						<div className={styles.lpBox}>
							<p>
								<strong>lp.</strong>
							</p>
						</div>

						<div className={styles.dataBox}>
							<p>
								<strong>Data</strong>
							</p>
						</div>
						<div className={styles.timeBox}>
							<p>
								<strong>Godzina</strong>
							</p>
						</div>
						<div className={styles.timeBox}>
							<p>
								<strong>Czas transportu</strong>
							</p>
						</div>
						<div className={styles.timeBox}>
							<p>
								<strong>Godzina zak. transportu</strong>
							</p>
						</div>
						<div>
							<p>
								<strong>Miejsce pocz.</strong>
							</p>
						</div>
						<div>
							<p>
								<strong>Miejsce doc.</strong>
							</p>
						</div>
						<div className={styles.additional_information}>
							<p>
								<strong>Info. dod.</strong>
							</p>
						</div>
					</li>
					{props.isLoading && (
						<div className={
						themeMode
							? `${styles.messageBox} ${styles.messageBox_darkMode}`
							: `${styles.messageBox}`
					}>
							<p>Ładowanie listy transportów...</p>
						</div>
					)}

					{props.transportDataList.length === 0 && (
						<div className={
						themeMode
							? `${styles.messageBox} ${styles.messageBox_darkMode}`
							: `${styles.messageBox}`
					}>
							<p>Brak zapisanych transportów na dany dzień.</p>
						</div>
					)}

					{!props.isLoading && TransportList}
				</ul>
			</div>
		</>
	);
}
