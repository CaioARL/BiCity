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
  const { onLogout, authState, fetchUser } = useAuthProvider()

  const [image, setImage] = useState<string | null>()
  // const profileImg = useImage(  authState?.user?.s3Url , {
  //     maxWidth: 800,
  //     onError(error, retry) {
  //       console.log(authState?.user?.s3Url)
  //       console.error('Loading failed:', error.message);
  //     }}
  // )


  const [errorMessage, setErrorMessage] = useState<string|null>(null)
  const [successMessage, setSuccessMessage] = useState<string|null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  
  const [listNivelHabilidade, setListNivelHabilidade] = useState<ListNivelHabilidade[]>([]);
  const [nivelHabilidadeError, setNivelHabilidadeError] = useState('');



  const [userToUpdate, setUserToUpdate] = useState<RequestUpdateUsuario>({
    nome: '',
    nomeUsuario: '',
    endereco: {
      cep: '',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: 0
    },
    email: '',
    nivelHabilidade: {
      id: 0,
      nome: '',
      descricao: ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  
  
  
  const [lastScrollY, setLastScrollY] = useState(0)


  const abortControllerRef = useRef(new AbortController())


  useEffect(() => {
    if (authState?.user) {
      if (authState.user) {
          setUserToUpdate(authState.user)
          if (authState.user.s3Url) {
            setImage(authState.user.s3Url)
          }
      }
    }  
  }, [authState])




  const update = () => {
    if (!userToUpdate) return
    if (!authState) return
    if (!authState.id) return
    if (!fetchUser) return

    console.log('userToUpdate', userToUpdate);
    

    setIsLoading(true)
    abortControllerRef?.current.abort()
    abortControllerRef.current = new AbortController()
    updateUser(authState.id, userToUpdate, abortControllerRef.current)
      .then((response) => {
        fetchUser()
        setSuccessMessage('Usuário atualizado com sucesso!')
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar usuário: ' + error.message)
      })
      .finally(() => {
        setIsLoading(false)
        setIsEditing(false)
      })
      
      if (image) {
        const formData = new FormData()
        formData.append('file', {
          uri: image,
          name: authState.id+'profile.jpeg',
          type: 'image/jpeg',
        } as any)
        setIsLoading(true)

        updateImageUser(authState.id, formData, null)
          .then((response) => {
            setImage(null)
            setSuccessMessage('Imagem atualizada com sucesso!')
          })
          .catch((error) => {
            setErrorMessage('Erro ao atualizar imagem: ' + error.message)
          })
          .finally(() => {
            setIsLoading(false)
          })
      }

  
  }


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
        setImage(result.assets[0].uri)
        
      }
    } catch (error) {
      console.error("Error picking image:", error)
    }
  };

  const toggleEdit = () => {
    if(!isEditing) {
      getNivelHabilidade()
         .then((response) => {
           const niveles: ListNivelHabilidade[] = response.map(nivel => ({
             nome: nivel.nome,
             id: nivel.id,
             value: nivel,
           }));
           setListNivelHabilidade(niveles);
         })
         .catch((response) => {
           setNivelHabilidadeError('Erro ao carregar níveis de habilidade: ' + response.message);
         });
    }

    setIsEditing(!isEditing);
    setShowMoreInfo(!showMoreInfo);
  };



  const handleLogout = () => {
    if (onLogout) {
      onLogout()
        .then((response) => {
          setSuccessMessage(response);
        })
        .catch((error) => {
          setErrorMessage(error);
        });
      router.replace('sign-in');
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

            {image ? 
                (<Image style={CustomProfile.profileImage} src={image} />)
            :
            authState?.user?.s3Url ? 
                (<Image style={CustomProfile.profileImage} src={authState.user.s3Url} />)
                :
                (<Text className='text-[245px]'>
                  {authState?.user?.nome && authState.user.nome[0].toUpperCase()}
                </Text>)
            }

                {isEditing && <TouchableOpacity style={{...CustomProfile.editButton, backgroundColor : '#C3FF00'}} onPress={pickImage} >
                 <Ionicons name="pencil" size={16} style={{marginLeft: 2, color: '#1f2937' }} />
                </TouchableOpacity>}
              </View>
            </View>
          </View>
            

          <View style={CustomProfile.bottomSection}>
            {isEditing ? (
              <>
                <Text className='text-[16px] text-matte_gray mb-[5px]'>Nome</Text>
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
                      title="Nível de habilidade"
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
           
            {authState?.user?.nivelHabilidade && (
              <View className="flex-row items-center">
                <Text className="text-[14px] text-secondary_black_sub_title mr-2">
                  Nível {authState.user.nivelHabilidade.nome}
                </Text>
                {(() => {
                  const nivel = authState.user.nivelHabilidade.nome.toLowerCase();
                  let starConfig = [];

                  switch (nivel) {
                    case 'iniciante':
                      starConfig = [
                        { type: 'star', active: true },
                        { type: 'star-outline', active: false },
                        { type: 'star-outline', active: false },
                        { type: 'star-outline', active: false },
                      ];
                      break;
                    case 'intermediario':
                      starConfig = [
                        { type: 'star', active: true },
                        { type: 'star-half-outline', active: true },
                        { type: 'star-outline', active: false },
                        { type: 'star-outline', active: false },
                      ];
                      break;
                    case 'avancado':
                      starConfig = [
                        { type: 'star', active: true },
                        { type: 'star', active: true },
                        { type: 'star-half-outline', active: true },
                        { type: 'star-outline', active: false },
                      ];
                      break;
                    case 'profissional':
                      starConfig = [
                        { type: 'star', active: true },
                        { type: 'star', active: true },
                        { type: 'star', active: true },
                        { type: 'star', active: true },
                      ];
                      break;
                    default:
                      starConfig = [
                        { type: 'star-outline', active: false },
                        { type: 'star-outline', active: false },
                        { type: 'star-outline', active: false },
                        { type: 'star-outline', active: false },
                      ];
                  }

                  return starConfig.map(({ type, active }, index) => {
                    const color = active ? '#FFD700' : '#ddd'; 
                    return (
                      <Ionicons
                        key={index}
                        name={
                          type === 'star'
                            ? 'star'
                            : type === 'star-half-outline'
                            ? 'star-half-outline'
                            : 'star-outline'
                        }
                        size={13} 
                        color={color}
                        style={{ marginLeft: index > 0 ? 4 : 0 }}
                      />
                    );
                  });
                })()}
                {isEditing && 
                <TouchableOpacity
                    style={{ ...CustomProfile.button2, backgroundColor: '#C3FF00' }}
                    onPress={toggleEdit}
                    >
                  <Text style={{ fontWeight: 'bold' }}>Salvar</Text>
                </TouchableOpacity>}
              </View>
            )}
           
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

          {!isEditing && 
          <TouchableOpacity style={CustomProfile.button} onPress={handleLogout}>
            <Text style={{ fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>}

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



