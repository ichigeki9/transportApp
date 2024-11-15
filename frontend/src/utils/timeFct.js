export function convertTime(time, day, month , year){
    const date = new Date(time)
    
    if (date.getDate() < 10) {
         day = `0${date.getDate()}`;
    } else {
         day = date.getDate();
    }
    if (date.getMonth() + 1 < 10) {
         month = `0${date.getMonth() + 1}`;
    } else {
         month = date.getMonth() + 1;
    }
     year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`
  
    
    return formattedDate
    
}

export function convertTimeToYMD(time, day, month , year){
     const date = new Date(time)
     
     if (date.getDate() < 10) {
          day = `0${date.getDate()}`;
     } else {
          day = date.getDate();
     }
     if (date.getMonth() + 1 < 10) {
          month = `0${date.getMonth() + 1}`;
     } else {
          month = date.getMonth() + 1;
     }
      year = date.getFullYear();
 
     const formattedDate = `${year}-${month}-${day}`
   
     
     return formattedDate
     
 }

 export function calculateTransportTime(date, time, timeToAdd){
     const year = date.slice(6)
     const month = date.slice(3,5)
     const day = date.slice(0,2)
     const hours = timeToAdd.slice(0,2)
     const minutes = timeToAdd.slice(3,5)
     // console.log(Number(hours));
     // console.log(Number(minutes));
     

     let d1 = new Date(`${year}-${month}-${day}T${time}`)
     

     d1.setHours(d1.getHours() + Number(hours));
     // console.log(d1);
     
     d1.setMinutes(d1.getMinutes() + Number(minutes));
     // console.log(d1);
     const h = d1.getHours()
     const m = d1.getMinutes()
     // console.log(d1.toLocaleTimeString());
     // console.log(m);

     
     return d1.toLocaleTimeString().slice(0,5)
     
 }