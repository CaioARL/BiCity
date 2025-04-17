import { View, Text, TouchableOpacity, Image } from 'react-native' 
import React from 'react' 
 
interface ButtonModalProps { 
    handlePress: () => void 
    title: string 
    customStyles?: string 
    textStyles?: string 
    isLoading?: boolean 
    disabled?: boolean 
    customColor?: string 
    iconSource?: any  // Change type to 'any' or 'ImageSourcePropType'
} 
 
export default function ButtonModal({ 
    handlePress, 
    title, 
    customStyles, 
    textStyles, 
    isLoading, 
    disabled, 
    customColor, 
    iconSource  // Add iconSource to destructuring
}: ButtonModalProps) { 
  return ( 
    <TouchableOpacity  
        onPress={handlePress}   
        className={ 
            `${customStyles} p-[10px] rounded-[5px] w-[45%] flex-row items-center justify-center ${isLoading ? 'opacity-50' : ''} ${disabled ? 'bg-[#CCC]' : customColor? customColor : 'bg-primary_green'}` 
        }  
        disabled={disabled} 
    > 
        {iconSource && (
            <Image 
              source={iconSource} 
              className="w-6 h-6 ml-2" 
              resizeMode="cover"
            />
        )}
        <Text className={textStyles? textStyles :'text-[#FFF] font-bold text-center'}>{title}</Text> 
    </TouchableOpacity> 
  ) 
}