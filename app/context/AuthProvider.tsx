import React, { createContext, useContext, useEffect, useState } from 'react'
import {  CriarUsuarioResponse, Usuario  } from '../../types'
import { getUser } from '../../api/usuario'
import * as SecureStore from 'expo-secure-store'
import api from '../../api/index'


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






    useEffect(() => {

      const loadToken = async () => {

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
              setIsLoading(false)
            })            
            
          } else {
            setAuthState({authenticated: false, user: authState.user})
            api.defaults.headers.common['Authorization'] = ''
            setIsLoading(false)
          }
        }catch(error){
          console.log("Main Loading Error: "+ error)
          setErrorLoading("Erro ao carregar dados iniciais: "+ error)
        }
      }
      loadToken()

    }, [])




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