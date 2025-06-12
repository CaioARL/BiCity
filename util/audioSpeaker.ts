import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import * as Speech from 'expo-speech'
import { Sound, sounds } from '../constants'

export class AudioSpeaker {
    player : AudioPlayer  


    constructor() {
        this.player = useAudioPlayer(sounds.beep.src)
    }

    playSound = async (sound : Sound = sounds.beep ) => {
        await new Promise<void>((resolve) => {
            this.player.replace(sound.src)
            this.player.play()
            setTimeout(() => {
                this.player.seekTo(0)
                resolve()
            }, sound.duration * 1000)
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