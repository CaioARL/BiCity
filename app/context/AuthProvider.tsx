import { View, Text, requireNativeComponent } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { CriarUsuarioRequest, CriarUsuarioResponse, Usuario, UsuarioLoginRequest } from '../../types'
import { createUser, getUserById, loginUser } from '../../api/usuario'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'


    interface AuthProps {
        onLogin?: (usuario : Usuario) => Promise<any>
        onLogout?: () => Promise<any>
        onRegister?: (usuarioCadastro: CriarUsuarioResponse) => Promise<any>
        fetchUser?: () => Promise<any>
        authState?: {id: number | null; authenticated: boolean | null; user: Usuario | null}
        isLoading?: boolean
        errorLoading?: string
        
    }

    export const AuthContext = createContext<AuthProps>({})


    export const  useAuthProvider = () => {
      return useContext(AuthContext)
    }	


export default function AuthProvider({children}: any) {

  const [authState, setAuthState] = useState<{
    id: number | null
    authenticated: boolean | null
    user : Usuario | null
  }>({id: null, authenticated: null, user: null})
  const [errorLoading, setErrorLoading] = useState('')
  const [isLoading, setIsLoading] = useState(true)






    useEffect(() => {

      const loadToken = async () => {

        try{
          const token = await SecureStore.getItemAsync('hash')
          
          if (token) {
            // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            await getUserById(parseInt(token))
            .then((response) => {
              setAuthState({id: parseInt(token), authenticated: true, user: response})
            })
            .catch((error) => {
              setErrorLoading("Erro ao carregar dados de usuário, verifique sua conexão : "+ error.message)
              console.log("Error on retrieving user info: "+ error)
            }).finally(() => {
              setIsLoading(false)
            })            
            
          } else {
            setAuthState({id: null, authenticated: false, user: authState.user})
            // axios.defaults.headers.common['Authorization'] = ''
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
          setAuthState({id: usuario.id, authenticated: true, user: usuario})
          // axios.defaults.headers.common['Authorization'] = `Bearer ${response.hash}`
          SecureStore.setItemAsync('hash', usuario.id.toString())
          resolve('Login success')
        } catch (error) {
          reject('Error on login, ' + error)
        }
      })

    }

    const onLogout = async () => {
      return new Promise ((resolve, reject) => {
        try {
          setAuthState({id: null, authenticated: false, user: null})
          SecureStore.deleteItemAsync('hash')
          delete axios.defaults.headers.common['Authorization']
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
          setAuthState({id: usuarioCadastro.id, authenticated: true, user: usuarioCadastro})
        // axios.defaults.headers.common['Authorization'] = `Bearer ${response.hash}`
          SecureStore.setItemAsync('hash', usuarioCadastro.id.toString())
          resolve('Register success')
        } catch (error) {
          reject('Error on Register' + error)
        }

      })
    
    }







    return (
        <AuthContext.Provider value={{onLogin, onLogout, onRegister, authState, isLoading, errorLoading}}>
            {children}
        </AuthContext.Provider>
  )






}