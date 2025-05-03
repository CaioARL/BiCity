import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Image, Modal, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField'; // Usando o mesmo FormField do Arquivo 2
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { useAuthProvider } from '../context/AuthProvider';
import { UsuarioLoginRequest } from '../../types';
import { loginUser } from '../../api/usuario';
import Terms from './terms';
import ShowAlert from 'components/ShowAlert';

type AlertType = 'success' | 'error' | 'loading';


export default function SignIn() {
  const backgroundImageLogo = require('../../assets/img/logo.png');
  const backgroundImage = require('../../assets/img/background-fundo-figura.png');
  const { onLogin, errorLoading } = useAuthProvider();
  const [isLoading, setIsLoading] = useState(false);
  const abortControlRef = useRef<AbortController | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isValidUsername, setIsValidUsername] = useState<boolean | undefined>(undefined);
  const [isValidPassword, setIsValidPassword] = useState<boolean | undefined>(undefined);

  const [userAlert , setUserAlert] = useState<{type: 'error'|'loading'|'success', message: string} | null>(null)



  // Validação dos campos
  const checkUsername = (text: string) => {
    setForm({ ...form, username: text });
    setIsValidUsername(text.trim() ? true : undefined); // Simples validação de preenchimento
    setUsernameError(text.trim() ? '' : 'Campo obrigatório');
  };

  const checkPassword = (text: string) => {
    setForm({ ...form, password: text });
    setIsValidPassword(text.trim() ? true : undefined); // Simples validação de preenchimento
    setPasswordError(text.trim() ? '' : 'Campo obrigatório');
  };

  const validateForm = () => {
    let isValid = true;

    if (!form.username.trim()) {
      setUsernameError('Campo obrigatório');
      setIsValidUsername(false);
      isValid = false;
    } else {
      setUsernameError('');
      setIsValidUsername(true);
    }

    if (!form.password.trim()) {
      setPasswordError('Campo obrigatório');
      setIsValidPassword(false);
      isValid = false;
    } else {
      setPasswordError('');
      setIsValidPassword(true);
    }

    if (!isValid) {
      setUserAlert({type: 'error', message: 'Preencha todos os campos corretamente'})
    }

    return isValid;
  };

  const submitForm = () => {
    if (!validateForm()) return;

    abortControlRef.current?.abort();
    abortControlRef.current = new AbortController();
    setIsLoading(true);
    setUserAlert({type: 'loading', message: 'Realizando login...'});

    const user: UsuarioLoginRequest = {
      nomeUsuario: form.username,
      email: '',
      cpf: '',
      cnpj: '',
      senha: form.password,
    };

    loginUser(user, abortControlRef.current as AbortController)
      .then((response) => {
        if (onLogin) {
          onLogin(response)
            .then(() => {
              setUserAlert({type: 'success', message: `Bem-vindo(a) ${response.nome}!`});
              setTimeout(() => router.replace('events'), 2000);
            })
            .catch((error) => {
              setUserAlert({type: 'error', message: 'Erro ao registrar sessão: ' + error});
            });
        }
      })
      .catch((error) => {
        setUserAlert({type:'error', message: 'Erro login ou senha: ' + error});
        setUsernameError('Nome de usuário ou senha incorretos');
        setPasswordError('Nome de usuário ou senha incorretos');
        setIsValidUsername(false);
        setIsValidPassword(false);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (errorLoading) setUserAlert({type: 'error', message: 'Erro ao carregar: ' + errorLoading});
  }, [errorLoading]);



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1, position: 'absolute', width: '100%', top: 0, height: 335 }}
        resizeMode="cover"
      />
      <ScrollView className="container w-full h-full">
        <View className="flex-1 min-h-screen h-full">
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 2, height: 220 }}>
            <Image
              source={backgroundImageLogo}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
          </View>
          
          <Text className="text-2xl font-bold text-center text-secondary_black mb-4">
            BICITY
          </Text>

          <FormField
            title="Nome de usuário"
            value={form.username}
            handleChangeText={checkUsername}
            otherStyles="mb-4"
            keyboardType="default"
            placeholder="Insira seu nome de usuário"
            msg={usernameError}
            isValid={isValidUsername}
          />

          <FormField
            title="Senha"
            value={form.password}
            handleChangeText={checkPassword}
            otherStyles="mb-4"
            placeholder="Insira sua senha"
            secureTextEntry={true}
            msg={passwordError}
            isValid={isValidPassword}
          />

          <CustomButton
            title="Entrar"
            handlePress={submitForm}
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
  );
}

