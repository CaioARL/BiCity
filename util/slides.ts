import { ImageSourcePropType } from 'react-native';
import { VideoSource } from 'expo-video';

type MediaSource = 
  | { type: 'image'; source: ImageSourcePropType }
  | { type: 'video'; source: VideoSource };

export interface Slide {
  id: string;
  media: MediaSource;
  title: string;
  description: string;
}

const localVideoSource = (requirePath: number): VideoSource => ({
  uri: `file://${requirePath}`,

});

export const slides: Slide[] = [
  {
    id: '1',
    media: {
      type: 'image',
      source: require('../assets/img/profile.jpg'),
    },
    title: 'Quem Somos?',
    description: 'Somos o BiCity, aplicativo feito para os ciclistas de São Paulo, não temos corrente dentro do Brasil, seremos o primeiro e com uma grande parte do mercado beneficiando todos que praticam esporte.',
  },
  {
    id: '2',
    media: {
      type: 'video',
      source: require('../assets/slide/3.mp4'),
    },
    title: 'Oque Oferecemos?',
    description: 'Objetivo de oferecer avaliação coletiva das ciclovias da cidade, além da centralização de eventos relacionados ao esporte.',
  },
  {
    id: '3',
    media: {
      type: 'image',
      source: require('../assets/img/profile.jpg'),
    },
    title: 'Como Usar?',
    description: 'Ciclistas: Cadastre-se com e-mail ou CPF, avalie ciclovias e descubra eventos incríveis para pedalar. \nEmpresas: Registre-se com e-mail ou CNPJ e comece a divulgar seus eventos de ciclismo na hora. \nTudo simples, rápido e feito para unir a comunidade do pedal. Pronto para fazer parte?',
  },
    {
    id: '4',
    media: {
      type: 'image',
      source: require('../assets/img/profile.jpg'),
    },
    title: 'Sobre Nós:',
    description: '1. Cadastre-se como Ciclista ou Empresa.',
  },
];