import { Text, Appearance, ScrollView, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultErrorResponse, ListNivelHabilidade, NivelHabilidade, RequestUpdateUsuario, RequestUpdateUsuarioError } from 'types'
import { useAuthProvider } from 'app/context/AuthProvider'
import SimpleTextInput from 'components/SimpleTextInput'
import FormFieldDropdownSelectList from 'components/FormFieldDropdownSelectList'
import { deleteUser, updateUser } from 'api/usuario'
import { updateUsuario } from 'util/validationSchemas'
import { getHabilidades } from 'storage'
import LoadingActivity from 'components/LoadingActivity'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import ShowAlert from 'components/ShowAlert'
import { AxiosError } from 'axios'

export default function Account() {
    const theme = Appearance.getColorScheme()
    const { authState , fetchUser, onLogout } = useAuthProvider()

    const [isLoading, setIsLoading] = useState(false)


    const [userAlert, setUserAlert] = useState<{type: 'error'|'loading'|'success', message: string} | null>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [showMoreInfo, setShowMoreInfo] = useState(false)
    
    const [listNivelHabilidade, setListNivelHabilidade] = useState<ListNivelHabilidade[]>([])
    const [nivelHabilidadeError, setNivelHabilidadeError] = useState('')


    const [requestUpdateUsuario, setRequestUpdateUsuario] = useState<RequestUpdateUsuario | null>(null)
    const [updateUsuarioError, setUpdateUsuarioError] = useState<RequestUpdateUsuarioError>({ nome: '', nomeUsuario: '', cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: '', email: '', nivelHabilidade: '',}) 
    const [usuario, setUsuario] = useState<RequestUpdateUsuario>({ id: 0, nome: '', nomeUsuario: '', endereco: { cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: 0 }, email: '', nivelHabilidade: { id: 0, nome: '', descricao: ''} })

    const validateAndUpdateUsuario = () => {
    setUpdateUsuarioError({nome: '', nomeUsuario: '', cep: '',estado: '',cidade: '',bairro: '',rua: '',numero: '',email: '',nivelHabilidade: ''})
    
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
        setUserAlert({ type:'error', message:'Preencha todos os campos corretamente'})
        return
    }

    if(authState?.user === usuario ) return setUserAlert({type:'error' ,message:'Nada mudou'})
        setRequestUpdateUsuario(usuario)
    }

    const handleDeleteUser = () => {
        setIsLoading(true)
        deleteUser()
        .then((response)=>{
            setUserAlert({type:'success', message: 'Conta deletada com sucesso !' + response})
            // console.log("RESPONSE DELETE "+ response)
            setTimeout(()=>{
                onLogout && onLogout()
                router.replace('/sign-in')
            },3000)
        })
        .catch((error:AxiosError<DefaultErrorResponse>)=>{
            setUserAlert({type:'error', message: 'Error ao deletar !' + error.response?.data.message || error.message })
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }

    useEffect(() => {
    if (authState?.user) {
        if (authState.user) {
            setUsuario(authState.user)
        }
    }  
    }, [authState])

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

    useEffect(()=>{
        if(!requestUpdateUsuario) return
        setIsLoading(true)
        updateUser(requestUpdateUsuario, null)
        .then(()=>{
            setUserAlert({type:'success', message:"Atualizado"})
            toggleEdit()
            fetchUser && fetchUser()
        })
        .catch(()=>{
            setUserAlert({type: 'error', message:"Algo deu errado"})
        })
        .finally(()=>{
            setIsLoading(false)
        })
        setRequestUpdateUsuario(null)
    },[requestUpdateUsuario])

      const toggleEdit = () => {
        setIsEditing(!isEditing)
        setShowMoreInfo(!showMoreInfo)
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
    <SafeAreaView>
        <TouchableOpacity
                style={{ position: 'absolute', top: 45, right: 20, borderRadius: '50%',  paddingHorizontal: 15,
                  paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 10,}} 
                  className={`${theme==='light'?'bg-primary_green':'bg-secondary_black'}`}
                  onPress={() => router.back()}
                >
            <Ionicons name='arrow-back' size={24} color={theme==='light'?'#555':'white'}/>
        </TouchableOpacity>
        <ScrollView className={`w-full h-full container ${theme==='light'?'bg-white':'bg-secondary_black'}`}>
        {isLoading && <LoadingActivity/>}
        <View className="my-safe-offset-4">
            <Text className={`text-xl font-bold ${theme==='light'?'text-black':'text-white'}`}>Configurações de conta</Text>
            <Text className={` ${theme==='light'?'text-matte_gray':'text-white'} `}>Gerencie informações da conta.</Text>
        </View>

        <View className={`${theme==='light'?'bg-white':'bg-matte_gray'} rounded-lg shadow p-4 mb-4`}>
            <Text className={`text-lg font-semibold mb-2 ${theme==='light'?'text-black':'text-white'}`}>Informações da Conta</Text>
            <Text className={`text-[16px] ${theme==='light'?'text-matte_gray':'text-white'} mb-[5px]`}>Nome</Text>
            {authState?.user?.nome && <SimpleTextInput
                errorMessage={updateUsuarioError.nome}
                value={usuario.nome}
                editable={isEditing}
                onFocus={()=>updateCampoUsuarioError('nome','')}
                handleChange={text => updateCampoUsuario('nome', text)} 
                />}
            
            <Text className={`text-[16px] ${theme==='light'?'text-matte_gray':'text-white'} mb-[5px]`}>Nome de usuário</Text>
            {authState?.user?.nomeUsuario && <SimpleTextInput
                errorMessage={updateUsuarioError.nomeUsuario}
                value={usuario.nomeUsuario}
                editable={false}
                onFocus={()=>updateCampoUsuarioError('nomeUsuario','')}
                handleChange={text => updateCampoUsuario('nomeUsuario', text)}
                />}

            <Text className={`text-[16px] ${theme==='light'?'text-matte_gray':'text-white'} mb-[5px]`}>Endereço</Text>
            {authState?.user?.endereco?.cep && <SimpleTextInput
                errorMessage={updateUsuarioError.cep}
                value={usuario.endereco.cep}
                type={'number-pad'}
                editable={isEditing}
                max={8}
                onFocus={()=>updateCampoUsuarioError('cep','')}
                handleChange={text => updateCampoUsuarioEndereco('cep', text)}
                />}
            {authState?.user?.endereco?.rua &&<SimpleTextInput
                errorMessage={updateUsuarioError.rua}
                value={usuario.endereco.rua}
                editable={isEditing}
                onFocus={()=>updateCampoUsuarioError('rua','')}
                handleChange={text => updateCampoUsuarioEndereco('rua', text)}
                />}
            {authState?.user?.endereco?.cidade && <SimpleTextInput
                errorMessage={updateUsuarioError.cidade}
                value={usuario.endereco.cidade}
                editable={isEditing}
                onFocus={()=>updateCampoUsuarioError('cidade','')}
                handleChange={text => updateCampoUsuarioEndereco('cidade', text)}
                />}
            {authState?.user?.endereco?.bairro && <SimpleTextInput
                errorMessage={updateUsuarioError.bairro}
                value={usuario.endereco.bairro}
                editable={isEditing}
                onFocus={()=>updateCampoUsuarioError('bairro','')}
                handleChange={text => updateCampoUsuarioEndereco('bairro', text)}
                />}
            {authState?.user?.endereco?.estado && <SimpleTextInput
                errorMessage={updateUsuarioError.estado}
                value={usuario.endereco.estado}
                editable={isEditing}
                onFocus={()=>updateCampoUsuarioError('estado','')}
                handleChange={text => updateCampoUsuarioEndereco('estado', text)}
                />}
            {authState?.user?.endereco?.numero && <SimpleTextInput
                errorMessage={updateUsuarioError.numero}
                value={String(usuario.endereco.numero)}
                editable={isEditing}
                onFocus={()=>updateCampoUsuarioError('numero','')}
                handleChange={(text) => updateCampoUsuarioEndereco("numero",Number(text.replace(/\D/g, '')))} // Ensure only numbers are set
                />}

            <Text className={`text-[16px] ${theme==='light'?'text-matte_gray':'text-white'} mb-[5px]`}>Email</Text>
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
                editable={isEditing}
                handleChange={(nivel: NivelHabilidade) => {
                updateCampoUsuarioHabilidade(nivel)
                }}
                msg={nivelHabilidadeError || updateUsuarioError.nivelHabilidade}
            />
            }
            <Text className={`text-lg font-semibold mb-2 ${theme==='light'?'text-black':'text-white'}`}>Edite informações</Text>
            <Text className={`mb-4 ${theme==='light'?'text-black':'text-white'}`}>
                Edite as informações da sua conta.
            </Text>
            <TouchableOpacity
                className="py-3 rounded-lg bg-primary_green"
                onPress={()=>{
                    isEditing?validateAndUpdateUsuario():toggleEdit()
                }}
            >
                <Text className={`text-center font-semibold text-black`}>{isEditing?'Salvar':'Editar conta'}</Text>
            </TouchableOpacity>
        </View>

        <View className={`rounded-lg shadow p-4 ${theme==='light'?'bg-white':'bg-matte_gray'} mb-safe-offset-4 `}>
            <Text className={`text-lg font-semibold mb-2 ${theme==='light'?'text-black':'text-white'}`}>Deletar Conta</Text>
            <Text className={`mb-4 ${theme==='light'?'text-black':'text-white'}`}>
                Deletar a conta permanentemente. Você irá perder e apagar todos os dados.
            </Text>
            <TouchableOpacity
                className="py-3 rounded-lg bg-color_red_error"
                onPress={()=>
                     Alert.alert(
                        "DELETAR A CONTA",
                        "Tem certeza que você quer deletar a contar? Essa ação é irreversível.",
                        [
                            { text: "Confirmar", onPress:handleDeleteUser },
                            { text: "Cancelar", style: "cancel" },
                        ]
                    )
                }
            >
                <Text className={`text-center font-semibold text-white`}>Deletar conta</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        {userAlert && 
        <ShowAlert
            type={userAlert.type}
            message={userAlert.message}
            onClose={()=>setUserAlert(null)}
        />}
    </SafeAreaView>
  )
}