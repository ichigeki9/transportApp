
// import { calculateTransportTime } from "./timeFct";

// export function checkHoursTransport(
// 	dt,
// 	st,
// 	tt,
// 	currentDate,
// 	transportDataList
// ) {
// 	// console.log(dt);
// 	// console.log(st);
// 	// console.log(tt);
// 	// console.log(currentDate);
// 	// console.log(transportDataList);
// 	// console.log("====================");
    
//     function convertTimeToDataObj(z) {
//         const year = dt.slice(6);
//         const month = dt.slice(3, 5);
//         const day = dt.slice(0, 2);
//         const d = new Date(`${year}-${month}-${day}T${z}`);
//         return d;
//     }
 
    
// 	if (!(dt == currentDate)) {
// 		console.log("inna data");

// 		fetch(`http://127.0.0.1:5000/api/transports?transport_date=${dt}`)
// 			.then((res) => res.json())
// 			.then((res) => {
// 				const dataList = res.data;
// 				console.log(dataList);

// 				if (dataList.length > 0) {
// 					for (let item of dataList) {
// 						const existingStartTime = convertTimeToDataObj(item.time);
// 						const existingEndTime = convertTimeToDataObj(
// 							calculateTransportTime(
// 								item.transport_date,
// 								item.time,
// 								item.transport_time
// 							)
// 						);

// 						const finishTime = convertTimeToDataObj(
// 							calculateTransportTime(dt, st, tt)
// 						);
// 						const startTime = convertTimeToDataObj(st);

// 						if (startTime < existingEndTime && finishTime > existingStartTime) {
// 							console.log("NIE MOŻNA DODAĆ: Godzina transportu koliduje");

//                             console.log('false');
// 							return false;
// 						}
// 					}
// 				} 
//                     console.log('trues');
// 					return true;
				
// 			});
// 	} else {
// 		console.log("ta sama  data");
// 		console.log(transportDataList);

//         if (transportDataList.length > 1) {
//             for (let item of transportDataList) {
//                 const existingStartTime = convertTimeToDataObj(item.time);
//                 const existingEndTime = convertTimeToDataObj(
//                     calculateTransportTime(
//                         item.transport_date,
//                         item.time,
//                         item.transport_time
//                     )
//                 );
                
//                 const finishTime = convertTimeToDataObj(
//                     calculateTransportTime(dt, st, tt)
//                 );
//                 const startTime = convertTimeToDataObj(st);
                
//                 if (startTime < existingEndTime && finishTime > existingStartTime) {
//                     console.log("NIE MOŻNA DODAĆ: Godzina transportu koliduje");
//                     console.log('false');
//                     return false;
//                 }
//             }
//         } 
//             console.log('true');
//             return true;
        
// 	}
    

    
// }

	

// ==========================================
import { calculateTransportTime } from "./timeFct";

export async function checkHoursTransport(
    dt,
    st,
    tt,
    currentDate,
    transportDataList
) {
    function convertTimeToDataObj(z) {
        const year = dt.slice(6);
        const month = dt.slice(3, 5);
        const day = dt.slice(0, 2);
        const d = new Date(`${year}-${month}-${day}T${z}`);
        return d;
    }

    if (!(dt === currentDate)) {
        console.log("inna data");

        try {
            const res = await fetch(`http://192.168.25.7:5000/transports?transport_date=${dt}`);
            const data = await res.json();
            const dataList = data.data;
            console.log(dataList,'=====');
            
            
            if (dataList.length > 0) {
                for (let item of dataList) {
                    const existingStartTime = convertTimeToDataObj(item.time);
                    const existingEndTime = convertTimeToDataObj(
                        calculateTransportTime(
                            item.transport_date,
                            item.time,
                            item.transport_time
                        )
                    );

                    const finishTime = convertTimeToDataObj(calculateTransportTime(dt, st, tt));
                    const startTime = convertTimeToDataObj(st);

                    if (startTime < existingEndTime && finishTime > existingStartTime) {
                        // console.log("NIE MOŻNA DODAĆ: Godzina transportu koliduje");
                        return false;
                    }
                }
            }

            return true;
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
            return false;
        }
    } else {
        // console.log("ta sama data");
        // console.log(transportDataList);

        if (transportDataList.length > 0) {
            for (let item of transportDataList) {
                const existingStartTime = convertTimeToDataObj(item.time);
                const existingEndTime = convertTimeToDataObj(
                    calculateTransportTime(
                        item.transport_date,
                        item.time,
                        item.transport_time
                    )
                );

                const finishTime = convertTimeToDataObj(calculateTransportTime(dt, st, tt));
                const startTime = convertTimeToDataObj(st);

                if (startTime < existingEndTime && finishTime > existingStartTime) {
                    // console.log("NIE MOŻNA DODAĆ: Godzina transportu koliduje");
                    return false;
                }
            }
        }

        return true;
    }
}





// {...register("time", {
//     required: { value: true, message: "Podaj godzine transportu." },
//     validate: async (value, formValues) => {
//         const isValid = await checkHoursTransport(
//             convertTime(formValues.transport_date),
//             value,
//             formValues.transport_time,
//             convertTime(props.currentDate),
//             props.transportDataList
//         );
        
//         return (
//             isValid ||
//             "Godzina transportu koliduje z istniejącym transportem."
//         );
//     },
// })}