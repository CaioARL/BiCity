
/**
 * @description This function checks if the given date string is equal to a specific Date Object.
 * 
 * @param date with format DD/MM/YYYY
 * @param aDate Date object
 * @returns {boolean} true if the date string is equal to the Date object, false otherwise 
 */
export const isSameDate = (date: string, aDate : Date): boolean => {
    const [day, month, year] = date.split('/').map(Number)
    const dateToCheck = new Date(year, month - 1, day)
    return (
        dateToCheck.getDate() === aDate.getDate() &&
        dateToCheck.getMonth() === aDate.getMonth() &&
        dateToCheck.getFullYear() === aDate.getFullYear()
    )
}

export const formatDate = (dateString: string): string => {
    if (!dateString) return 'Data desconhecida'

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
        })
    } catch (error) {
        return 'Data inválida'
    }
}