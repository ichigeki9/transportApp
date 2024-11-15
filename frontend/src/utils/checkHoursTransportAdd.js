import { calculateTransportTime } from "./timeFct";

export function checkHoursTransportAdd(
    dt,
    st,
    tt,
    transportDataList
) {
    function convertTimeToDataObj(z) {
        const year = dt.slice(6);
        const month = dt.slice(3, 5);
        const day = dt.slice(0, 2);
        const d = new Date(`${year}-${month}-${day}T${z}`);
        return d;
    }

    
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