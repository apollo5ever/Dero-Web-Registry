export default function dateString(epoch){
    
    let date = new Date(epoch*1000)
    let month = date.getMonth()
    let monthString = getMonthString(month)
   

    let local = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${monthString} ${date.getDate()} ${date.getFullYear()}`

    let utc = `${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')} ${getMonthString(date.getUTCMonth())} ${date.getUTCDate()} ${date.getUTCFullYear()} UTC`
    

    return {local,utc}

    
}

function getMonthString(month){
    let monthString = ""
    switch(month){
        case 0:
            monthString = "Jan";
            break;
        case 1:
            monthString = "Feb";
            break;
        case 2:
            monthString = "Mar";
            break;
        case 3:
            monthString = "Apr";
            break;
        case 4:
            monthString = "May";
            break;
        case 5:
            monthString = "Jun";
            break;
        case 6:
            monthString = "Jul";
            break;
        case 7:
            monthString = "Ago";
            break;
        case 8:
            
            monthString = "Sep";
            break;
        case 9:
            monthString = "Oct";
            break;
        case 10:
            
            monthString = "Nov";
            break;
        case 11:
            
            monthString = "Dec";
            break;
    }
    return monthString
}