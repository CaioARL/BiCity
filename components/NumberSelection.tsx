import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ButtonModal from './ButtonModal'

interface NumberSelectionProps {
    onClose: (number: string) => void
    numbers?: string[]
}

export default function NumberSelection({ onClose, numbers }: NumberSelectionProps) {
    const ITEM_HEIGHT = 70 // Height of each item
    const VISIBLE_ITEMS = 3 // Number of items to show in the view
    const [selectItem, selectedItem] = useState('00')
    const scrollViewRef = useRef<ScrollView>(null)
    const listItems = numbers || Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))

    useEffect(() => {
        if (scrollViewRef.current) {
            const indexHour = listItems.indexOf(selectItem)
            const initialHourPosition = (listItems.length + indexHour) * ITEM_HEIGHT
            scrollViewRef.current.scrollTo({ y: initialHourPosition, animated: false })
        }
    }, [])

    const infiniteScroll = [...listItems, ...listItems, ...listItems]

    const handleScrollEndHour = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y
        const totalHeight = listItems.length * ITEM_HEIGHT

        if (offsetY < totalHeight) {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: offsetY + totalHeight, animated: false })
            }
        } else if (offsetY >= totalHeight * 2) {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: offsetY - totalHeight, animated: false })
            }
        }

        const normalizedOffset = offsetY % totalHeight
        const index = Math.round(normalizedOffset / ITEM_HEIGHT)
        selectedItem(listItems[index===listItems.length?0:index])
    }

    return (
        <View className="absolute flex-row items-center h-full w-full bg-[rgba(0,0,0,0.5)]">
            <View className="flex-col w-full items-center justify-center">
                <View
                    style={{
                        marginBottom: 20,
                        height: ITEM_HEIGHT * VISIBLE_ITEMS,
                        width: '100%',
                        overflow: 'hidden',
                        backgroundColor: 'primary_green',
                    }}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={ITEM_HEIGHT}
                        decelerationRate="fast"
                        onMomentumScrollEnd={handleScrollEndHour}
                        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
                    >
                        {infiniteScroll.map((hour, index) => (
                            <View
                                key={`hour-${index}`}
                                style={{
                                    height: ITEM_HEIGHT,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 40,
                                        textAlign: 'center',
                                        color: hour === selectItem ? 'white' : '#A9A9A9',
                                        fontWeight: hour === selectItem ? 'bold' : 'normal',
                                    }}
                                >
                                    {hour}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <ButtonModal
                    title="OK"
                    handlePress={() => onClose(selectItem)}
                    customStyles="bg-[#ffcc00] w-full"
                    textStyles="text-black text-lg font-bold"
                />
            </View>
        </View>
    )
}