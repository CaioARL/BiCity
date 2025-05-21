import AsyncStorage from "@react-native-async-storage/async-storage"
import  Constants from "expo-constants"

const VERSION_KEY = "@app_version"
const CURRENT_VERSION = Constants.expoConfig?.version || "1.1.1"

/**
 * Check if app version is the same as the one stored in memory
 * @returns Retorna verdadeiro se a versao e a mesma registrada em memoria
 * @returns true if app version is the same registered in memory
 */
export const checkStoredVersion = async () => {
    try {
        const storedVersion = await AsyncStorage.getItem(VERSION_KEY)
        if (storedVersion !== CURRENT_VERSION) {
            await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION)
            return false
        }
        return true
    } catch (error) {
        console.error("Error checking stored version:", error)
        return false
    }
}

export const isFirstLaunch = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem('@isFirstLaunch')
        if (value === null) {
            await AsyncStorage.setItem('@isFirstLaunch', 'false')
            return true
        }
        return false
    } catch (error) {
        console.error('Error checking first launch:', error)
        return false
    }
}

export const isOnboardingVisualized = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem('@onboardingVisualized')
        if (value === null) {
            return true
        }
        return false
    } catch (error) {
        console.error('Error checking onboarding visualized:', error)
        return false
    }
}

export const setOnboardingVisualized = async () => {
    try {
        await AsyncStorage.setItem('@onboardingVisualized', 'false')
    } catch (error) {
        console.error('Error setting onboarding visualized:', error)
    }
}