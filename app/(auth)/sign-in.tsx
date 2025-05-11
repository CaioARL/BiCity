import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, ImageBackground, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useAuthProvider } from '../context/AuthProvider'
import { DefaultErrorResponse, RequestLogin, RequestLoginError } from '../../types'
import { loginUser } from '../../api/usuario'
import Terms from './terms'
import ShowAlert from 'components/ShowAlert'
import { AxiosError } from 'axios'
import { loginSchema } from 'util/validationSchemas'
import { isFirstLaunch } from 'util/versioning'

export default function SignIn() {
  const { onLogin, errorLoading } = useAuthProvider()
  const [isLoading, setIsLoading] = useState(false)
  const abortControlRef = useRef<AbortController | null>(null)
  
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [login, setLogin] = useState<{credencial: string, senha: string}>({credencial: '', senha: ''})
  const [requestLogin, setRequestLogin] = useState<RequestLogin | undefined>()
  const [requestLoginError, setRequesLoginError] = useState<RequestLoginError>({ cnpj: '', cpf: '', email: '', nomeUsuario: '', senha : '' })
  const [requestError, setRequestError] = useState<string| null>()

  const [userAlert , setUserAlert] = useState<{type: 'error'|'loading'|'success', message: string} | null>(null)


  useEffect(() => {
    const loading = async () => {
      isFirstLaunch().then((response) => {
        console.log('isFirstLaunch', response)
        if (response) {
          router.push('/onboarding')
        }
      })
    }
    loading()
  },[])

  const validationAndLogin = () => {
    if(!login.credencial) return
    const typeResult = checkInputType(login.credencial)
    setRequesLoginError({ cnpj: '', cpf: '', email: '', nomeUsuario: '', senha : '' })
    if(!typeResult){
      updateCampoError('nomeUsuario', 'O valor inserido não corresponde a um CNPJ, CPF, nome de usuário ou email válido. Por favor, verifique e tente novamente.')
      setUserAlert({type: 'error', message: 'Preencha todos os campos corretamente'})
      return
    }

    const validationResult = loginSchema.safeParse({...typeResult, senha: login.senha})
    if(!validationResult.success){
      console.log(validationResult.error.issues)
      validationResult.error.issues.forEach(issue=>{
        setRequesLoginError(prev => ({...prev, 
          [issue.path[0]]: issue.message 
        }))
      })
      setUserAlert({type: 'error', message: 'Preencha todos os campos corretamente'})
      return
    }
    setRequestLogin({...typeResult, senha: login.senha})
  }

  useEffect(() => {
    if(!requestLogin) return
    abortControlRef.current?.abort()
    abortControlRef.current = new AbortController()
    setIsLoading(true)
    setUserAlert({type: 'loading', message: 'Realizando login...'})

    loginUser(requestLogin, abortControlRef.current as AbortController)
      .then((response) => {
        if (onLogin) {
          onLogin(response)
            .then(() => {
              setUserAlert({type: 'success', message: `Bem-vindo(a) ${response.nome}!`})
              setTimeout(() => router.replace('events'), 2000)
            })
            .catch((error) => {
              setUserAlert({type: 'error', message: 'Erro ao registrar sessão: ' + error})
            })
        }
      })
      .catch((error: AxiosError<DefaultErrorResponse>) => {
        setUserAlert({type:'error', message: error.response?.data.message || error.message})
        setRequestError(error.response?.data.message.replace('Erro:', '') || error.message)
      })
      .finally(() => setIsLoading(false))
  }, [requestLogin])

  useEffect(() => {
    if (errorLoading) setUserAlert({type: 'error', message: 'Erro ao carregar: ' + errorLoading})
  }, [errorLoading])

  const checkInputType = (credential: string)  => {
    const cnpjRegex = /^[0-9]{14}$/
    const cpfRegex = /^[0-9]{11}$/
    const nomeUsuarioRegex = /^[a-zA-Z0-9]{4,20}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (cnpjRegex.test(credential)) {
      return {cnpj: credential, cpf: null, nomeUsuario: null, email: null}
    } else if (cpfRegex.test(credential)) {
      return {cnpj: null, cpf: credential, nomeUsuario: null, email: null}
    } else if (nomeUsuarioRegex.test(credential)) {
        return {cnpj: null, cpf: null, nomeUsuario: credential, email: null}
    } else if (emailRegex.test(credential)) {
        return {cnpj: null, cpf: null, nomeUsuario: null, email: credential}
    }
    return null
  }

  const updateCampoLogin = (campo: string, value: string) => {
    setLogin(prev => ({...prev, [campo]: value}))
  }

  const updateCampoError = (campo: string, value: string) => {
    setRequesLoginError(prev => ({...prev, [campo]: value}))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground
        source={require('../../assets/img/background-fundo-figura.png')}
        style={{ flex: 1, position: 'absolute', width: '100%', top: 0, height: 335 }}
        resizeMode="cover"
      />
      <ScrollView className="container w-full h-full">
        <View className="flex-1 min-h-screen h-full">
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 2, height: 220 }}>
            <Image
              source={require('../../assets/img/logo.png')}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
          </View>
          
          <Text className="text-2xl font-bold text-center text-secondary_black mb-4">
            BICITY
          </Text>

          <FormField
            title="Nome de usuário"
            value={login.credencial}
            handleChangeText={text => updateCampoLogin('credencial',text)}
            otherStyles="mb-4"
            keyboardType="default"
            onFocus={()=>{setRequesLoginError(prev=> ({...prev, cnpj:'', cpf:'', email:'', nomeUsuario:''}))}}
            placeholder="Insira seu nome de usuário ou email/cpf/cnpj"
            msg={requestLoginError.nomeUsuario || requestLoginError.email || requestLoginError.cpf || requestLoginError.cnpj}
          />

          <FormField
            title="Senha"
            value={login.senha}
            handleChangeText={text => updateCampoLogin('senha',text)}
            otherStyles="mb-4"
            placeholder="Insira sua senha"
            secureTextEntry={true}
            onFocus={()=>updateCampoError('senha', '')}
            msg={requestLoginError.senha}
          />
          <Text className='text-base text-color_red_error'>{requestError}</Text>
          <CustomButton
            title="Entrar"
            handlePress={validationAndLogin}
            containerStyles="mt-4"
            isLoading={isLoading}
          />

          <View className="flex-row justify-center mt-16">
            <Text className="text-secondary_black_sub_title">
              Não tem uma conta?{' '}
            </Text>
            <Text
              onPress={() => setFilterModalVisible(true)}
               className="text-blue-500 font-bold"
            >
              Inscrever-se
            </Text>
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-secondary_black_sub_title">
              Esqueceu a senha?{' '}
            </Text>
            <Text
              onPress={() => router.push('/forgot-password')}
              className={'text-blue-500 font-bold'}
            >
              Redefina
            </Text>
          </View>
        </View>
      </ScrollView>

      <Terms visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} />

      {userAlert && 
        <ShowAlert
          message={userAlert.message}
          type={userAlert.type}
          onClose={()=> setUserAlert(null)}
        />
      }
    
    </SafeAreaView>
  )
}

