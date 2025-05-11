import { ImageSourcePropType } from 'react-native';

export interface Slide {
  id: string
  image: ImageSourcePropType
  title: string
  description: string
}

export const slides: Slide[] = [
  {
    id: '1',
      image: require('../assets/img/profile.jpg'), // Adjust paths as needed
    title: 'Welcome',
    description: 'Explore the app!',
  },
  {
    id: '2',
      image: require('../assets/img/profile.jpg'),
    title: 'Discover',
    description: 'Find new features!',
  },
  {
    id: '3  ',
      image: require('../assets/img/profile.jpg'),
    title: 'Discover',
    description: 'Find new features!',
  },
  {
    id: '4  ',
      image: require('../assets/img/profile.jpg'),
    title: 'Discover',
    description: 'Find new features!',
  },
  // Add more slides
]

