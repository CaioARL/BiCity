import { Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { router } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from 'expo-status-bar'


export default function HelpModal() {
  return (
    <SafeAreaView>
      <TouchableOpacity
          style={{ position: 'absolute', top: 45, right: 20, borderRadius: '50%',  paddingHorizontal: 15,
            paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 10,}} 
            className='bg-primary_green'
            onPress={() => router.back()}
          >
          <Ionicons name="arrow-back" size={24} color="#555"/>
      </TouchableOpacity>
      <ScrollView className='w-full h-full container' contentContainerStyle={{paddingBottom:100, paddingTop:100, paddingHorizontal:'5%'}} >
              <Text className='text-3xl text-center font-robotobold'>Qualidade das vias</Text>
                <Text className='text-base  font-roboto my-4'>
                  As ciclovias são avaliadas pelos próprios usuários, cujas notas atribuídas influenciam diretamente na classificação da qualidade de cada via.
                </Text>
                <Image
                  style={{ width: '100%' , height: 'auto', aspectRatio: 9/16 }}
                  resizeMode='center'
                  source={require('../assets/img/illustration_help_cycle_lane_portrait_quality_v2.png')}
                />
                
              <Text className='text-base font-roboto my-4'>
                Existem três cores diferentes para as ciclovias: verde, laranja e vermelho, que auxiliam na identificação do estado das vias e proporcionam uma navegação mais segura pela cidade. Ciclovias que ainda não foram avaliadas recebem, temporariamente, a mesma cor das ciclovias consideradas de boa qualidade.
              </Text>
              <Text className='text-base font-roboto my-4'>
                A cor verde indica que a ciclovia é de alta qualidade, com boa pavimentação e sinalização adequada. 
              </Text>
              <Image
                style={{ width: '100%' , height: 'auto', aspectRatio: 21/9 }}
                resizeMode="center"
                source={require('../assets/img/illustration_help_good_quality.png')}
              />
              <Text className='text-base font-roboto my-4'>
                A cor laranja indica uma qualidade média, onde pode haver algumas irregularidades ou falta de sinalização. 
              </Text>
              <Image
                style={{ width: '100%' , height: 'auto', aspectRatio: 21/9 }}
                resizeMode="center"
                source={require('../assets/img/illustration_help_medium_quality.png')}
              />
              <Text className='text-base font-roboto my-4'>
                A cor vermelha indica baixa qualidade, com problemas significativos na via, como buracos ou falta de manutenção.
              </Text>
              <Image
                style={{ width: '100%' , height: 'auto', aspectRatio: 21/9 }}
                resizeMode="center"
                source={require('../assets/img/illustration_help_bad_quality.png')}
              />
              <Text className='text-3xl text-center font-robotobold mt-6'>Avalie as vias</Text>
              <Image
                style={{ width: '100%' , height: 'auto', aspectRatio: 1/1 }}
                resizeMode="center"
                source={require('../assets/img/illustration_help_evaluate_lane_ratio_1by1_v2.png')}
              />
              <Text className='text-base font-roboto mb-10'>
                Você pode contribuir para a melhoria das ciclovias avaliando-as. Para isso, basta pressionar a ciclovia no mapa e atribuir uma nota de 1 a 5 estrelas, além de deixar um comentário sobre a qualidade da via.
              </Text>
      </ScrollView>
      <StatusBar hidden/>
    </SafeAreaView>
  )
}