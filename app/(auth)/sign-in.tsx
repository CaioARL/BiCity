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
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeProvider';
import tailwindConfig from '../../tailwind.config';

type AlertType = 'success' | 'error' | 'loading';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

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
  const { theme } = useTheme();
  
  // Alert state and animation
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'success' as AlertType,
    message: '',
  });
  const [animation] = useState(new Animated.Value(0));

  const showAlert = (type: AlertType, message: string) => {
    setAlertConfig({ visible: true, type, message });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (alertConfig.visible) {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => hideAlert());
    }
  }, [alertConfig.visible]);

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
      showAlert('error', 'Preencha todos os campos corretamente');
    }

    return isValid;
  };

  const submitForm = () => {
    if (!validateForm()) return;

    abortControlRef.current?.abort();
    abortControlRef.current = new AbortController();
    setIsLoading(true);
    showAlert('loading', 'Realizando login...');

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
              showAlert('success', `Bem-vindo(a) ${response.nome}!`);
              setTimeout(() => router.replace('home'), 2000);
            })
            .catch((error) => {
              showAlert('error', 'Erro ao registrar sessão: ' + error);
            });
        }
      })
      .catch((error) => {
        showAlert('error', 'Erro login ou senha: ' + error);
        setUsernameError('Nome de usuário ou senha incorretos');
        setPasswordError('Nome de usuário ou senha incorretos');
        setIsValidUsername(false);
        setIsValidPassword(false);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (errorLoading) showAlert('error', 'Erro ao carregar: ' + errorLoading);
  }, [errorLoading]);

  const getAlertColor = () => {
    switch (alertConfig.type) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'loading': return '#3b82f6';
      default: return '#3b82f6';
    }
  };

  const getIcon = () => {
    switch (alertConfig.type) {
      case 'success': return <CheckCircle size={24} color="white" />;
      case 'error': return <XCircle size={24} color="white" />;
      case 'loading': return <AlertCircle size={24} color="white" />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={ { backgroundColor: theme === 'dark' ? colors.secondary_black : colors.white }}>
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
          
          <Text className={`text-2xl font-bold text-center mb-4 ${theme === 'dark' ? 'color-primary_green' : 'text-secondary_black'}`}>
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
            theme={theme}
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
            theme={theme}
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
              className={theme === 'dark' ? 'text-white text-blue-500 font-bold' : 'text-secondary_black_sub_title text-blue-500 font-bold'}
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
              className={theme === 'dark' ? 'text-white text-blue-500 font-bold' : 'text-secondary_black_sub_title text-blue-500 font-bold'}
            >
              Redefina
            </Text>
          </View>
        </View>
      </ScrollView>

      <Terms visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} />

      {alertConfig.visible && (
        <Modal transparent visible={alertConfig.visible}>
          <View className="absolute top-10 left-0 bottom-0 right-0 px-4">
            <Animated.View
              style={[
                styles.alert,
                {
                  backgroundColor: getAlertColor(),
                  transform: [{
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 0],
                    }),
                  }],
                },
              ]}
            >
              <View className="flex-row items-center flex-1">
                {getIcon()}
                <Text className="text-white ml-3 text-base flex-1">{alertConfig.message}</Text>
              </View>
              <TouchableOpacity onPress={hideAlert} className="p-1">
                <Text className="text-white text-2xl font-bold">×</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  alert: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});