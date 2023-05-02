// helper function to add time to a Date object
export default function addTime(date: Date, hours: number, minutes: number, seconds: number): Date {
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    date.setSeconds(date.getSeconds() + seconds);
    return date;
};