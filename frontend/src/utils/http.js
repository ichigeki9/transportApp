// export async function fetchTransportList(){
// 		setIsFetching(true)
// 		const response = await fetch(`http://127.0.0.1:5000/api/transports?transport_date=${convertTime(currentDate)}`)

// 		if (!response.ok){
// 			const error = new Error('Błąd podczas pobierania listy transportów');
// 			error.code = response.status;
// 			error.info = await response.json()
// 		}

// 		const {data} = await response.json()
// 		return data

// 	}
// import { convertTime } from "../utils/timeFct.js";

// const now = new Date();


// export async function fetchTransportList() {
//     setIsFetching(true);
//     try {
//         const response = await fetch(
//             `http://127.0.0.1:5000/api/transports?transport_date=${convertTime(
//                 currentDate
//             )}`
//         );
//         const resData = await response.json();

//         if (!response.ok) {
//             const error = new Error("Nie można pobrać listy transportów");
//             setError(true);
//         }
//         setTransportDataList(resData.data);
//     } catch (error) {}

//     setIsFetching(false);
// }
// fetchTransportList();