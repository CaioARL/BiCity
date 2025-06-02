import * as Speech from 'expo-speech'

export class AudioSpeaker {

  constructor() {
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