import { TransportAppLayout } from "./components/TransportAppLayout/TransportAppLayout";

import styles from "./App.module.css";
import { useEffect, useState, useContext } from "react";
import { InfoContainer } from "./components/infoContainer/InfoContainer";
import { TransportManageContainer } from "./components/TransportManageContainer/TransportManageContainer";
import { ModalAddTransport } from "./components/ModalAddTransport/ModalAddTransport";
import { ModalEditTransport } from "./components/ModalEditTransport/ModalEditTransport";
import { convertTime } from "./utils/timeFct.js";
// import { fetchTransportList } from "./utils/http.js";
import { ErrorBlock } from "./components/ErrorBlock/ErrorBlock.jsx";
import { AnimatePresence } from "framer-motion";
import { ThemeContext } from "./context/ThemeContext.js";

function App() {
	const now = new Date();

	const [addModalVisible, setAddModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);

	const [currentDate, setCurrentDate] = useState(now);
	const [transportDataList, setTransportDataList] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [darkMode, setDarkMode] = useState(false)
	const [error, setError] = useState(false);

	
	useEffect(() => {
		async function fetchTransportList() {
			setIsFetching(true);
			setError(false); // Resetowanie błędu przed nowym żądaniem
	
			try {
				const response = await fetch(
					`http://192.168.25.7:5000/transports?transport_date=${convertTime(
						currentDate
					)}`
				);
				
				if (!response.ok) {
					throw  new Error("Błąd sieciowy"); // Obsługa błędów HTTP
				
					
				}
	
				const resData = await response.json();
				setTransportDataList(resData.data);
			} catch (error) {
				
				
				setError(true); // Ustawienie stanu błędu na true, jeśli wystąpi wyjątek
				setTimeout(() => {
					setError(false)
				},3000)
			} finally {
				setIsFetching(false); // Zakończenie procesu pobierania danych
			}
		}
	
		fetchTransportList();
	}, [currentDate]);

	
		
	

	
	return (
		<ThemeContext.Provider value={darkMode}>
			{error && <ErrorBlock message={"Błąd podczas pobierania listy transportów"} />}
			<AnimatePresence>
				{addModalVisible && (
					<ModalAddTransport
						transportDataList={transportDataList}
						OnClick={setAddModalVisible}
						setTransportDataList={setTransportDataList}
						currentDate={currentDate}
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{editModalVisible && (
					<ModalEditTransport
						transportDataList={transportDataList}
						OnClick={setEditModalVisible}
						setTransportDataList={setTransportDataList}
						currentDate={currentDate}
					/>
				)}
			</AnimatePresence>

			<TransportAppLayout>
				<InfoContainer
					transportDataList={transportDataList}
					currentData={currentDate}
					setCurrentDate={setCurrentDate}
				/>
				<TransportManageContainer
					setAddModalVisible={setAddModalVisible}
					setEditModalVisible={setEditModalVisible}
					transportDataList={transportDataList}
					setTransportDataList={setTransportDataList}
					setDarkMode={setDarkMode}
					isLoading={isFetching}
				/>
			</TransportAppLayout>
		</ThemeContext.Provider>
	);
}

export default App;

