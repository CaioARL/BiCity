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
      source: require('../assets/slide/quem-somos.png'),
    },
    title: 'Quem Somos?',
    description: 'Somos o BiCity, aplicativo feito para os ciclistas de São Paulo, não temos Concorrentes dentro do Brasil, seremos o primeiro e com uma grande parte do mercado beneficiando todos que praticam esporte.',
  },
  {
    id: '2',
    media: {
      type: 'video',
      source: require('../assets/slide/oque-oferecemos.mp4'),
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
    description: 'Empresas: \nRegistre-se com e-mail e CNPJ e comece a divulgar seus eventos de ciclismo na hora',
  },
    {
    id: '4',
    media: {
         type: 'image',
      source: require('../assets/img/profile.jpg'),
    },
    title: 'Como Usar?',
    description: 'Ciclistas:\n Cadastre-se com e-mail e CPF, avalie ciclovias e descubra eventos incríveis para pedalar.',
  },
  {
    id: '5',
    media: {
      type: 'video',
      source: require('../assets/slide/como-usar-evento.mp4'),
    },
    title: 'Como Usar?',
    description: 'Tela de Eventos:\n Você visualiza todos os eventos disponíveis.\n Clicar em um evento para ver todas as informações. \n Precisa saber a localização? toque em qualquer ícone de localização para ser redirecionado automaticamente ao mapa',
  },
  {
    id: '6',
    media: {
      type: 'video',
      source: require('../assets/slide/como-usar-pins.mp4'),
    },
    title: 'Estamos com Novos Ícones',
    description: 'Ícones de Evento: representam os Eventos, com as cores Verde(Gratuitos) e Bronze(Pagos)\n\n  Ícone de Problemas: representam as Ocorrências ou Obstáculos, com cores diversas.\n',
  },


    {
    id: '7',
    media: {
      type: 'image',
      source: require('../assets/img/profile.jpg'),
    },
    title: 'Sobre Nós:',
    description: '\nLorem',
  },
  {
    id: '8',
    media: {
      type: 'image',
      source: require('../assets/img/profile.jpg'),
    },
    title: 'Sobre Nós:',
    description: '\nTudo simples, rápido e feito para unir a comunidade do pedal. Pronto para fazer parte?',
  },
];