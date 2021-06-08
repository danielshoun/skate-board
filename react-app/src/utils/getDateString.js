function getDateString(isoDate) {
    const dateObj = new Date(isoDate + "Z");
    let timeString;
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    timeString = `${dateObj.getMonth() + 1}/${
        dateObj.getDate()
    }/${dateObj.getFullYear()}, ${hours}:${minutes} ${ampm}`;
    return timeString;
}

export default getDateString;
