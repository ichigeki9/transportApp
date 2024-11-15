import { useForm } from "react-hook-form";
import styles from "./AddTransportForm.module.css";
import { Button } from "../Button/Button";
import { useState, useContext} from "react";
import { motion } from "framer-motion";
import {
	convertTimeToYMD,
	convertTime,
	calculateTransportTime,
} from "../../utils/timeFct";

import { HintBox } from "../HintBox/HintBox";
import { ErrorBlock } from "../ErrorBlock/ErrorBlock";


import { ThemeContext } from "../../context/ThemeContext";
import { checkHoursTransport } from "../../utils/checkHoursTransport";
import { checkHoursTransportAdd } from "../../utils/checkHoursTransportAdd";


export function AddTransportForm(props) {

const themeMode = useContext(ThemeContext)
	const [success, setSuccess] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [error, setError] = useState(false) 
	
	const now = new Date();
	
	function changeDateFormat(f) {
		const dateInput = f;
		if (dateInput) {
			const [year, month, day] = dateInput.split("-");
			const formattedDate = `${day}-${month}-${year}`;
			return formattedDate;
		}
	}
	
	function onSubmit(e) {
		const formValues = {
			transport_date: changeDateFormat(getValues("transport_date")),
			time: getValues("time"),
			starting_place: getValues("starting_place"),
			destination: getValues("destination"),
			transport_time: getValues("transport_time"),
			additional_information: getValues("additional_information"),
		};
		
		
				
		fetch("http://192.168.25.7:5000/transports", {
			method: "POST",
			body: JSON.stringify(formValues),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json()
			).then((res) => {
				if (res.data.transport_date == convertTime(props.currentDate)) {
					props.setTransportDataList((prevData) => [...prevData, res.data]);
				}
				setSuccess(true);
				setTimeout(() => {
					props.OnClick(false);
				}, 2000);
			})
			.catch((err) => {
				console.error(err);
				
				setError(true);
				setTimeout(() => {
					setError(false)
				},4000) // Ustawienie błędu na true w przypadku błędu
			});
		}

	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm();

	function hintBoxExpanded(e) {
		e.preventDefault();
		setIsExpanded((prev) => !prev);
	}

	return (
		<>
		 {error && <ErrorBlock message={"Błąd podczas dodawania transportu!"} />}
			<motion.form
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 30 }}
				onSubmit={handleSubmit(onSubmit)}
				className={themeMode ? `${styles.modalAddTransportContainer} ${styles.modalAddTransportContainer_darkMode}` : `${styles.modalAddTransportContainer}`}
				noValidate>
				<div className={styles.titleModal}>
					<h2>Dodaj</h2>
				</div>
				<div className={themeMode ? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}` : `${styles.inputModalAddTransportBox}`}>
					<label htmlFor="transport_date">Data:</label>
					<input
						value={convertTimeToYMD(props.currentDate)}
						type="date"
						placeholder="dd-mm-yyyy"
						id="transport_date"
						{...register("transport_date", {
							required: { value: true, message: "Podaj date transportu." },
							min: {
								value: convertTimeToYMD(now),
								message: "Nie można zaplanować transportu w przeszłości.",
							},
						})}

						// min={props.currentData()}
						// value={dataOfTransport.date}
					/>

					{errors.transport_date && (
						<span className={styles.error}>
							{errors.transport_date.message}
						</span>
					)}
				</div>

				<div className={themeMode ? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}` : `${styles.inputModalAddTransportBox}`}>
					<label htmlFor="time">Godzina: </label>
					<input
						type="time"
						id="time"
						placeholder="HH:MM"
						required
						{...register("time", {
							required: { value: true, message: "Podaj godzine transportu." },
							validate:  (value, formValues) => {
								const isValid =  checkHoursTransportAdd(
									convertTime(formValues.transport_date),
									value,
									formValues.transport_time,
									props.transportDataList
								);
								
								return (
									isValid ||
									"Godzina transportu koliduje z istniejącym transportem."
								);
							},
						})}
					/>
					{errors.time && (
						<span className={styles.error}>{errors.time.message}</span>
					)}
				</div>
				<div className={themeMode ? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}` : `${styles.inputModalAddTransportBox}`}>
					<label htmlFor="starting_place">Transport z:</label>

					<input
						type="text"
						id="starting_place"
						required
						{...register("starting_place", {
							required: {
								value: true,
								message: "Podaj miejsce początkowe transportu.",
							},
						})}
					/>
					{errors.starting_place && (
						<span className={styles.error}>
							{errors.starting_place.message}
						</span>
					)}
				</div>
				<div className={themeMode ? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}` : `${styles.inputModalAddTransportBox}`}>
					<label htmlFor="destination">Transport do:</label>

					<input
						type="text"
						id="destination"
						required
						{...register("destination", {
							required: {
								value: true,
								message: "Podaj miejsce docelowe transportu",
							},
						})}
					/>
					{errors.destination && (
						<span className={styles.error}>{errors.destination.message}</span>
					)}
				</div>

				<div className={themeMode ? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}` : `${styles.inputModalAddTransportBox}`}>
					<label htmlFor="transport_time">Czas Transportu:</label>
					<input
						type="time"
						id="transport_time"
						placeholder="HH:MM"
						required
						{...register("transport_time", {
							required: {
								value: true,
								message: "Podaj ile transport będzie trwał godz:min",
							},validate:(value) => {
								let isValid = true
							
								
								if(value === '00:00'){
									isValid = false
								}
								return isValid || "Podaj czas transportu"
							}
						})}
					/>
					{errors.transport_time && (
						<span className={styles.error}>
							{errors.transport_time.message}
						</span>
					)}
				</div>
				<div className={themeMode ? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}` : `${styles.inputModalAddTransportBox}`}>
					<label htmlFor="additional_information">Informacje dodatkowe:</label>
					<input
						type="text"
						id="additional_information"
						{...register("additional_information")}
					/>
				</div>
				{!success && (
					<div className={themeMode ? `${styles.modalAddTransportButtonBox} ${styles.modalAddTransportButtonBox_darkMode}` : `${styles.modalAddTransportButtonBox}`}>
						<Button name={"Dodaj"}></Button>
						<Button
							name={"Zamknij"}
							onClick={(e) => {
								props.OnClick(false), e.preventDefault();
							}}></Button>
					</div>
				)}
				{success && (
					<div className={styles.modalAddTransportButtonBox}>
						{" "}
						<Button name={"Transport dodany ! "}></Button>
					</div>
				)}
				<div className={themeMode ? `${styles.hintBoxButton} ${styles.hintBoxButton_darkMode}` : `${styles.hintBoxButton}`}>
					<motion.button
						transition={{ type: "Tween", stiffness: 100 }}
						animate={{ rotate: isExpanded ? 180 : 0 }}
						onClick={(e) => hintBoxExpanded(e)}>
						<i className="fa-solid fa-chevron-right"></i>
					</motion.button>
				</div>
				<HintBox isExpanded={isExpanded} />
			</motion.form>
		</>
	);
}
