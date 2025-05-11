import AsyncStorage from '@react-native-async-storage/async-storage'
import { TipoEvento } from 'types'


const TIPOS_EVENTO_KEY = '@tipos_evento'


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