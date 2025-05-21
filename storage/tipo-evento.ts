import AsyncStorage from '@react-native-async-storage/async-storage'
import { TipoEvento } from 'types'


const TIPOS_EVENTO_KEY = '@tipos_evento'
/**
 * Check if TipoEvento is registered in memory
 * 
 * @returns Retorna verdadeiro se tipos eventos esta registrado em memoria
 * @returns Return true if tipoEvento is registered in memory
 */
export const checkTiposEvento = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(TIPOS_EVENTO_KEY)
        if ( value === null )
            return false
        return true
    } catch(e) {
        console.error('Error checking tipos de evento', e)
        return false
    }
}

export const storeTiposEvento = async (tipos: TipoEvento[]) => {
    try {
        const jsonValue = JSON.stringify(tipos)
        await AsyncStorage.setItem(TIPOS_EVENTO_KEY, jsonValue)
    } catch (e) {
        console.error('Error storing tipos de evento:', e)
    }
}

export const getTiposEvento = async (): Promise<TipoEvento[] | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(TIPOS_EVENTO_KEY)
        return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
        console.error('Error getting tipos de evento:', e)
        return []
    }
}

export const clearTiposEvento = async () => {
    try {
        await AsyncStorage.removeItem(TIPOS_EVENTO_KEY)
    } catch (e) {
        console.error('Error clearing tipos de evento:', e)
    }
}