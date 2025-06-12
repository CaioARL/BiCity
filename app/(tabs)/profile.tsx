import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import CustomProfile from '../../css/CustomProfile'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthProvider } from '../context/AuthProvider'
import { router } from 'expo-router'
import { ListNivelHabilidade, NivelHabilidade, RequestUpdateUsuario, RequestUpdateUsuarioError } from '../../types'
import { updateImageUser, updateUser } from '../../api/usuario'
import LoadingActivity from '../../components/LoadingActivity'
import FormFieldDropdownSelectList from '../../components/FormFieldDropdownSelectList'
import ShowAlert from '../../components/ShowAlert'
import { updateUsuario } from 'util/validationSchemas'
import SimpleTextInput from 'components/SimpleTextInput'
import { getHabilidades } from 'storage/nivel-habilidade'


export default function Profile(){
  const { onLogout, authState, fetchUser } = useAuthProvider()

  const [updateImage, setUpdateImage] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)


  const [errorMessage, setErrorMessage] = useState<string|null>(null)
  const [successMessage, setSuccessMessage] = useState<string|null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  
  const [listNivelHabilidade, setListNivelHabilidade] = useState<ListNivelHabilidade[]>([])
  const [nivelHabilidadeError, setNivelHabilidadeError] = useState('')


  const [requestUpdateUsuario, setRequestUpdateUsuario] = useState<RequestUpdateUsuario | null>(null)
  const [updateUsuarioError, setUpdateUsuarioError] = useState<RequestUpdateUsuarioError>({ nome: '', nomeUsuario: '', cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: '', email: '', nivelHabilidade: '',}) 
  const [usuario, setUsuario] = useState<RequestUpdateUsuario>({ id: 0, nome: '', nomeUsuario: '', endereco: { cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: 0 }, email: '', nivelHabilidade: { id: 0, nome: '', descricao: ''} })

  const validateAndUpdateUsuario = () => {
    toggleEdit()
    setUpdateUsuarioError({nome: '', nomeUsuario: '', cep: '',estado: '',cidade: '',bairro: '',rua: '',numero: '',email: '',nivelHabilidade: '',})
    
    const validationResult = updateUsuario.safeParse(usuario) 
    if(!validationResult.success){
      validationResult.error.issues.forEach((issue) => {
        setUpdateUsuarioError((prev) => ({
          ...prev,
          [issue.path[0]]: issue.message,
        }))
        if(issue.path[0] === 'endereco'){
          setUpdateUsuarioError((prev) => ({
            ...prev,
              [issue.path[1]]: issue.message,
          }))
        }
      })
      setErrorMessage('Preencha todos os campos corretamente')
      return
    }

    if(authState?.user === usuario ) return setErrorMessage('Nada mudou')

    setRequestUpdateUsuario(usuario)
  }

  useEffect(()=>{
    isEditing ? 
      router.setParams({tabBarVisible: 'no'})
    :
      router.setParams({tabBarVisible: 'yes'})
  },[isEditing])

  useEffect(() => {
    if (authState?.user) {
      if (authState.user) {
          setUsuario(authState.user)
      }
    }  
  }, [authState])

  useEffect(()=>{
    if(!requestUpdateUsuario) return
    setIsLoading(true)
    updateUser(requestUpdateUsuario, null)
    .then(()=>{
      setSuccessMessage("Atualizado")
      fetchUser && fetchUser()
    })
    .catch(()=>{
      setErrorMessage("Algo deu errado")
    })
    .finally(()=>{
      setIsLoading(false)
    })
    setRequestUpdateUsuario(null)
  },[requestUpdateUsuario])

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
          setSuccessMessage('Imagem atualizada com sucesso!')
          fetchUser && fetchUser()
        })
        .catch((error) => {
          setErrorMessage('Erro ao atualizar imagem: ' + error.message)
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

  useEffect(() => {
    getHabilidades()
    .then((response) => {
      if(!response) return
      const niveis: ListNivelHabilidade[] = response.map(nivel => ({
        nome: nivel.nome,
        id: nivel.id,
        value: nivel,
      }))
      setListNivelHabilidade(niveis)
    })
    .catch((error) => {
      setNivelHabilidadeError('Erro ao carregar níveis de habilidade: ' + error.message)
    })
  },[])

  const toggleEdit = () => {
    setIsEditing(!isEditing)
    setShowMoreInfo(!showMoreInfo)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
        .then((response) => {
          // setSuccessMessage(response)
          router.replace('sign-in')
        })
        .catch((error) => {
          setErrorMessage(error)
        });
    }
  }

  const updateCampoUsuarioError = (campo: string, valor: string) => {
    setUpdateUsuarioError((prev)=>({
      ...prev,
      [campo]: valor
    }))
  }
  
  const updateCampoUsuarioHabilidade = (nivel : NivelHabilidade) => {
    setUsuario(prev => ({
      ...prev,
      nivelHabilidade: nivel
    }))
  }


  const updateCampoUsuarioEndereco = (campo: string, valor: string | number) => {
    setUsuario(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor
      }
    }))
  }
  const updateCampoUsuario = (campo: string, valor: string | number) => {
    setUsuario(prev => ({
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
                {authState?.user?.nome && <SimpleTextInput
                  errorMessage={updateUsuarioError.nome}
                  value={usuario.nome}
                  onFocus={()=>updateCampoUsuarioError('nome','')}
                  handleChange={text => updateCampoUsuario('nome', text)} 
                />}

                {authState?.user?.nomeUsuario && <SimpleTextInput
                  errorMessage={updateUsuarioError.nomeUsuario}
                  value={usuario.nomeUsuario}
                  onFocus={()=>updateCampoUsuarioError('nomeUsuario','')}
                  handleChange={text => updateCampoUsuario('nomeUsuario', text)}
                />}

                <Text className='text-[16px] text-matte_gray mb-[5px]'>Endereço</Text>
                {authState?.user?.endereco?.cep && <SimpleTextInput
                  errorMessage={updateUsuarioError.cep}
                  value={usuario.endereco.cep}
                  type={'number-pad'}
                  max={8}
                  onFocus={()=>updateCampoUsuarioError('cep','')}
                  handleChange={text => updateCampoUsuarioEndereco('cep', text)}
                />}
                {authState?.user?.endereco?.rua &&<SimpleTextInput
                  errorMessage={updateUsuarioError.rua}
                  value={usuario.endereco.rua}
                  onFocus={()=>updateCampoUsuarioError('rua','')}
                  handleChange={text => updateCampoUsuarioEndereco('rua', text)}
                />}
                {authState?.user?.endereco?.cidade && <SimpleTextInput
                  errorMessage={updateUsuarioError.cidade}
                  value={usuario.endereco.cidade}
                  onFocus={()=>updateCampoUsuarioError('cidade','')}
                  handleChange={text => updateCampoUsuarioEndereco('cidade', text)}
                />}
                {authState?.user?.endereco?.bairro && <SimpleTextInput
                  errorMessage={updateUsuarioError.bairro}
                  value={usuario.endereco.bairro}
                  onFocus={()=>updateCampoUsuarioError('bairro','')}
                  handleChange={text => updateCampoUsuarioEndereco('bairro', text)}
                />}
                {authState?.user?.endereco?.estado && <SimpleTextInput
                  errorMessage={updateUsuarioError.estado}
                  value={usuario.endereco.estado}
                  onFocus={()=>updateCampoUsuarioError('estado','')}
                  handleChange={text => updateCampoUsuarioEndereco('estado', text)}
                />}
                {authState?.user?.endereco?.numero && <SimpleTextInput
                  errorMessage={updateUsuarioError.numero}
                  value={String(usuario.endereco.numero)}
                  onFocus={()=>updateCampoUsuarioError('numero','')}
                  handleChange={(text) => updateCampoUsuarioEndereco("numero",Number(text.replace(/\D/g, '')))} // Ensure only numbers are set
                />}

                <Text className='text-[16px] text-matte_gray mb-[5px]'>Email</Text>
                {authState?.user?.email && <SimpleTextInput
                  errorMessage={updateUsuarioError.email}
                  value={usuario.email}
                  onFocus={()=>updateCampoUsuarioError('email','')}
                  handleChange={text => updateCampoUsuario('email', text)}
                  editable={false}
                  />}


                  {authState?.user?.nivelHabilidade && 
                    <FormFieldDropdownSelectList
                      title="Nível de Habilidade"
                      selectedValue={usuario.nivelHabilidade}
                      options={listNivelHabilidade}
                      handleChange={(nivel: NivelHabilidade) => {
                        updateCampoUsuarioHabilidade(nivel)
                      }}
                      msg={nivelHabilidadeError || updateUsuarioError.nivelHabilidade}
                    />
                  }
               
              </>
            ) : (
              <>
                <Text style={{...CustomProfile.name}}>{authState?.user?.nome}</Text>
                <Text className='text-[14px] text-secondary_black_sub_title mb-[5px] mt-[5px]'>@{authState?.user?.nomeUsuario}</Text>
              </>
            )}
           
            
              <View className="flex-row items-center justify-between mr-[10px]">
              {authState?.user?.nivelHabilidade &&
                <View className='flex-row my-1 gap-x-1'>
                <Text className="text-[14px] text-secondary_black_sub_title mr-2">
                  Nível {authState.user.nivelHabilidade.nome}
                </Text>
                
                   {Array.from({ length: 4 }).map((_, i) => (
                        <Ionicons key={i} name="star" size={13} color={i < (authState?.user?.nivelHabilidade.id || 3) ? '#FFD700' : '#ddd'} />
                    ))}

              </View>}

                {isEditing ? (
                    <TouchableOpacity
                    style={CustomProfile.button2}
                    className='bg-primary_green p-[15px] rounded-[5px] '
                    onPress={validateAndUpdateUsuario}
                    >
                    <Text className='text-black text-[14px] font-bold'>Salvar</Text>
                    </TouchableOpacity>
                )
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
               <Ionicons name={`chevron-${isEditing ? 'up': 'down'}`} size={24} color="#555" />
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
  )

}


