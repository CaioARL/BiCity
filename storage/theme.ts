import AsyncStorage from '@react-native-async-storage/async-storage'


const THEME_KEY = '@theme'

/**
 * Check if theme is registered in memory
 * 
 * @returns Retorna verdadeiro se theme estiver registrado em memoria
 * @returns Return true if theme is registered in memory
 */
export const checkTheme = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(THEME_KEY)
        if ( value === null )
            return false
        return true
    } catch(e) {
        console.error('Error checking storage: theme', e)
        return false
    }
}

export const storeTheme = async (theme: string) => {
    try {
        await AsyncStorage.setItem(THEME_KEY, theme)
    } catch (e) {
        console.error('Error storing theme:', e)
    }
}

export const getTheme = async (): Promise<'light' | 'dark' | null> => {
    try {
        const value = await AsyncStorage.getItem(THEME_KEY)
        return value === 'light' || value === 'dark' ? value : null
    } catch (e) {
        console.error('Error getting theme from storage:', e)
        return null
    }
}

export const clearTheme = async () => {
    try {
        await AsyncStorage.removeItem(THEME_KEY)
    } catch (e) {
        console.error('Error clearing theme', e)
    }
}