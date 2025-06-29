import React, { createContext, useContext, useEffect, useState } from 'react'
import {  CriarUsuarioResponse, DefaultErrorResponse, Usuario  } from '../../types'
import { getUser } from '../../api/usuario'
import * as SecureStore from 'expo-secure-store'
import api from '../../api/index'
import { getNivelHabilidade } from 'api/nivel-habilidade'
import { getTipoEvento } from 'api/tipo-evento'
import { getTipoProblema } from 'api/tipo-problema'
import { checkHabilidades, checkTheme, checkTipoProblema, checkTiposEvento, getTheme, storeHabilidades, storeTipoProblema, storeTiposEvento } from 'storage'
import { AxiosError } from 'axios'
import { checkStoredVersion } from 'util/versioning'
import { Appearance } from 'react-native'



    interface AuthProps {
        onLogin?: (usuario : Usuario) => Promise<any>
        onLogout?: () => Promise<any>
        onRegister?: (usuarioCadastro: CriarUsuarioResponse) => Promise<any>
        fetchUser?: () => Promise<any>
        authState?: { authenticated: boolean | null; user: Usuario | null }
        isLoading?: boolean
        errorLoading?: string
        
    }

    export const AuthContext = createContext<AuthProps>({})


    export const  useAuthProvider = () => {
      return useContext(AuthContext)
    }	


export default function AuthProvider({children}: any) {

  const [authState, setAuthState] = useState<{
    authenticated: boolean | null
    user : Usuario | null
    
  }>({authenticated: null, user: null})
  const [errorLoading, setErrorLoading] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  const [isLoaded, setIsLoaded] = useState<{auth: boolean, essentialData: boolean}>({ auth: false, essentialData: false })
  const updateIsLoaded = (key: 'auth' | 'essentialData', value: boolean) => { 
    setIsLoaded(prev => ({ ...prev, [key]: value } )) 
  }






    useEffect(() => {

      const authenticate = async () => {

        try{
          const token = await SecureStore.getItemAsync('hash')
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            await getUser()
            .then((response) => {
              setAuthState({authenticated: true, user: response})
            })
            .catch((error) => {
              setErrorLoading("Erro ao carregar dados de usuário, verifique sua conexão : "+ error.message)
              console.log("Error on retrieving user info: "+ error)
            }).finally(() => {
              updateIsLoaded('auth', true)
            })            
            
          } else {
            setAuthState({authenticated: false, user: authState.user})
            api.defaults.headers.common['Authorization'] = ''
              updateIsLoaded('auth', true)
          }
        }catch(error){
          console.log("Main Loading Error: "+ error)
          setErrorLoading("Erro ao carregar dados iniciais: "+ error)
        }
      }
      authenticate()

    }, [])

    useEffect(()=> {
      if(isLoaded.auth === true && isLoaded.essentialData !== false ) return
      const loadEssentialData = async () => {
        const isUpdated = await checkStoredVersion()
        const isHabilidadeLoaded = await checkHabilidades()
        const isTiposEvento = await checkTiposEvento()
        const isTipoProblema = await checkTipoProblema()
        const isTheme = await checkTheme()

        if(!isHabilidadeLoaded || !isUpdated ) {
          await getNivelHabilidade()
          .then((response)=>{
            storeHabilidades(response)
          })
          .catch((error : AxiosError<DefaultErrorResponse>)=>{
            setErrorLoading("Erro ao carregar dados: " + error?.response?.data?.message || error.message)
          })
        }

        if (!isTiposEvento || !isUpdated) {
          await getTipoEvento()
          .then((response)=>{
            storeTiposEvento(response)
          })
          .catch((error : AxiosError<DefaultErrorResponse>)=>{
            setErrorLoading("Erro ao carregar dados: " + error?.response?.data?.message || error.message)
          })
        }

        if (!isTipoProblema || !isUpdated) {
          await getTipoProblema()
          .then((response)=>{
            storeTipoProblema(response)
          })
          .catch((error : AxiosError<DefaultErrorResponse>)=>{
            setErrorLoading("Erro ao carregar dados: " + error?.response?.data?.message || error.message)
          })
        }

        if(isTheme){
          await getTheme()
          .then((response)=>{
            Appearance.setColorScheme(response)
          })
        }

        updateIsLoaded('essentialData', true)

      }
      loadEssentialData()
    }, [isLoaded])

    useEffect(() => {
      if (isLoaded.auth && isLoaded.essentialData) {
        setIsLoading(false)
      }
    }, [isLoaded])

    const onLogin = async (usuario: Usuario) => {
      return new Promise ((resolve, reject) => {
        try {
          setAuthState({authenticated: true, user: usuario})
          api.defaults.headers.common['Authorization'] = `Bearer ${usuario.sessao.token}`
          SecureStore.setItemAsync('hash', usuario.sessao.token)
          resolve('Login success')
        } catch (error) {
          reject('Error on login, ' + error)
        }
      })

    }

    const onLogout = async () => {
      return new Promise ((resolve, reject) => {
        try {
          setAuthState({authenticated: false, user: null})
          SecureStore.deleteItemAsync('hash')
          delete api.defaults.headers.common['Authorization']
          resolve('Logout success')
        } catch (error) {
          reject('Error on logout' + error)
        }
      })      
    }

    const onRegister = async (usuarioCadastro: CriarUsuarioResponse) => {
       //api folder
      return new Promise((resolve, reject) => {
        try {
          setAuthState({authenticated: true, user: usuarioCadastro})
          api.defaults.headers.common['Authorization'] = `Bearer ${usuarioCadastro.sessao.token}`
          SecureStore.setItemAsync('hash', usuarioCadastro.sessao.token)
          resolve('Register success')
        } catch (error) {
          reject('Error on Register' + error)
        }

      })
    
    }


    const fetchUser = async () => {
      return new Promise((resolve, reject) => {
       if (authState.user === null) return reject('User ID is null') 
        try {
          getUser()
            .then((response) => {
              setAuthState({ ...authState, user: response })
              resolve(response);
            })
            .catch((error) => {
              reject('Error on fetching user data: ' + error)
            })
        } catch (error) {
          reject('Error on fetching user data: ' + error)
        }
      });
    }


    return (
        <AuthContext.Provider value={{onLogin, onLogout, onRegister, fetchUser, authState, isLoading, errorLoading}}>
            {children}
        </AuthContext.Provider>
    )






}