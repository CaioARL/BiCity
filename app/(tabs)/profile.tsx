import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import CustomProfile from '../../css/CustomProfile'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthProvider } from '../context/AuthProvider'
import { router } from 'expo-router'
import { updateImageUser } from '../../api/usuario'
import LoadingActivity from '../../components/LoadingActivity'
import ShowAlert from '../../components/ShowAlert'
import { Appearance } from 'react-native'


export default function Profile(){
  const { authState, fetchUser } = useAuthProvider()
  
  const theme = Appearance.getColorScheme()

  const [updateImage, setUpdateImage] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [userAlert, setUserAlert] = useState<{type: 'error' | 'loading' | 'success' , message: string} | null>(null)

  // useEffect(()=>{
  //   isEditing ? 
  //     router.setParams({tabBarVisible: 'no'})
  //   :
  //     router.setParams({tabBarVisible: 'yes'})
  // },[isEditing])

  // useEffect(() => {
  //   if (authState?.user) {
  //     if (authState.user) {
  //         setUsuario(authState.user)
  //     }
  //   }  
  // }, [authState])

  useEffect(() => {
    if(!updateImage) return
    if(!authState?.user) return
      const formData = new FormData()
      formData.append('file', {
        uri: updateImage,
        name: 'profile.jpeg',
        type: 'image/jpeg',
      } as any)
      setUpdateImage(null)
      setIsLoading(true)

      updateImageUser(authState.user.id, formData, null)
        .then(() => {
          setUserAlert({type:'success' , message:'Imagem atualizada com sucesso!'})
          fetchUser && fetchUser()
        })
        .catch((error) => {
          setUserAlert({type:'error',message: 'Erro ao atualizar imagem: ' + error.message})
        })
        .finally(() => {
          setIsLoading(false)
        })
  } , [updateImage])

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Desculpe, precisamos de permissão para acessar!')
        return
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
  
      if (!result.canceled && result.assets[0].uri) {
        setUpdateImage(result.assets[0].uri)
        
      }
    } catch (error) {
      console.error("Error picking image:", error)
    }
  }


  // const toggleEdit = () => {
  //   setIsEditing(!isEditing)
  //   setShowMoreInfo(!showMoreInfo)
  // }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
      className={`${theme==='light'?'bg-white':'bg-secondary_black'}`}
      scrollEventThrottle={16} 
      contentContainerStyle={{ paddingBottom: 107 }}
      >
      <View className='bg-primary_green flex-row justify-end items-center px-[20px]'>
        <TouchableOpacity 
          className='flex items-center justify-center h-[50px] w-[50px]' onPress={()=>router.push('settings')}>
          <Ionicons name='settings' size={30} color={theme==='light'?'#555':'black'}/>
        </TouchableOpacity>
      </View>
        <View style={{...CustomProfile.profileCard, backgroundColor: theme==='light'?'white':'#1f2937', shadowColor: '#000'}}>


          {isLoading && <LoadingActivity></LoadingActivity>}

          <View style={{ ...CustomProfile.topSection, backgroundColor: '#C3FF00'  }} className='p-safe' >
            <View style={CustomProfile.imageContainer}>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} />

              <View className={`w-[350px] h-[350px] rounded-[350px] border-[3px] mr-[10px] items-center ${theme === 'dark' ? 'bg-[#1f2937] border-[black] ' : 'bg-white border-[white]'}`}>
           
                {authState?.user?.s3Url && !updateImage  ?
                (<Image style={CustomProfile.profileImage} source={{uri: authState.user.s3Url , cache: 'reload'}} />)
                :
                (<Text className={`text-[245px] ${theme==='light'?'text-black':'text-white'}`}>
                  {authState?.user?.nome && authState.user.nome[0].toUpperCase()}
                </Text>)}
            

                <TouchableOpacity style={{...CustomProfile.editButton, backgroundColor : '#C3FF00', borderColor: theme==='light'?'white':'black'}} 
                  onPress={()=>
                      Alert.alert(
                          "Imagem de perfil",
                          "Você quer alterar imagem do perfil?",
                          [
                              { text: "Alterar", onPress:pickImage },
                              { text: "Cancelar", style: "cancel" },
                          ]
                      )
                    } >
                 <Ionicons name="pencil" size={16} style={{marginLeft: 2, color: '#1f2937' }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
            

          <View style={CustomProfile.bottomSection}>
            
              <Text style={{...CustomProfile.name}}>{authState?.user?.nome}</Text>
              <Text className={`text-[14px] ${theme==='light'?'text-secondary_black_sub_title':'text-white'} mb-[5px] mt-[5px]`}>@{authState?.user?.nomeUsuario}</Text>
           
            
              <View className="flex-row items-center justify-between mr-[10px]">
                {authState?.user?.nivelHabilidade &&
                  <View className='flex-row my-1 gap-x-1'>
                    <Text className={`text-[14px] ${theme==='light'?'text-secondary_black_sub_title':'text-white'} mr-2`}>
                      Nível {authState.user.nivelHabilidade.nome}
                    </Text>
                    
                      {Array.from({ length: 4 }).map((_, i) => (
                            <Ionicons key={i} name="star" size={13} color={i < (authState?.user?.nivelHabilidade.id || 3) ? '#FFD700' : '#ddd'} />
                        ))}

                  </View>}   
              </View>
            {authState && <Text className={`text-[14px] ${theme==='light'?'text-secondary_black_sub_title':'text-white'} mb-[5px]`}>Data de Criação: {authState.user?.dtCriacao.split(' ')[0]}</Text>}

          </View>


          {/* <View style={CustomProfile.iconSection}>
            <TouchableOpacity
              style={{ ...CustomProfile.iconButton, backgroundColor: '#C3FF00' }}
              onPress={toggleEdit}
            >
               <Ionicons name={`chevron-${isEditing ? 'up': 'down'}`} size={24} color="#555" />
            </TouchableOpacity>
          </View> */}

          
          {userAlert && (
          <ShowAlert
            type={userAlert.type}
            message={userAlert.message}
            onClose={() => setUserAlert(null)}
          />)}

        </View>
      </ScrollView>
    </SafeAreaView>
  )

}


