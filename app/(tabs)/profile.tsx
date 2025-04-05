import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomProfile from '../../css/CustomProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthProvider } from '../context/AuthProvider';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeProvider';
import tailwindConfig from '../../tailwind.config';
import { useTabBar } from '../context/TabBarContext'; 
import { withSpring } from 'react-native-reanimated';
import { ListNivelHabilidade, NivelHabilidade, RequestUpdateUsuario } from '../../types';
import { updateImageUser, updateUser } from '../../api/usuario';
import LoadingActivity from '../../components/LoadingActivity';
import FormFieldSelectList from '../../components/FormFieldSelectList';
import { getNivelHabilidade } from '../../api/nivel-habilidade';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;


const Profile = () => {
  const { theme } = useTheme()
  const { onLogout, authState, fetchUser } = useAuthProvider()
  const { tabBarOffset } = useTabBar()

  const [image, setImage] = useState<string | null>()
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
        alert('Usuário atualizado com sucesso!')
      })
      .catch((error) => {
        alert('Erro ao atualizar usuário: ' + error.message)
      })
      .finally(() => {
        setIsLoading(false)
        setIsEditing(false)
      })
      
      if (image) {
        const formData = new FormData()
        formData.append('file', {
          uri: image,
          name: authState.id+'profile.jpg',
          type: 'image/jpeg',
        } as any)
        abortControllerRef?.current.abort()
        abortControllerRef.current = new AbortController()
        setIsLoading(true)

        updateImageUser(authState.id, formData, abortControllerRef.current)
          .then((response) => {
            setImage(null)
            alert('Imagem atualizada com sucesso!')
          })
          .catch((error) => {
            alert('Erro ao atualizar imagem: ' + error.message)
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
          alert(response);
        })
        .catch((error) => {
          alert(error);
        });
      router.replace('sign-in');
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY > lastScrollY && currentScrollY > 0) {
      tabBarOffset.value = withSpring(30, { damping: 20, stiffness: 100 });
    } else if (currentScrollY < lastScrollY) {
      tabBarOffset.value = withSpring(0, { damping: 20, stiffness: 100 });
    }
    setLastScrollY(currentScrollY);
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
    <SafeAreaView
      style={{
        backgroundColor: theme === 'dark' ? colors.secondary_black || '#1f2937' : colors.white || '#FFF',
        flex: 1,
      }}
    >
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 107 }}>
        
      {authState?.user?.s3Url && (
        <>
          <Image className='w-[150] h-[150]' source={{ uri: authState.user.s3Url }} />
          <Text>authState.user.s3Url: {authState.user.s3Url} </Text>
        </>
      )
    } 
        
        <View
          style={{
            ...CustomProfile.profileCard,
            backgroundColor: theme === 'dark' ? colors.secondary_black || '#1f2937' : colors.white || '#FFF',
            shadowColor: theme === 'dark' ? '#FFF' : '#000',
          }}
        >


          {isLoading && <LoadingActivity></LoadingActivity>}

          <View
            style={{
              ...CustomProfile.topSection,
              backgroundColor: theme === 'dark' ? colors.primary_green : colors.primary_green
            }}
          >
            <View style={CustomProfile.imageContainer}>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} />

               {/* <Image source={image} style={CustomProfile.profileImage}  resizeMode="cover"  />
              <TouchableOpacity style={CustomProfile.editButton} onPress={pickImage}>
                <Ionicons name="pencil" size={16} color="#1f2937" />
              </TouchableOpacity>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} /> */}
              <View
                className={`w-[350px] h-[350px] rounded-[350px] border-[3px] border-white items-center shadow-md ${
                  theme === 'dark' ? 'bg-[#1f2937]' : 'bg-white'
                }`}
              >
            {image? 
              (<Image style={CustomProfile.profileImage} source={{ uri: image }} />)
              :
              (authState?.user?.s3Url ? 
              // <Image style={CustomProfile.profileImage} source={{ uri: process.env.EXPO_PUBLIC_AWS_S3_URL + authState.user.s3Key }} /> 
              <Image style={CustomProfile.profileImage} source={{ uri: authState.user.s3Url }} /> 
                : 
              <Text className={`text-[250px] ${theme === 'dark' ? 'color-white' : 'color-secondary_black'}`}>
                {authState?.user?.nome && authState.user.nome[0].toUpperCase()}
              </Text>)
            }

                <TouchableOpacity style={{...CustomProfile.editButton, backgroundColor: theme === 'dark' ?  colors.secondary_black : colors.primary_green }} onPress={pickImage} >
                 <Ionicons name="pencil" size={16} style={{marginLeft: 2, color: theme === 'dark' ? 'white' : 'secondary_black' }}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
            

          <View style={CustomProfile.bottomSection}>
            {isEditing ? (
              <>
                {authState?.user?.nome && <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={userToUpdate.nome}
                  onChangeText={text => updateCampoUsuario('nome', text)} 
                />}
                {authState?.user?.nomeUsuario && <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={userToUpdate.nomeUsuario}
                  onChangeText={text => updateCampoUsuario('nomeUsuario', text)}
                />}
                {authState?.user?.endereco?.cep && <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={userToUpdate.endereco.cep}
                  onChangeText={text => updateCampoUsuarioEndereco('cep', parseInt(text))}
                />}
                {authState?.user?.endereco?.rua &&<TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={userToUpdate.endereco.rua}
                  onChangeText={text => updateCampoUsuarioEndereco('rua', text)}
                />}
                {authState?.user?.endereco?.cidade && <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={userToUpdate.endereco.cidade}
                  onChangeText={text => updateCampoUsuarioEndereco('cidade', text)}
                />}
                {authState?.user?.endereco?.bairro && <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={userToUpdate.endereco.bairro}
                  onChangeText={text => updateCampoUsuarioEndereco('bairro', text)}
                />}
                {authState?.user?.endereco?.estado && <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={userToUpdate.endereco.estado}
                  onChangeText={text => updateCampoUsuarioEndereco('estado', text)}
                />}
                {authState?.user?.endereco?.numero && <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={String(userToUpdate.endereco.numero)}
                  onChangeText={(text) => updateCampoUsuarioEndereco("numero",Number(text.replace(/\D/g, '')))} // Ensure only numbers are set
                />}
                {authState?.user?.email && <TextInput
                  style={{
                    ...CustomProfile.input,
                    opacity: 2,
                    backgroundColor: theme === 'dark' ? '#444' : '#f0f0f0',
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                    borderColor: theme === 'dark' ? '#666' : '#ccc',
                  }}
                  value={userToUpdate.email}
                  onChangeText={text => updateCampoUsuario('email', text)}
                  editable={false}
                  />}
                  {authState?.user?.nivelHabilidade && 
                    <FormFieldSelectList
                      title="Nível de habilidade"
                      selectedValue={userToUpdate.nivelHabilidade}
                      options={listNivelHabilidade}
                      handleChange={
                        (nivel: NivelHabilidade) => {
                          updateCampoUsuarioHabilidade(nivel)
                        }
                      }
                      msg={nivelHabilidadeError}
                      theme={theme}
                    />  
                  }
               
              </>
            ) : (
              <>
                <Text style={{...CustomProfile.name, color: theme === 'dark' ? colors.white : '' }}>{authState?.user?.nome}</Text>
                <Text style={CustomProfile.title}>@{authState?.user?.nomeUsuario}</Text>
              </>
            )}
            {authState && <Text style={CustomProfile.title}>Data de Criação: {authState.user?.dtCriacao}</Text>}

            <View style={CustomProfile.nivelHabilidadeContainer}>
              <Text style={CustomProfile.nivelHabilidade}>Nível</Text>
              <Ionicons name="star-half-outline" size={20} color="#ffcc00" style={{ marginTop: -5 }} />
            </View>
            {authState?.user?.nivelHabilidade && <View style={CustomProfile.nivelHabilidadeContainer}>
              <Text style={CustomProfile.nivelHabilidade}>{authState.user.nivelHabilidade.nome}</Text>
            </View>}
{/* 

            
            {showMoreInfo && (
              <View style={CustomProfile.informaçõesContainer}>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>Endereço: {endereco}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>E-mail: {email}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>CPF: {formatCPF(cpf)}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>CNPJ: {formatCNPJ(cnpj)}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>Data de Criação: {formattedDate}</Text>
              </View>
            )} */}
          </View>

          <View style={CustomProfile.iconSection}>
            <TouchableOpacity
              style={{
                ...CustomProfile.iconButton,
                backgroundColor: theme === 'dark' ? colors.primary_green : colors.primary_green,
              }}
              onPress={toggleEdit}
            >
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={CustomProfile.button} onPress={handleLogout}>
            <Text style={{ fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={CustomProfile.buttonSalve} onPress={update}>
              <Text style={{ fontWeight: 'bold' }}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;



