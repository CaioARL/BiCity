import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ImageBackground, Modal, Animated, StyleSheet } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import TokenInput from '../../components/CustomTokenInput';
import { valid } from '../../util/validationSchemas';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendToken, checkToken, resetPassword } from '../../api/token';
import { router, useNavigation } from 'expo-router';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react-native';

type AlertType = 'success' | 'error' | 'loading';

export default function ResetPassword() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState<boolean | undefined>(undefined);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isValidToken, setIsValidToken] = useState<boolean | undefined>(undefined);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [timer, setTimer] = useState(300);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [isValidNewPassword, setIsValidNewPassword] = useState<boolean | undefined>(undefined);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState<boolean | undefined>(undefined);

  const [step, setStep] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const backgroundImage = require('../../assets/img/background-fundo-figura.png');

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

  // Timer para o token
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      showAlert('error', 'Tempo esgotado! Solicite um novo código.');
      setStep(1);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Validação de campos obrigatórios (baseado no SignUp)
  const validateRequiredFields = (
    fields: { value: string; setError: (msg: string) => void; check: () => void }[]
  ) => {
    let allFilledAndValid = true;
    fields.forEach(({ value, setError, check }) => {
      if (!value.trim()) {
        setError('Campo obrigatório');
        allFilledAndValid = false;
      } else {
        check();
      }
    });
    return allFilledAndValid;
  };

  const nextStep = () => {
    if (step === 1) {
      const fields = [
        { value: email, setError: setEmailError, check: () => checkEmail(email) },
      ];
      if (!validateRequiredFields(fields) || !isValidEmail) {
        showAlert('error', 'Preencha o email corretamente');
        return;
      }
      setIsEmailLoading(true);
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      sendToken(email, abortControllerRef.current as AbortController)
        .then((response) => {
          showAlert('success', `${response} Verifique seu email.`);
          setTimer(300);
          setStep(2);
        })
        .catch((response) => {
          showAlert('error', 'Erro ao enviar código: ' + response.message);
        })
        .finally(() => setIsEmailLoading(false));
    } else if (step === 2) {
      const fields = [
        { value: token, setError: setTokenError, check: () => checkToken(token) },
      ];
      if (!validateRequiredFields(fields) || !isValidToken) {
        showAlert('error', 'Preencha o código corretamente');
        return;
      }
      setIsTokenLoading(true);
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      checkToken(token, email, abortControllerRef.current as AbortController)
        .then(() => {
          setStep(3);
        })
        .catch((response) => {
          showAlert('error', 'Código inválido: ' + response.message);
        })
        .finally(() => setIsTokenLoading(false));
    } else if (step === 3) {
      const fields = [
        { value: newPassword, setError: setNewPasswordError, check: () => checkNewPassword(newPassword) },
        { value: confirmPassword, setError: setConfirmPasswordError, check: () => checkConfirmPassword(confirmPassword) },
      ];
      if (!validateRequiredFields(fields) || !isValidNewPassword || !isValidConfirmPassword || newPassword !== confirmPassword) {
        if (newPassword !== confirmPassword) setConfirmPasswordError('As senhas não coincidem');
        showAlert('error', 'Preencha as senhas corretamente');
        return;
      }
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      resetPassword(email, token, newPassword, abortControllerRef.current as AbortController)
        .then(() => {
          showAlert('success', 'Senha redefinida com sucesso!');
          router.replace('/sign-in');
        })
        .catch((response) => {
          showAlert('error', 'Erro ao redefinir senha: ' + response.message);
        });
    }
  };

  const prevStep = () => {
    if (step === 1) {
      router.replace('/sign-in');
    } else {
      setStep(step - 1);
    }
  };

  const checkEmail = (text: string) => {
    setEmail(text);
    const result = valid.emailSchema.safeParse(text);
    setIsValidEmail(text.trim() ? result.success : undefined);
    setEmailError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const checkToken = (text: string) => {
    setToken(text);
    const result = valid.codeUserValidationSchema.safeParse(text);
    setIsValidToken(text.trim() ? result.success : undefined);
    setTokenError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const checkNewPassword = (text: string) => {
    setNewPassword(text);
    const result = valid.passwordSchema.safeParse(text);
    setIsValidNewPassword(text.trim() ? result.success : undefined);
    setNewPasswordError(text.trim() && !result.success ? result.error.issues[0].message : '');
    if (confirmPassword) checkConfirmPassword(confirmPassword);
  };

  const checkConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    const result = valid.passwordSchema.safeParse(text);
    const passwordsMatch = newPassword === text;
    setIsValidConfirmPassword(text.trim() ? result.success && passwordsMatch : undefined);
    setConfirmPasswordError(text.trim() ? (result.success ? (passwordsMatch ? '' : 'As senhas não coincidem') : result.error.issues[0].message) : '');
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <ImageBackground
        source={backgroundImage}
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
        className='bg-primary_green'
        onPress={prevStep}
      >
        <ArrowLeft size={24} color="white" />
      </TouchableOpacity>

      <ScrollView className='container' contentContainerStyle={{ flexGrow: 1 }}>
        {step === 1 && (
          <View style={{ position: 'absolute', width: '100%', bottom: 0, top: 250 }}>
            <FormField
              title="Email"
              value={email}
              placeholder="Digite seu email"
              handleChangeText={checkEmail}
              msg={emailError}
              isValid={isValidEmail}
              isLoading={isEmailLoading}
              keyboardType="email-address"
            />
            <CustomButton title="Próximo" handlePress={nextStep} isLoading={isEmailLoading} />
          </View>
        )}
        {step === 2 && (
          <View style={{ position: 'absolute', width: '100%', bottom: 0, top: 250 }}>
            <TokenInput
              title="Código de verificação"
              value={token}
              handleChangeText={checkToken}
              msg={tokenError}
              isValid={isValidToken}
              maxLength={4}
            />
            <Text className="text-center text-gray-600 mt-2">Tempo restante: {formatTime(timer)}</Text>
            <CustomButton title="Verificar" handlePress={nextStep} isLoading={isTokenLoading} />
          </View>
        )}
        {step === 3 && (
          <View style={{ position: 'absolute', width: '100%', bottom: 0, top: 200 }}>
            <FormField
              title="Nova Senha"
              value={newPassword}
              placeholder="Digite sua nova senha"
              handleChangeText={checkNewPassword}
              msg={newPasswordError}
              isValid={isValidNewPassword}
              secureTextEntry={true}
            />
            <FormField
              title="Confirmar Nova Senha"
              value={confirmPassword}
              placeholder="Confirme sua nova senha"
              handleChangeText={checkConfirmPassword}
              msg={confirmPasswordError}
              isValid={isValidConfirmPassword}
              secureTextEntry={true}
              maxLength={20}
            />
            <CustomButton title="Redefinir Senha" handlePress={nextStep} />
          </View>
        )}
      </ScrollView>

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