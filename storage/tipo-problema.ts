import AsyncStorage from '@react-native-async-storage/async-storage'
import { TipoProblema } from 'types'

const TIPO_PROBLEMA_KEY = '@tipo_problema'
/**
 * Check if TipoProblema is registered in memory
 * 
 * @returns Retorna verdadeiro se tipo problema esta registrado em memoria
 * @returns Return true if tipoProblema is registered in memory
 */
export const checkTipoProblema = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(TIPO_PROBLEMA_KEY)
        if ( value === null )
            return false
        return true
    } catch(e) {
        console.error('Error checking tipos de problema', e)
        return false
    }
}

export const storeTipoProblema = async (tipos: TipoProblema[]) => {
    try {
        const jsonValue = JSON.stringify(tipos)
        await AsyncStorage.setItem(TIPO_PROBLEMA_KEY, jsonValue)
    } catch (e) {
        console.error('Error storing tipo de problema:', e)
    }
}

export const getTipoProblema = async (): Promise<TipoProblema[] | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(TIPO_PROBLEMA_KEY)
        return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
        console.error('Error getting tipos de problema:', e)
        return []
    }
}

export const clearTipoEvento = async () => {
    try {
        await AsyncStorage.removeItem(TIPO_PROBLEMA_KEY)
    } catch (e) {
        console.error('Error clearing tipos de problema:', e)
    }
}