import { Button } from "../Button/Button";
import styles from "./EditTransformFrom.module.css";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { convertTime, convertTimeToYMD } from "../../utils/timeFct";
import { checkHoursTransport } from "../../utils/checkHoursTransport";
import { ErrorBlock } from "../ErrorBlock/ErrorBlock";
import { ThemeContext } from "../../context/ThemeContext";
import { HintBox } from "../HintBox/HintBox";

export function EditTransformFrom(props) {
	const themeMode = useContext(ThemeContext);
	const [success, setSuccess] = useState(false);
	const [isSameData, setIsSameData] = useState(false);
	const [error, setError] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const activeObj = props.transportDataList.filter((obj) => obj.active == true);
	const now = new Date();

	function returnId(list) {
		const activeObje = list.filter((obj) => obj.active == true);
		// console.log(activeObje[0].id);

		return activeObje[0].id;
	}

	const filteredTransportDatList = props.transportDataList.filter((item) => item.id !== activeObj[0].id)
	console.log(filteredTransportDatList);
	

	function compare(fct1, fct2) {
		if (
			fct1.transport_date == fct2.transport_date &&
			fct1.time == fct2.time &&
			fct1.starting_place == fct2.starting_place &&
			fct1.destination == fct2.destination &&
			fct1.transport_time == fct2.transport_time &&
			fct1.additional_information == fct2.additional_information &&
			fct1.id == fct2.id &&
			fct1.active == fct2.active
		) {
			return true;
		} else {
			return false;
		}
	}

	function changeDateFormat(f) {
		const dateInput = f;

		if (dateInput) {
			const [year, month, day] = dateInput.split("-");
			const formattedDate = `${day}-${month}-${year}`;
			return formattedDate;
		}
	}

	function handleTransportEdit(updatedTransport) {
		const updatedList = props.transportDataList.map((transport) =>
			transport.id === updatedTransport.id ? updatedTransport : transport
		);
		props.setTransportDataList(updatedList);
	}

	function onSubmit(e) {
		const id = returnId(props.transportDataList);
		const formValues = {
			transport_date: convertTime(getValues("transport_date")),
			time: getValues("time"),
			starting_place: getValues("starting_place"),
			destination: getValues("destination"),
			transport_time: getValues("transport_time"),
			additional_information: getValues("additional_information"),
		};

		const transport = props.transportDataList.filter((item) => {
			const activeItem = item.id == id;
			return activeItem;
		});
		if (compare(transport[0], { ...formValues, active: true, id: id })) {
			setIsSameData(true);
		} else {
			setIsSameData(false);

			fetch(`http://192.168.25.7:5000/transports/${id}`, {
				method: "PUT",
				body: JSON.stringify(formValues),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((updatedTransport) => {
					if (
						updatedTransport.data.transport_date ==
						convertTime(props.currentDate)
					) {
						handleTransportEdit({ ...updatedTransport.data, active: true });
					} else {
						props.OnClick(false);
						props.setTransportDataList((prevVal) =>
							prevVal.filter((item) => item.id !== id)
						);
					}

					setSuccess(true);
					setTimeout(() => {
						props.OnClick(false);
					}, "2000");
				})
				.catch((err) => {
					console.error(err);

					setError(true);
					setTimeout(() => {
						setError(false);
					}, 4000); // Ustawienie błędu na true w przypadku błędu
				});
		}
	}

	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			transport_date: changeDateFormat(activeObj[0].transport_date),
			time: activeObj[0].time.slice(0, 5),
			starting_place: activeObj[0].starting_place,
			destination: activeObj[0].destination,
			transport_time: activeObj[0].transport_time.slice(0, 5),
			additional_information: activeObj[0].additional_information,
		},
	});
	function a(e) {
		e.preventDefault();
		setIsExpanded((prev) => !prev);
	}

	return (
		<>
			{error && <ErrorBlock message={"Błąd podczas edycji transportu!"} />}
			<motion.form
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 30 }}
				onSubmit={handleSubmit(onSubmit)}
				className={
					themeMode
						? `${styles.modalAddTransportContainer} ${styles.modalAddTransportContainer_darkMode}`
						: `${styles.modalAddTransportContainer}`
				}
				noValidate>
				<div className={styles.titleModal}>
					<h2>Edytuj</h2>
				</div>
				<div
					className={
						themeMode
							? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}`
							: `${styles.inputModalAddTransportBox}`
					}>
					<label htmlFor="transport_date">Data:</label>
					<input
						type="date"
						id="transport_date"
						{...register("transport_date", {
							required: { value: true, message: "Podaj date transportu." },
							min: {
								value: convertTimeToYMD(now),
								message: "Nie można zaplanować transportu w przeszłości.",
							},
						})}
						onClick={(e) => console.log(e.target.value)}
						// min={props.currentData()}
						// value={dataOfTransport.date}
					/>

					{errors.transport_date && (
						<span className={styles.error}>
							{errors.transport_date.message}
						</span>
					)}
				</div>

				<div
					className={
						themeMode
							? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}`
							: `${styles.inputModalAddTransportBox}`
					}>
					<label htmlFor="time">Godzina: </label>
					<input
						type="time"
						id="time"
						placeholder="HH:MM"
						required
						{...register("time", {
							required: "Podaj godzinę transportu.",
							validate: async (value, formValues) => {
							
								
								if (
									value === activeObj[0].time.slice(0,5) &&
									activeObj[0].transport_date === convertTime(formValues.transport_date) &&
									activeObj[0].transport_time.slice(0,5) === formValues.transport_time
								  ) {
									return true;
								  }
								const isValid = await checkHoursTransport(
									convertTime(formValues.transport_date),
									value,
									formValues.transport_time,
									convertTime(props.currentDate),
									filteredTransportDatList
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
				<div
					className={
						themeMode
							? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}`
							: `${styles.inputModalAddTransportBox}`
					}>
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
				<div
					className={
						themeMode
							? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}`
							: `${styles.inputModalAddTransportBox}`
					}>
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

				<div
					className={
						themeMode
							? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}`
							: `${styles.inputModalAddTransportBox}`
					}>
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
				<div
					className={
						themeMode
							? `${styles.inputModalAddTransportBox} ${styles.inputModalAddTransportBox_darkMode}`
							: `${styles.inputModalAddTransportBox}`
					}>
					<label htmlFor="additional_information">Informacje dodatkowe:</label>
					<input
						type="text"
						id="additional_information"
						{...register("additional_information")}
					/>
				</div>
				{isSameData && (
					<div>
						<span className={styles.error}>Nie wprowadzono zmian</span>
					</div>
				)}
				{!success && (
					<div
						className={
							themeMode
								? `${styles.modalAddTransportButtonBox} ${styles.modalAddTransportButtonBox_darkMode}`
								: `${styles.modalAddTransportButtonBox}`
						}>
						<Button name={"Edytuj"}></Button>
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
						<Button name={"Transport edytowany ! "}></Button>
					</div>
				)}
				<div
					className={
						themeMode
							? `${styles.hintBoxButton} ${styles.hintBoxButton_darkMode}`
							: `${styles.hintBoxButton}`
					}>
					<motion.button
						transition={{ type: "Tween", stiffness: 100 }}
						animate={{ rotate: isExpanded ? 180 : 0 }}
						onClick={(e) => a(e)}>
						<i className="fa-solid fa-chevron-right"></i>
					</motion.button>
				</div>
				<HintBox isExpanded={isExpanded} />
			</motion.form>
		</>
	);
}
