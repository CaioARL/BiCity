/**
 * src: The path to the sound file.
 * duration: The duration of the sound in seconds.
 */
export interface Sound {
    src: number
    duration: number
}

/**
 * This file contains sound constants used in the application.
 * src: The path to the sound file.
 * duration: The duration of the sound in seconds.
 */
export const sounds = {
    beep: {
        src: require('../assets/sounds/beep.wav'),
        duration: 2.5,
    },
    horn: {
        src: require('../assets/sounds/horn.mp3'),
        duration: 2.5,
    },
    alert: {
        src: require('../assets/sounds/alert.wav'),
        duration: 3.0,
    },
    problem_notification: {
        src: require('../assets/sounds/problem_notify.wav'),
        duration: 3.5,
    },
}