import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomProfile from '../../css/CustomProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthProvider } from '../context/AuthProvider';
import { router } from 'expo-router';
import { ListNivelHabilidade, NivelHabilidade, RequestUpdateUsuario } from '../../types';
import { updateImageUser, updateUser } from '../../api/usuario';
import LoadingActivity from '../../components/LoadingActivity';
import FormFieldDropdownSelectList from '../../components/FormFieldDropdownSelectList';
import { getNivelHabilidade } from '../../api/nivel-habilidade';
import CustomButton from '../../components/CustomButton';
import ShowAlert from '../../components/ShowAlert';



const Profile = () => {
  const { onLogout, authState } = useAuthProvider()

  const [scrollY, setScrolly] = useState<number>(0)

  const [updateImage, setUpdateImage] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)


  const [errorMessage, setErrorMessage] = useState<string|null>(null)
  const [successMessage, setSuccessMessage] = useState<string|null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  
  const [listNivelHabilidade, setListNivelHabilidade] = useState<ListNivelHabilidade[]>([]);
  const [nivelHabilidadeError, setNivelHabilidadeError] = useState('');



  const [userToUpdate, setUserToUpdate] = useState<RequestUpdateUsuario>({ id: 0, nome: '', nomeUsuario: '', endereco: { cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: 0 }, email: '', nivelHabilidade: { id: 0, nome: '', descricao: ''} })

  useEffect(()=>{
    scrollY > 50 ? 
      router.setParams({tabBarVisible: 'no'})
    :
      router.setParams({tabBarVisible: 'yes'})
  },[scrollY])


  useEffect(() => {
    if (authState?.user) {
      if (authState.user) {
          setUserToUpdate(authState.user)
      }
    }  
  }, [authState])


  useEffect(() => {
    if(!updateImage ) return
    if(!authState?.id ) return
      const formData = new FormData()
      formData.append('file', {
        uri: updateImage,
        name: 'profile.jpeg',
        type: 'image/jpeg',
      } as any)
      setIsLoading(true)

      updateImageUser(authState.id, formData, null)
        .then(() => {
          setSuccessMessage('Imagem atualizada com sucesso!')
        })
        .catch((error) => {
          setErrorMessage('Erro ao atualizar imagem: ' + error.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
        setUpdateImage(null)
  } , [updateImage])


  


  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Desculpe, precisamos de permissão para acessar!')
        return;
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

  const toggleEdit = () => {
    if(!isEditing) {
      getNivelHabilidade()
         .then((response) => {
           const nivels: ListNivelHabilidade[] = response.map(nivel => ({
             nome: nivel.nome,
             id: nivel.id,
             value: nivel,
           }));
           setListNivelHabilidade(nivels)
         })
         .catch((response) => {
           setNivelHabilidadeError('Erro ao carregar níveis de habilidade: ' + response.message)
         })
    }

    setIsEditing(!isEditing);
    setShowMoreInfo(!showMoreInfo);
  };



  const handleLogout = () => {
    if (onLogout) {
      onLogout()
        .then((response) => {
          setSuccessMessage(response)
        })
        .catch((error) => {
          setErrorMessage(error)
        });
      router.replace('sign-in')
    }
  };

  
  const updateCampoUsuarioHabilidade = (nivel : NivelHabilidade) => {
    setUserToUpdate(prev => ({
      ...prev,
      nivelHabilidade: nivel
    }))
  }


  const updateCampoUsuarioEndereco = (campo: string, valor: string | number) => {
    setUserToUpdate(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor
      }
    }))
  }
  const updateCampoUsuario = (campo: string, valor: string | number) => {
    setUserToUpdate(prev => ({
      ...prev,
        [campo]: valor
      
    }))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView 
      scrollEventThrottle={16} 
      contentContainerStyle={{ paddingBottom: 107 }}
      onScroll={e=>setScrolly(e.nativeEvent.contentOffset.y)}
      >
      
        <View style={{...CustomProfile.profileCard, backgroundColor: 'white', shadowColor: '#000'}}>


          {isLoading && <LoadingActivity></LoadingActivity>}

          <View style={{ ...CustomProfile.topSection, backgroundColor: '#C3FF00'  }} >
            <View style={CustomProfile.imageContainer}>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} />

               {/* <Image source={image} style={CustomProfile.profileImage}  resizeMode="cover"  />
              <TouchableOpacity style={CustomProfile.editButton} onPress={pickImage}>
                <Ionicons name="pencil" size={16} color="#1f2937" />
              </TouchableOpacity>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} /> */}
              <View className='w-[350px] h-[350px] rounded-[350px] border-[3px] border-[white] bg-[white] mr-[10px] items-center'>

           
            {authState?.user?.s3Url ? 
                (<Image style={CustomProfile.profileImage} src={authState.user.s3Url} />)
                :
                (<Text className='text-[245px]'>
                  {authState?.user?.nome && authState.user.nome[0].toUpperCase()}
                </Text>)}
            

                {isEditing && <TouchableOpacity style={{...CustomProfile.editButton, backgroundColor : '#C3FF00'}} onPress={pickImage} >
                 <Ionicons name="pencil" size={16} style={{marginLeft: 2, color: '#1f2937' }} />
                </TouchableOpacity>}
              </View>
            </View>
          </View>
            

          <View style={CustomProfile.bottomSection}>
            {isEditing ? (
              <>
                <Text className='text-[16px] text-black mb-[5px]'>Nome</Text>
                {authState?.user?.nome && <TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.nome}
                  onChangeText={text => updateCampoUsuario('nome', text)} 
                />}
                {authState?.user?.nomeUsuario && <TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.nomeUsuario}
                  onChangeText={text => updateCampoUsuario('nomeUsuario', text)}
                />}

                <Text className='text-[16px] text-matte_gray mb-[5px]'>Endereço</Text>
                {authState?.user?.endereco?.cep && <TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.endereco.cep}
                  onChangeText={text => updateCampoUsuarioEndereco('cep', parseInt(text))}
                />}
                {authState?.user?.endereco?.rua &&<TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.endereco.rua}
                  onChangeText={text => updateCampoUsuarioEndereco('rua', text)}
                />}
                {authState?.user?.endereco?.cidade && <TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.endereco.cidade}
                  onChangeText={text => updateCampoUsuarioEndereco('cidade', text)}
                />}
                {authState?.user?.endereco?.bairro && <TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.endereco.bairro}
                  onChangeText={text => updateCampoUsuarioEndereco('bairro', text)}
                />}
                {authState?.user?.endereco?.estado && <TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.endereco.estado}
                  onChangeText={text => updateCampoUsuarioEndereco('estado', text)}
                />}
                {authState?.user?.endereco?.numero && <TextInput
                  style={CustomProfile.input}
                  value={String(userToUpdate.endereco.numero)}
                  onChangeText={(text) => updateCampoUsuarioEndereco("numero",Number(text.replace(/\D/g, '')))} // Ensure only numbers are set
                />}

                <Text className='text-[16px] text-matte_gray mb-[5px]'>Email</Text>
                {authState?.user?.email && <TextInput
                  style={CustomProfile.input}
                  value={userToUpdate.email}
                  onChangeText={text => updateCampoUsuario('email', text)}
                  editable={false}
                  />}


                  {authState?.user?.nivelHabilidade && 
                    <FormFieldDropdownSelectList
                      title="Nível de Habilidade"
                      selectedValue={userToUpdate.nivelHabilidade}
                      options={listNivelHabilidade}
                      handleChange={(nivel: NivelHabilidade) => {
                        updateCampoUsuarioHabilidade(nivel)
                      }}
                      msg={nivelHabilidadeError}
                    />
                  }
               
              </>
            ) : (
              <>
                <Text style={{...CustomProfile.name}}>{authState?.user?.nome}</Text>
                <Text className='text-[14px] text-secondary_black_sub_title mb-[5px] mt-[5px]'>@{authState?.user?.nomeUsuario}</Text>
              </>
            )}
           
            
              <View className="flex-row items-center justify-around">
              {authState?.user?.nivelHabilidade &&
                <View className='flex-row my-1 gap-x-1'>
                <Text className="text-[14px] text-secondary_black_sub_title mr-2">
                  Nível {authState.user.nivelHabilidade.nome}
                </Text>
                
                   {Array.from({ length: 5 }).map((_, i) => (
                        <Ionicons key={i} name="star" size={13} color={i < (authState?.user?.nivelHabilidade.id || 3) ? '#FFD700' : '#ddd'} />
                    ))}

              </View>}

                {isEditing ? (
                  <TouchableOpacity
                  style={CustomProfile.button2}
                  className='bg-primary_green p-[15px] rounded-[5px] '
                  onPress={toggleEdit}
                  >
                  <Text className='text-black text-[14px] font-bold'>Salvar</Text>
                </TouchableOpacity>)
                :
                (
                  <TouchableOpacity 
                  style={CustomProfile.button2}  
                  className='bg-primary_green p-[15px] rounded-[5px]' 
                  onPress={handleLogout}
                  >
                      <Text className='text-black text-[14px] font-bold'>Sair</Text>
                  </TouchableOpacity>
                )}
              </View>
            
           
            {authState && <Text className='text-[14px] text-secondary_black_sub_title mb-[5px]'>Data de Criação: {authState.user?.dtCriacao.split(' ')[0]}</Text>}

          </View>


          <View style={CustomProfile.iconSection}>
            <TouchableOpacity
              style={{ ...CustomProfile.iconButton, backgroundColor: '#C3FF00' }}
              onPress={toggleEdit}
            >
               <Ionicons name={`chevron-${isEditing ? 'up': 'down'}`} size={24} color="white" />
            </TouchableOpacity>
          </View>

          {errorMessage && (
          <ShowAlert
            type='error'
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />)}
        {successMessage && (
          <ShowAlert
            type='success'
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />)}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;


