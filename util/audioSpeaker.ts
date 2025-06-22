import { Sound } from '../constants'
import { AudioPlayer, useAudioPlayer, AudioModule} from 'expo-audio'
import * as Speech from 'expo-speech'

export class AudioSpeaker {
    player : AudioPlayer

    constructor() {
        this.player = useAudioPlayer()
        AudioModule.setAudioModeAsync({
            shouldPlayInBackground: true,
            interruptionModeAndroid: "duckOthers",
            interruptionMode: "duckOthers",
            playsInSilentMode: true,
        })
    }

    playSound = async (sound : Sound) => {
        return new Promise<void>((resolve) => {
            this.player.replace(sound.src)
            this.player.seekTo(0)
            this.player.play()
            setTimeout(() => { 
                // player.seekTo(0)
                resolve()
            }, sound.duration * 1000 || 2000)
        })
    }

    speak = async (text: string) => {
        await new Promise<void>((resolve, reject) => {
            Speech.speak(text, {
                language: 'pt-BR',
                voice: 'pt-br-x-afs-local',
                // pitch: 1.0,
                rate: 1.2,
                // volume: 1.0,
                volume: 1,
                onDone: () => resolve(),
                onError: (e) => reject(e),
            })
        })
    }

    stop = () => {
        Speech.stop()
    }

}