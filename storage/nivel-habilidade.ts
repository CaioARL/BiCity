import AsyncStorage from '@react-native-async-storage/async-storage'
import { NivelHabilidade } from 'types'


const NIVEIS_HABILIDADE_KEY = '@niveis_habilidade'

/**
 * Check if nivelHabilidade is registered in memory
 * 
 * @returns Retorna verdadeiro se nivelHabilidade estiver registrado em memoria
 * @returns Return true if nivelHabilidade is registered in memory
 */
export const checkHabilidades = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(NIVEIS_HABILIDADE_KEY)
        if ( value === null )
            return false
        return true
    } catch(e) {
        console.error('Error checking habilidades', e)
        return false
    }
}

export const storeHabilidades = async (habilidades: NivelHabilidade[]) => {
    try {
        const jsonValue = JSON.stringify(habilidades)
        await AsyncStorage.setItem(NIVEIS_HABILIDADE_KEY, jsonValue)
    } catch (e) {
        console.error('Error storing habilidades:', e)
    }
}

export const getHabilidades = async (): Promise<NivelHabilidade[] | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(NIVEIS_HABILIDADE_KEY)
        return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
        console.error('Error getting habilidades:', e)
        return []
    }
}

export const clearHabilidades = async () => {
    try {
        await AsyncStorage.removeItem(NIVEIS_HABILIDADE_KEY)
    } catch (e) {
        console.error('Error clearing habilidades:', e)
    }
}