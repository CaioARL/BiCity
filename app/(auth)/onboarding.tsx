import { View, FlatList, Animated } from 'react-native'
import React, { useState, useRef } from 'react'
import { router } from 'expo-router'
import { slides } from 'util/slides'
import OnBoardingItem from 'components/onboarding/OnboardingItem'
import Paginator from 'components/onboarding/Paginator'
import NextButton from 'components/onboarding/NextButton'

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current
    const slidesRef = useRef<FlatList>(null)
  
    const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index)
      }
    }).current
  
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current
  
    const scrollToNext = () => {
      if (currentIndex < slides.length - 1) {
        slidesRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true
        })
      } else {
        // completeOnboarding() // problema com router, aqui ele retorna imediatamente assim que este componente é montado
        console.log('Onboarding sendo chamado')
      }
    }
  
    const completeOnboarding = () => {
      // try {
        console.log('Onboarding sendo chamado')
        router.back()
      // } catch (error) {
        // console.error('Erro ao salvar status do onboarding:', error)
      // }
    }
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
        <View style={{ flex: 3 }}>
          <FlatList
            data={slides}
            renderItem={({ item }) => <OnBoardingItem item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>
  
        <Paginator data={slides} scrollX={scrollX} />
  
        <NextButton
          scrollTo={scrollToNext}
          // scrollTo={completeOnboarding}
          percentage={(currentIndex + 1) * (100 / slides.length)}
          data={slides}
          scrollX={scrollX}
        />
      </View>
    )
}
