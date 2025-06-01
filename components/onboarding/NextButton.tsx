import { View, Animated, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Slide } from '../../util/slides';
import Svg, { G, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

interface NextButtonProps {
  percentage: number;
  data: Slide[];
  scrollX: Animated.Value;
  scrollTo: () => void;
}

export default function NextButton({ percentage, data, scrollX, scrollTo }: NextButtonProps) {
  const size = 128;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const { width } = useWindowDimensions(); 
  const [currentIndex, setCurrentIndex] = useState(0); 

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef<Circle>(null);

  const animation = (toValue: number) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      setCurrentIndex(index);
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, [scrollX, width]);

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    const listener = progressAnimation.addListener(({ value }: { value: number }) => {
      const strokeDashoffset = circumference - (circumference * value) / 100;

      if (progressRef.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => {
      progressAnimation.removeListener(listener);
    };
  }, [percentage, circumference]);

  const isLastSlide = currentIndex === data.length - 1;

  return (
    <View className="flex-row h-16 items-center justify-center">
      <Svg width={size} height={size}>
        <G rotation="-90" originX={center} originY={center}>
          <Circle
            stroke="#E6E7E8"
            fill="none"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            ref={progressRef}
            stroke="#C3FF00"
            fill="none"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </G>
      </Svg>

      <TouchableOpacity
        onPress={scrollTo}
        activeOpacity={0.7}
        className="bg-primary_green p-5"
        style={{ position: 'absolute', borderRadius: 100 }}
      >
        {isLastSlide ? (
          <Ionicons name="checkmark-outline" size={24} color="#555" style={{ marginLeft: 5 }} />
        ) : (
          <Ionicons name="arrow-forward-outline" size={24} color="#555" style={{ marginLeft: 5 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}