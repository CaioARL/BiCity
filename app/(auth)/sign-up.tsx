import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, ImageBackground, BackHandler } from 'react-native'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import TokenInput from '../../components/CustomTokenInput'
import { signUpStep1, signUpStep2, signUpStep3, signUpStep4 } from '../../util/validationSchemas'
import { getViaCep } from '../../api/endereco'
import { ListNivelHabilidade, NivelHabilidade } from '../../types/nivel-habilidade'
import FormFieldSelectList from '../../components/FormFieldSelectList'
import { getNivelHabilidade } from '../../api/nivel-habilidade'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createUser, validateCNPJ, validateCNPJAuthenticity, validateCPF, validateUser } from '../../api/usuario'
import { CreateUsuarioForms, CreateUsuarioRequest, DefaultErrorResponse, ErrorCreateUsuarioForms } from '../../types'
import { checkToken, sendToken } from '../../api/token'
import { useAuthProvider } from '../context/AuthProvider'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import ShowAlert from '../../components/ShowAlert'
import { AxiosError } from 'axios'

export default function SignUp() {
  const [createUsuarioRequest, setCreateUsuarioRequest] = useState<CreateUsuarioRequest | null>()
  const [createUsuarioForms, setCreateUsuarioForms] = useState<CreateUsuarioForms>({ firstName: '', secondName: '', nomeUsuario: '', cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: '', email: '', senha: '', confirmaSenha: '', cpf: '', cnpj: null, nivelHabilidade: { id: 0, nome: '', descricao: '' } })	
  const [errorCreateUsuarioForms, setErrorCreateUsuarioForms] = useState<ErrorCreateUsuarioForms>({ bairro: '', cep: '', cidade: '', cnpj: '', cpf: '', email: '', estado: '', nivelHabilidade: '', firstName: '' , secondName: '', nomeUsuario: '', numero: '', rua: '',  senha: '', confirmaSenha: ''})

  const [codigo, setCodigo] = useState('')
  const [createCodigoRequest, setCreateCodigoRequest] = useState<string>()
  const [codigoError, setCodigoError] = useState('')

  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false)

  const [listNivelHabilidade, setListNivelHabilidade] = useState<ListNivelHabilidade[]>([])
  
  const [step, setStep] = useState(1)
  
  const { onRegister } = useAuthProvider()
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isRequesting, setIsRequesting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>()
  const [staticErrorMessage, setStaticErrorMessage] = useState<string | null>()
  const [successMessage, setSuccessMessage] = useState<string | null>()

  useEffect(() => {
    getNivelHabilidade()
      .then((response) => {
        const niveles: ListNivelHabilidade[] = response.map(nivel => ({
          nome: nivel.nome,
          id: nivel.id,
          value: nivel,
        }))
        setListNivelHabilidade(niveles)
      })
      .catch((response) => {
        setStaticErrorMessage('Erro ao carregar níveis de habilidade: ' + response.message)
      })
  }, [])

  const prevStep = () => {
    if (step === 1 || step === 5) {
      router.replace('/sign-in') // Ajustado para corresponder ao caminho padrão
    } else if (step > 1 && step < 5) {
      setStep(step - 1)
    }
  }
  // Handler para voltar com botão físico ou gesto
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 1) {
        router.replace('/sign-in') // Volta para a tela de login na primeira etapa
        return true
      } else if (step === 5) {
        router.replace('/sign-in') // Na última etapa, vai para "Sign" sem voltar etapas
        return true
      } else {
        prevStep() // Volta uma etapa nas etapas intermediárias
        return true
      }
    })
    return () => backHandler.remove()
  }, [])

  const nextStep = async () => {
    setErrorCreateUsuarioForms({ bairro: '', cep: '', cidade: '', cnpj: '', cpf: '', email: '', estado: '', nivelHabilidade: '', firstName: '' , secondName: '', nomeUsuario: '', numero: '', rua: '',  senha: '', confirmaSenha: ''})
    if (step === 1) {

      const validationResult = signUpStep1.safeParse(createUsuarioForms)
      if (!validationResult.success) {
        validationResult.error.issues.forEach((issue) => {
          setErrorCreateUsuarioForms((prevState) => ({
            ...prevState,
            [issue.path[0]]: issue.message,
          }))
        })
        setErrorMessage('Preencha todos os campos corretamente')
        return
      }

      setIsRequesting(true)
      await validateUser({email: null, nomeUsuario: createUsuarioForms.nomeUsuario}, null) //NOMEUSUARIO
        .then((response) => {
          if(response) {
            updateCampoErrorForms('nomeUsuario', 'Nome de usuario já utilizado, tente outro.')            
          }else{
            updateCampoErrorForms('nomeUsuario', '')
            setStep(2)
          }
      })
      .catch((error : AxiosError<DefaultErrorResponse>) => {
        setErrorMessage("Algo deu errado: "+ error.response?.data.message || error.message)
      })
      .finally(() => setIsRequesting(false))
      

    } else if (step === 2) {

      const validationResult = signUpStep2.safeParse(createUsuarioForms)
      if (!validationResult.success) {
        validationResult.error.issues.forEach((issue) => {
          setErrorCreateUsuarioForms((prevState) => ({
            ...prevState,
            [issue.path[0]]: issue.message,
          }))
        })
        setErrorMessage('Preencha todos os campos corretamente')
        return
      }

      setStep(3)

    } else if (step === 3) {
      
      const validationResult = signUpStep3.safeParse(createUsuarioForms)
      if (!validationResult.success) {
        validationResult.error.issues.forEach((issue) => {
          setErrorCreateUsuarioForms((prevState) => ({
            ...prevState,
            [issue.path[0]]: issue.message,
          }))
        })
        setErrorMessage('Preencha todos os campos corretamente')
        return
      }

      if(createUsuarioForms.confirmaSenha !== createUsuarioForms.senha) {
        setErrorCreateUsuarioForms((prevState) => ({
          ...prevState,
          confirmaSenha: 'As senhas não coincidem',
        })) 
        setErrorMessage('As senhas não coincidem')
        return
      }

      if(createUsuarioForms.cpf !== null){
        setIsRequesting(true)
        await validateCPF(createUsuarioForms.cpf, null)
          .then((response) => {
            if(response.isValid) {
              setStep(4)
            }else{
              updateCampoErrorForms('cpf', response.message)
            }
        })
        .catch((error : AxiosError<DefaultErrorResponse>) => {
          setErrorMessage("Algo deu errado: "+ error.response?.data.message || error.message)
        })
        .finally(() => setIsRequesting(false))
      }

      if(createUsuarioForms.cnpj !== null){
        const cnpj = createUsuarioForms.cnpj
        setIsRequesting(true)
        await validateCNPJAuthenticity(cnpj, null)
        .then((response) => {
          if(!response) {
              updateCampoErrorForms('cnpj', 'CNPJ inválido')
            } else {
              setIsRequesting(true)
              validateCNPJ(cnpj, null)
                .then((response) => {
                  if(response) {
                    updateCampoErrorForms('cnpj', 'CNPJ já cadastrado')
                  }
                  else {
                    setStep(4)
                  }
              })
              .catch((error : AxiosError<DefaultErrorResponse>) => {
                updateCampoErrorForms('cnpj', 'CNPJ inválido')
                setErrorMessage("Algo deu errado: "+ error.response?.data.message || error.message)
              })
              .finally(() => setIsRequesting(false))
            }
        })
        .catch((error : AxiosError<DefaultErrorResponse>) => {
          updateCampoErrorForms('cnpj', 'CNPJ inválido')
          setErrorMessage("Algo deu errado: "+ error.response?.data.message || error.message)
        })
        .finally(() => setIsRequesting(false))
      }

    } else if (step === 4) {

      const validationResult = signUpStep4.safeParse(createUsuarioForms)
      if (!validationResult.success) {
        validationResult.error.issues.forEach((issue) => {
          setErrorCreateUsuarioForms((prevState) => ({
            ...prevState,
            [issue.path[0]]: issue.message,
          }))
        })
        setErrorMessage('Preencha todos os campos corretamente')
        return
      }

      setIsRequesting(true)
      await validateUser({email:createUsuarioForms.email, nomeUsuario: null}, null) //EMAIL
        .then((response) => {
          if(response) {
            updateCampoErrorForms('email', 'Email já cadastrado')
          }else{
            setIsEmailCodeLoading(true)
            sendToken(createUsuarioForms.email,null)
              .then((response) => {
                setSuccessMessage(`${response} Verifique seu email.`)
                setStep(5)
              })
              .catch((error : AxiosError<DefaultErrorResponse>) => {
                setErrorMessage('Erro ao enviar código: ' + (error.response?.data.message || error.message))
              })
              .finally(() => setIsEmailCodeLoading(false))
            }
          })
      .catch((error : AxiosError<DefaultErrorResponse>) => {
        setErrorMessage('Erro ao enviar código: ' + (error.response?.data.message || error.message))
      })
      .finally(() => setIsRequesting(false))

    } else if (step === 5) {

      if(codigo.length !== 4) {
        setErrorMessage('Código inválido')
        return
      }

      setCreateCodigoRequest(codigo)
    }
  }

  const checkCep = () => {
      setIsRequesting(true)
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      getViaCep(createUsuarioForms.cep, abortControllerRef.current)
      .then((response) => {
        if (!response.localidade || !response.estado || !response.logradouro || !response.bairro) {
          setErrorMessage('CEP: Alguns dados não foram encontrados')
        } else {
          setErrorCreateUsuarioForms(prev=>({...prev, rua:'', bairro:'', cidade:'', estado:'' }))
          setCreateUsuarioForms((prevState) => ({
            ...prevState,
            rua: response.logradouro,
            bairro: response.bairro,
            cidade: response.localidade,
            estado: response.estado,
          }))
        }
      })
      .catch((error : AxiosError<DefaultErrorResponse>) => {
        updateCampoErrorForms('cep', error.response?.data.message || error.message)
        setErrorMessage("Erro ao buscar CEP: "+ error.response?.data.message || error.message)
      })
      .finally(() => setIsRequesting(false)) 
  }

    useEffect(() => {
      if(!createUsuarioRequest) return
      createUser(createUsuarioRequest, null)
      .then((response) => {
        if (onRegister) {
          onRegister(response)
            .then(() => {
              setSuccessMessage('Cadastro realizado com sucesso!')
              router.replace('events')
            })
            .catch((error : AxiosError<DefaultErrorResponse>) => {
              setErrorMessage('Erro ao registrar-se: ' + (error.response?.data.message || error.message))
            })
          }
        })
        .catch((error : AxiosError<DefaultErrorResponse>) => {
          setErrorMessage('Erro ao registrar-se: ' + (error.response?.data.message || error.message))
        })        
    },[createUsuarioRequest]) 

    useEffect(() =>  {
      if(!createCodigoRequest) return
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      setIsRequesting(true)
      checkToken(createCodigoRequest, createUsuarioForms.email, null)
        .then((response) => {
          if(response.success){
            setCreateUsuarioRequest({ nome: createUsuarioForms.firstName + ' ' + createUsuarioForms.secondName, nomeUsuario: createUsuarioForms.nomeUsuario, endereco: {  numero: parseInt(createUsuarioForms.numero), cep: createUsuarioForms.cep, estado: createUsuarioForms.estado, cidade: createUsuarioForms.cidade, bairro: createUsuarioForms.bairro, rua: createUsuarioForms.rua, } , email: createUsuarioForms.email, senha: createUsuarioForms.senha, cpf: createUsuarioForms.cpf, cnpj: createUsuarioForms.cnpj, nivelHabilidade: createUsuarioForms.nivelHabilidade.id })
          } else {
            setCodigoError('Código inválido')
            setErrorMessage('Código inválido')
          }
        })
        .catch((error : AxiosError<DefaultErrorResponse>) => {
          setErrorMessage('Erro ao validar código: ' + (error.response?.data.message || error.message))
        })
        .finally(() => setIsRequesting(false))
      },[createCodigoRequest])

  const updateCampoCreateUsuario = (campo: string , valor: string | number | null) => {
    setCreateUsuarioForms((prevState) => ({
      ...prevState,
      [campo]: valor,
    }))
  }

  const updateCampoUsuarioNivelHabilidade = (valor: NivelHabilidade) => {
    setCreateUsuarioForms((prevState) => ({
      ...prevState,
      nivelHabilidade: valor,
    }))
  }

  const updateCampoErrorForms = (campo: string , valor: string) => {
    setErrorCreateUsuarioForms((prevState) => ({
      ...prevState,
      [campo]: valor,
    }))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
    <ImageBackground
      source={require('../../assets/img/background-fundo-figura.png')}
      style={{ position: 'absolute', width: '100%', top: 0, height: 335 }}
      resizeMode="cover"
    />

    <TouchableOpacity
      style={{ position: 'absolute', top: 45, right: 20, borderRadius: '50%',  paddingHorizontal: 15,
        paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 10,}} 
        className='bg-primary_green'
        onPress={prevStep}
      >
      <ArrowLeft size={24} color="white" />
      </TouchableOpacity>
      
      <ScrollView className='container' contentContainerStyle={{ flexGrow: 1 }}>
     
        {step === 1 && (
              <>  
              <View style={{position: 'absolute', width: '100%', bottom: 0, top: 170}} className="flex-1">
                <FormField
                  title="Primeiro Nome"
                  value={createUsuarioForms.firstName}
                  placeholder="Digite seu primeiro nome"
                  handleChangeText={input => updateCampoCreateUsuario('firstName', input)}
                  onFocus={() => updateCampoErrorForms('firstName', '')}
                  msg={errorCreateUsuarioForms.firstName}
                  />
                <FormField
                  title="Último Nome"
                  value={createUsuarioForms.secondName}
                  placeholder="Digite seu último nome"
                  handleChangeText={input => updateCampoCreateUsuario('secondName', input)}
                  onFocus={() => updateCampoErrorForms('secondName', '')}
                  msg={errorCreateUsuarioForms.secondName}
                  />
                <FormField
                  title="Username"
                  value={createUsuarioForms.nomeUsuario}
                  placeholder="Digite seu username"
                  handleChangeText={input => updateCampoCreateUsuario('nomeUsuario', input)}
                  onFocus={() => updateCampoErrorForms('nomeUsuario', '')}
                  isLoading={isRequesting}
                  msg={errorCreateUsuarioForms.nomeUsuario}
                />
                <FormFieldSelectList
                  title="Nível de habilidade"
                  selectedValue={createUsuarioForms.nivelHabilidade}
                  options={listNivelHabilidade}
                  handleChange={input =>{
                    updateCampoUsuarioNivelHabilidade(input)
                    updateCampoErrorForms('nivelHabilidade', '')
                  }}
                  msg={errorCreateUsuarioForms.nivelHabilidade}
                />
                <CustomButton title="Próximo" handlePress={nextStep} />
              </View>
              </>
            )}
            {step === 2 && (
              <>
              <View style={{position: 'absolute', width: '100%', bottom: 0, top: 105}}>
                <FormField
                  title="CEP"
                  value={createUsuarioForms.cep}
                  placeholder="Digite seu CEP"
                  handleChangeText={input => updateCampoCreateUsuario('cep', input)}
                  msg={errorCreateUsuarioForms.cep}
                  isLoading={isRequesting}
                  handleEndEditing={() => {
                    updateCampoErrorForms('cep', '')
                    checkCep()
                  }}
                  
                  maxLength={8}
                  keyboardType="number-pad"
                />
                <FormField
                  title="Cidade"
                  value={createUsuarioForms.cidade}
                  placeholder="Digite sua Cidade"
                  msg={errorCreateUsuarioForms.cidade}
                  handleChangeText={input => updateCampoCreateUsuario('cidade', input)}
                  onFocus={()=>updateCampoErrorForms('cidade', '')}
                />
                <FormField
                  title="Estado"
                  value={createUsuarioForms.estado}
                  placeholder="Digite seu Estado"
                  handleChangeText={input => updateCampoCreateUsuario('estado', input)}
                  onFocus={()=>updateCampoErrorForms('estado', '')}
                  msg={errorCreateUsuarioForms.estado}
                />
                <FormField
                  title="Rua"
                  value={createUsuarioForms.rua}
                  msg={errorCreateUsuarioForms.rua}
                  placeholder="Digite sua rua"
                  handleChangeText={ input => updateCampoCreateUsuario('rua', input)}
                  onFocus={()=>updateCampoErrorForms('rua', '')}

                />
                <FormField
                  title="Número"
                  value={createUsuarioForms.numero}
                  placeholder="Digite seu número"
                  keyboardType='number-pad'
                  handleChangeText={ input => updateCampoCreateUsuario('numero', input)}
                  onFocus={()=>updateCampoErrorForms('numero', '')}
                  msg={errorCreateUsuarioForms.numero}
                />
                <FormField
                  title="Bairro"
                  value={createUsuarioForms.bairro}
                  placeholder="Digite seu bairro"
                  msg={errorCreateUsuarioForms.bairro}
                  handleChangeText={ input => updateCampoCreateUsuario('bairro', input)}
                  onFocus={()=>updateCampoErrorForms('bairro', '')}
                />
                <CustomButton title="Próximo" handlePress={nextStep} />
              </View>
              </>
            )}
            {step === 3 && (
              <>
               <View style={{position: 'absolute', width: '100%', bottom: 0, top: 170}}>
                  {createUsuarioForms.cpf !== null && (
                    <>
                      <FormField
                        title="CPF ou CNPJ"
                        value={createUsuarioForms.cpf}
                        placeholder="Digite seu CPF"
                        handleChangeText={input => updateCampoCreateUsuario('cpf', input )}
                        onFocus={()=>updateCampoErrorForms('cpf', '')}
                        msg={errorCreateUsuarioForms.cpf}
                        isLoading={isRequesting}
                        keyboardType="number-pad"
                        maxLength={11}
                      />
                      <TouchableOpacity
                        onPress={()=>{
                          updateCampoCreateUsuario('cpf', null)
                          updateCampoCreateUsuario('cnpj', '')
                        }}
                      >
                        <Text className='text-[#3643ff]'>{'Sou Empresa (usar CNPJ)'}</Text>
                      </TouchableOpacity>
                    </>
                  )} 
                  { createUsuarioForms.cnpj !== null && ( 
                    <>
                      <FormField
                      title="CNPJ"
                      value={createUsuarioForms.cnpj}
                      placeholder="Digite seu CNPJ"
                      handleChangeText={input => updateCampoCreateUsuario('cnpj', input)}
                      onFocus={()=>updateCampoErrorForms('cnpj', '')}
                      msg={errorCreateUsuarioForms.cnpj}
                      isLoading={isRequesting}
                      keyboardType="number-pad"
                      maxLength={14}
                      />
                    <TouchableOpacity
                      onPress={()=>{
                        updateCampoCreateUsuario('cnpj', null)
                        updateCampoCreateUsuario('cpf', '')
                      }}
                    >
                      <Text className='text-[#3643ff]'>{"Sou Pessoa Fisica (Usar CPF)"}</Text>
                    </TouchableOpacity>
                  </>
                  )  
                }
                
                
                <FormField
                  title="Senha"
                  value={createUsuarioForms.senha}
                  placeholder="Digite sua senha"
                  handleChangeText={input => updateCampoCreateUsuario('senha', input)}
                  onFocus={()=>updateCampoErrorForms('senha', '')}
                  msg={errorCreateUsuarioForms.senha}
                  secureTextEntry={true}
                />
                <FormField
                  title="Confirmar Senha"
                  value={createUsuarioForms.confirmaSenha}
                  placeholder="Confirme sua senha"
                  handleChangeText={input => updateCampoCreateUsuario('confirmaSenha', input)}
                  onFocus={()=>updateCampoErrorForms('confirmaSenha', '')}
                  msg={errorCreateUsuarioForms.confirmaSenha}
                  secureTextEntry={true}
                  maxLength={20}
                />
                <CustomButton title="Próximo" handlePress={nextStep} />
              </View>
              </>
            )}
            {step === 4 && (
              <>
               <View style={{position: 'absolute', width: '100%', bottom: 0, top: 250}}>
                <FormField
                  title="Email"
                  value={createUsuarioForms.email}
                  placeholder="Digite seu email"
                  handleChangeText={input => updateCampoCreateUsuario('email', input)}
                  onFocus={()=>updateCampoErrorForms('email', '')}
                  msg={errorCreateUsuarioForms.email}
                  isLoading={isEmailCodeLoading || isRequesting}
                  keyboardType="email-address"
                />
                <CustomButton title="Próximo" handlePress={nextStep} />
              </View>
              </>
            )}
            {step === 5 && (
              <>
              <View style={{position: 'absolute', width: '100%', bottom: 0, top: 260}}>
                <TokenInput
                  title="Código de confirmação"
                  value={codigo}
                  handleChangeText={setCodigo}
                  msg={codigoError}
                  isValid={codigo.length===4}
                  maxLength={4}
                />
                <CustomButton title="Confirmar Código" isLoading={isRequesting} handlePress={nextStep} />
              </View>
              </>
            )}
      </ScrollView>
 
      {errorMessage && (
        <ShowAlert
          message={errorMessage}
          type='error'
          onClose={() => setErrorMessage(null)}
        />
      )}
      {successMessage && (
        <ShowAlert
          message={successMessage}
          type='success'
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {staticErrorMessage && (
        <ShowAlert
          message={staticErrorMessage}
          type='error'
          isStatic={true}
          onClose={() => setStaticErrorMessage(null)}
        />
      )}
    </SafeAreaView>
      
  )
}