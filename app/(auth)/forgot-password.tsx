import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, ImageBackground, Modal, Animated, StyleSheet, Appearance } from 'react-native'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import TokenInput from '../../components/CustomTokenInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { checkTokenRecuperacao, sendTokenRecuperacao } from '../../api/token'
import { router } from 'expo-router'
import ShowAlert from 'components/ShowAlert'
import { recoverPassword } from 'api/usuario'
import { validationSchemas } from 'util/validationSchemas'
import { DefaultErrorResponse } from 'types'
import { AxiosError } from 'axios'
import { Ionicons } from "@expo/vector-icons"



export default function ResetPassword() {
  const theme = Appearance.getColorScheme()
  
  const [isLoading, setIsLoading] = useState(false)
  
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const [verificationToken, setVerificationToken] = useState('')
  const [verificationTokenError, setVerificationTokenError] = useState('')
  const [timer, setTimer] = useState(300)

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const [step, setStep] = useState(1)

  const [authToken, setAuthToken] = useState<string | null>(null)

  const [userAlert , setUserAlert] = useState<{type: 'error'|'loading'|'success', message: string} | null>(null)

  // Timer para o token
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setUserAlert({type: 'error', message: 'Tempo esgotado! Solicite um novo código.'})
      setStep(1)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  const nextStep = () => {
    if (step === 1) {

    setEmailError('')
    const validationResult = validationSchemas.email.safeParse(email)
    if (!validationResult.success) {
      setEmailError(validationResult.error.errors[0].message)
      setUserAlert({type: 'error', message: 'Revise os campos!'})
      return
    }

    setIsLoading(true)
    sendTokenRecuperacao(email, null)
    .then((response) => {
      setUserAlert({type: 'success', message: `${response} Verifique seu email.`})
      setTimer(300)
      setStep(2)
    })
    .catch((error: AxiosError<DefaultErrorResponse>) => {
      setUserAlert({type: 'error', message: 'Erro ao enviar código: ' + (error.response?.data.message || error.message)})
    })
    .finally(() => setIsLoading(false))
    
    } else if (step === 2) {

      setVerificationTokenError('')
      const validationResult = validationSchemas.verificationToken.safeParse(verificationToken)
      if (!validationResult.success) {
        setVerificationTokenError(validationResult.error.errors[0].message)
          setUserAlert({type: 'error', message: 'Revise os campos!'})
          return 
      }

      setIsLoading(true)
      checkTokenRecuperacao(verificationToken, email,  null )
      .then((response) => {
        if (response.success) {
          setUserAlert({type: 'success', message: 'Código verificado com sucesso!'})
          setAuthToken(response.token)
          setStep(3)
        } else {
          setUserAlert({type: 'error', message: 'Código inválido!'})
        }
      })
      .catch((error: AxiosError<DefaultErrorResponse>) => {
        setUserAlert({type: 'error', message: 'Erro ao enviar código: ' + (error.response?.data.message || error.message)})
      })
      .finally(() => setIsLoading(false))
          
    } else if (step === 3) {

      if(authToken === null) return
      setNewPasswordError('')
      setConfirmPasswordError('')
      const validationResult = validationSchemas.senha.safeParse(newPassword)
      if (!validationResult.success) {
        setNewPasswordError(validationResult.error.errors[0].message)
        setUserAlert({type: 'error', message: 'Revise os campos!'})
        return
      }

      const confirmPasswordValidationResult = validationSchemas.senha.safeParse(confirmPassword)
      if (!confirmPasswordValidationResult.success) {
        setConfirmPasswordError(confirmPasswordValidationResult.error.errors[0].message)
        setUserAlert({type: 'error', message: 'Revise os campos!'})
        return
      }

      if (newPassword !== confirmPassword) {
        setConfirmPasswordError('As senhas não coincidem')
        setUserAlert({type: 'error', message: 'Revise os campos!'})
        return 
      }

      setIsLoading(true)
      recoverPassword(newPassword, authToken, null)
        .then(() => {
          setUserAlert({type: 'success', message: 'Senha redefinida com sucesso!'})
          setTimeout(() => {
            router.replace('/sign-in')
          }, 2000)
        })
        .catch((error: AxiosError<DefaultErrorResponse>) => {
          setUserAlert({type: 'error', message: 'Erro ao enviar código: ' + (error.response?.data.message || error.message)})
        })
        .finally(() => setIsLoading(false))

    }
  }

  const prevStep = () => {
    if (step === 1) {
      router.replace('/sign-in')
    } else {
      setStep(step - 1)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme==='light'?'white':'#1f2937', justifyContent: 'center', alignItems: 'center' }}>
      <ImageBackground
        source={require('../../assets/img/background-fundo-figura.png')}
        style={{ position: 'absolute', width: '100%', top: 0, height: 335 }}
        resizeMode="cover"
      />

      <TouchableOpacity
        style={{
          position: 'absolute', top: 45, right: 20, borderRadius: 50, paddingHorizontal: 15,
          paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25,
          shadowRadius: 3.84, zIndex: 10,
        }}
        className={`${theme==='light'?'bg-primary_green':'bg-secondary_black'}`}
        onPress={prevStep}
      >
        <Ionicons name="arrow-back" size={24} color={theme==='light'?'#555':'white'} />
      </TouchableOpacity>

      <ScrollView className='container' contentContainerStyle={{ flexGrow: 1 }}>
        {step === 1 && (
          <View style={{ position: 'absolute', width: '100%', bottom: 0, top: 250 }}>
            <FormField
              title="Email"
              value={email}
              placeholder="Digite seu email"
              handleChangeText={setEmail}
              msg={emailError}
              isLoading={isLoading}
              onFocus={() => setEmailError('')}
              maxLength={50}
              keyboardType="email-address"
            />
            <CustomButton title="Próximo" handlePress={nextStep} isLoading={isLoading} />
          </View>
        )}
        {step === 2 && (
          <View style={{ position: 'absolute', width: '100%', bottom: 0, top: 250 }}>
            <TokenInput
              title="Código de verificação"
              value={verificationToken}
              handleChangeText={setVerificationToken}
              msg={verificationTokenError}
              isValid={verificationTokenError === ''}
              onFocus={() => setVerificationTokenError('')}
              maxLength={4}
            />
            {/* <FormField
              title="Código de verificação"
              value={verificationToken}
              placeholder="Digite o código"
              handleChangeText={setVerificationToken}
              msg={verificationTokenError}
              onFocus={() => setVerificationTokenError('')}
              isLoading={isLoading}
              maxLength={4}
            /> */}
            <Text className={`text-center mt-2 ${theme==='light'?'text-black':'text-white'}`}>Tempo restante: {formatTime(timer)}</Text>
            <CustomButton title="Verificar" handlePress={nextStep} isLoading={isLoading} />
          </View>
        )}
        {step === 3 && (
          <View style={{ position: 'absolute', width: '100%', bottom: 0, top: 200 }}>
            <FormField
              title="Nova Senha"
              value={newPassword}
              placeholder="Digite sua nova senha"
              handleChangeText={setNewPassword}
              msg={newPasswordError}
              onFocus={() => setNewPasswordError('')}
              maxLength={20}
              isLoading={isLoading}
              secureTextEntry={true}
            />
            <FormField
              title="Confirmar Nova Senha"
              value={confirmPassword}
              placeholder="Confirme sua nova senha"
              handleChangeText={setConfirmPassword}
              msg={confirmPasswordError}
              secureTextEntry={true}
              maxLength={20}
              onFocus={() => setConfirmPasswordError('')}
              isLoading={isLoading}
            />
            <CustomButton title="Redefinir Senha" handlePress={nextStep} isLoading={isLoading}/>
          </View>
        )}
      </ScrollView>

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