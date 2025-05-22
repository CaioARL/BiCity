
/**
 * @description This function checks if the given date string is equal to today's date.
 * 
 * @param date with format DD/MM/YYYY
 * @param today Date object
 * @returns {boolean} true if the date is today
 */
export const isSameDate = (date: string, today : Date): boolean => {
    const [day, month, year] = date.split('/').map(Number)
    const dateToCheck = new Date(year, month - 1, day)
    return (
        dateToCheck.getDate() === today.getDate() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getFullYear() === today.getFullYear()
    )
}