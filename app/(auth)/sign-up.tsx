import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ImageBackground, Modal, Animated, StyleSheet, BackHandler } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import TokenInput from '../../components/CustomTokenInput';
import { masks } from '../../util/masks';
import { valid } from '../../util/validationSchemas';
import { getViaCep } from '../../api/endereco';
import { NivelHabilidade } from '../../types/nivel-habilidade';
import FormFieldSelectList from '../../components/FormFieldSelectList';
import { getNivelHabilidade } from '../../api/nivel-habilidade';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUser, validateCPF } from '../../api/usuario';
import { CriarUsuarioRequest } from '../../types';
import { checkToken, sendToken } from '../../api/token';
import { useAuthProvider } from '../context/AuthProvider';
import { router, useNavigation } from 'expo-router';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react-native';

interface ListNivelHabilidade {
  nome: string;
  id: number;
  value: NivelHabilidade;
}

type AlertType = 'success' | 'error' | 'loading';

export default function SignUp() {
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [isValidUserName, setIsValidUserName] = useState<boolean | undefined>(undefined);

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [isValidFirstName, setIsValidFirstName] = useState<boolean | undefined>(undefined);

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [isValidLastName, setIsValidLastName] = useState<boolean | undefined>(undefined);

  const [cep, setCep] = useState('');
  const [cepError, setCepError] = useState('');
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isValidCep, setIsValidCep] = useState<boolean | undefined>(undefined);
  
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');

  const [numero, setNumero] = useState('');
  const [numberError, setNumberError] = useState('');
  const [isValidNumber, setIsValidNumber] = useState<boolean | undefined>(undefined);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState<boolean | undefined>(undefined);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isValidPassword, setIsValidPassword] = useState<boolean | undefined>(undefined);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState<boolean | undefined>(undefined);

  const [cpfCnpj, setCpfCnpj] = useState('');
  const [cpfCnpjError, setCpfCnpjError] = useState('');
  const [isCpfLoading, setIsCpfLoading] = useState(false);
  const [isValidCpfCnpj, setIsValidCpfCnpj] = useState<boolean | undefined>(undefined);
  //const [cnpjError, setCnpjError] = useState('')
  //const [isValidCnpj, setIsValidCnpj] = useState(false)


  const [codigo, setCodigo] = useState('');
  const [codigoError, setCodigoError] = useState('');
  const [isValidCodigo, setIsValidCodigo] = useState<boolean | undefined>(undefined);
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false);
  const [isCodigoLoading, setIsCodigoLoading] = useState(false);
  
  const [habilidade, setHabilidade] = useState<NivelHabilidade>({ id: 0, nome: '', descricao: '' });
  const [listNivelHabilidade, setListNivelHabilidade] = useState<ListNivelHabilidade[]>([]);
  const [nivelHabilidadeError, setNivelHabilidadeError] = useState('');
  const [isValidHabilidade, setIsValidHabilidade] = useState<boolean | undefined>(undefined);

  const [step, setStep] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const { onRegister } = useAuthProvider();
  const navigation = useNavigation();
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

  useEffect(() => {
    getNivelHabilidade()
      .then((response) => {
        const niveles: ListNivelHabilidade[] = response.map(nivel => ({
          nome: nivel.nome,
          id: nivel.id,
          value: nivel,
        }));
        setListNivelHabilidade(niveles);
      })
      .catch((response) => {
        setNivelHabilidadeError('Erro ao carregar níveis de habilidade: ' + response.message);
      });
  }, []);

  // Handler para voltar com botão físico ou gesto
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 1) {
        router.replace('/sign-in'); // Volta para a tela de login na primeira etapa
        return true;
      } else if (step === 5) {
        router.replace('/sign-in'); // Na última etapa, vai para "Sign" sem voltar etapas
        return true;
      } else {
        prevStep(); // Volta uma etapa nas etapas intermediárias
        return true;
      }
    });

    return () => backHandler.remove();
  }, [step]);

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
        { value: firstName, setError: setFirstNameError, check: () => checkFirstName(firstName) },
        { value: lastName, setError: setLastNameError, check: () => checkLastName(lastName) },
        { value: userName, setError: setUserNameError, check: () => checkUsername(userName) },
      ];
      const allFilled = validateRequiredFields(fields);
      const habilidadeValida = habilidade.id !== 0;
      if (!allFilled || !habilidadeValida || !isValidFirstName || !isValidLastName || !isValidUserName) {
        if (!habilidadeValida) {
          setNivelHabilidadeError('Selecione um nível de habilidade');
          setIsValidHabilidade(false);
        } else {
          setNivelHabilidadeError(''); 
          setIsValidHabilidade(true); 
        }
        showAlert('error', 'Preencha todos os campos corretamente');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const fields = [
        { value: cep, setError: setCepError, check: () => checkCep(cep) },
        { value: numero, setError: setNumberError, check: () => checkNumber(numero) },
      ];
      if (!validateRequiredFields(fields) || !isValidCep || !isValidNumber) {
        showAlert('error', 'Preencha todos os campos corretamente');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const fields = [
        { value: cpfCnpj, setError: setCpfCnpjError, check: () => checkCpfCnpj(cpfCnpj) },
        { value: password, setError: setPasswordError, check: () => checkPassword(password) },
        { value: confirmPassword, setError: setConfirmPasswordError, check: () => checkConfirmPassword(confirmPassword) },
      ];
      if (!validateRequiredFields(fields) || !isValidCpfCnpj || !isValidPassword || !isValidConfirmPassword || password !== confirmPassword) {
        if (password !== confirmPassword) setConfirmPasswordError('As senhas não coincidem');
        showAlert('error', 'Preencha todos os campos corretamente');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      const fields = [{ value: email, setError: setEmailError, check: () => checkEmail(email) }];
      if (!validateRequiredFields(fields) || !isValidEmail) {
        showAlert('error', 'Preencha todos os campos corretamente');
        return;
      }
      setIsEmailCodeLoading(true);
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      sendToken(email, abortControllerRef.current as AbortController)
        .then((response) => {
          showAlert('success', `${response} Verifique seu email.`);
          setStep(5);
        })
        .catch((response) => {
          showAlert('error', 'Erro ao enviar código: ' + response.message);
        })
        .finally(() => setIsEmailCodeLoading(false));
    } else if (step === 5) {
      const fields = [{ value: codigo, setError: setCodigoError, check: () => checkCodigo(codigo) }];
      if (!validateRequiredFields(fields) || !isValidCodigo) {
        showAlert('error', 'Preencha todos os campos corretamente');
        return;
      }
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step === 1 || step === 5) {
      router.replace('/sign-in'); // Ajustado para corresponder ao caminho padrão
    } else if (step > 1 && step < 5) {
      setStep(step - 1);
    }
  };

  // Funções de validação ajustadas
  const checkUsername = (text: string) => {
    setUserName(text);
    const result = valid.usernameSchema.safeParse(text);
    setIsValidUserName(text.trim() ? result.success : undefined);
    setUserNameError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const checkFirstName = (text: string) => {
    setFirstName(text);
    const result = valid.nameSchema.safeParse(text);
    setIsValidFirstName(text.trim() ? result.success : undefined);
    setFirstNameError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const checkLastName = (text: string) => {
    setLastName(text);
    const result = valid.nameSchema.safeParse(text);
    setIsValidLastName(text.trim() ? result.success : undefined);
    setLastNameError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const checkCep = (text: string) => {
    setCep(text);
    const cepText = text.replace('-', '');
    const result = valid.cepSchemaRegex.safeParse(cepText);
    setIsValidCep(text.trim() ? result.success : undefined);
    if (text.trim() && !result.success) {
      setCepError(result.error.issues[0].message);
    } else if (text.trim()) {
      setIsCepLoading(true);
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      getViaCep(cepText, abortControllerRef.current as AbortController)
        .then((response) => {
          // Verifica se os campos obrigatórios estão vazios
          if (!response.localidade || !response.estado || !response.logradouro || !response.bairro) {
            setCepError('CEP inválido: informações incompletas');
            setIsValidCep(false);
            setRua('');
            setBairro('');
            setCidade('');
            setEstado('');
          } else {
            setRua(response.logradouro);
            setBairro(response.bairro);
            setCidade(response.localidade);
            setEstado(response.estado);
            setCepError('');
            setIsValidCep(true);
          }
        })
        .catch((response) => {
          setCepError('CEP inválido ou não encontrado');
          setIsValidCep(false);
          setRua('');
          setBairro('');
          setCidade('');
          setEstado('');
        })
        .finally(() => setIsCepLoading(false));
    } else {
      setCepError('');
    }
  };
  const checkNumber = (text: string) => {
    setNumero(text);
    const result = valid.houseNumberSchema.safeParse(text);
    setIsValidNumber(text.trim() ? result.success : undefined);
    setNumberError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const checkCpfCnpj = (text: string) => {
    if (text.length <= 14) {
      setCpfCnpj(masks.CPF(text));
      const cpfText = text.replace(/\.|-/g, '');
      const result = valid.cpfSchema.safeParse(cpfText);
      setIsValidCpfCnpj(text.trim() ? result.success : undefined);
      if (text.trim() && !result.success) {
        setCpfCnpjError(result.error.issues[0].message);
      } else if (text.trim()) {
        setIsCpfLoading(true);
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        validateCPF(cpfText, abortControllerRef.current as AbortController)
          .then(() => {
            setCpfCnpjError('');
            setIsValidCpfCnpj(true);
          })
          .catch((response) => {
            setCpfCnpjError(response);
            setIsValidCpfCnpj(false);
          })
          .finally(() => setIsCpfLoading(false));
      } else {
        setCpfCnpjError('');
      }
    } else {
      setCpfCnpj(masks.CNPJ(text));
      const cnpjText = text.replace(/\.|\/|-/g, '');
      const result = valid.cnpjSchema.safeParse(cnpjText);
      setIsValidCpfCnpj(text.trim() ? result.success : undefined);
      setCpfCnpjError(text.trim() && !result.success ? result.error.issues[0].message : '');
    }
  };

  const checkPassword = (text: string) => {
    setPassword(text);
    const result = valid.passwordSchema.safeParse(text);
    setIsValidPassword(text.trim() ? result.success : undefined);
    setPasswordError(text.trim() && !result.success ? result.error.issues[0].message : '');
    if (confirmPassword) checkConfirmPassword(confirmPassword);
  };

  const checkConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    const result = valid.passwordSchema.safeParse(text);
    const passwordsMatch = password === text;
    setIsValidConfirmPassword(text.trim() ? result.success && passwordsMatch : undefined);
    setConfirmPasswordError(text.trim() ? (result.success ? (passwordsMatch ? '' : 'As senhas não coincidem') : result.error.issues[0].message) : '');
  };

  const checkEmail = (text: string) => {
    setEmail(text);
    const result = valid.emailSchema.safeParse(text);
    setIsValidEmail(text.trim() ? result.success : undefined);
    setEmailError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const checkCodigo = (text: string) => {
    setCodigo(text);
    const result = valid.codeUserValidationSchema.safeParse(text);
    setIsValidCodigo(text.trim() ? result.success : undefined);
    setCodigoError(text.trim() && !result.success ? result.error.issues[0].message : '');
  };

  const handleSubmit = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setIsCodigoLoading(true);
    checkToken(codigo, email, abortControllerRef.current as AbortController)
      .then(() => {
        const novoUsuario: CriarUsuarioRequest = {
          nome: firstName + ' ' + lastName,
          nomeUsuario: userName,
          endereco: { cep, estado, cidade, bairro, rua, numero: parseInt(numero) },
          email,
          senha: password,
          cpf: cpfCnpj.length <= 14 ? cpfCnpj.replace(/\.|-/g, '') : '',
          cnpj: cpfCnpj.length > 14 ? cpfCnpj.replace(/\.|\/|-/g, '') : '',
          nivelHabilidade: habilidade.id,
        };
        createUser(novoUsuario, abortControllerRef.current as AbortController)
          .then((response) => {
            if (onRegister) {
              onRegister(response)
                .then(() => {
                  showAlert('success', 'Cadastro realizado com sucesso!');
                  router.replace('home');
                })
                .catch((response) => {
                  showAlert('error', 'Erro ao registrar na memória: ' + response.message);
                });
            }
          })
          .catch((response) => {
            showAlert('error', 'Erro ao cadastrar: ' + response.message);
          });
      })
      .catch((response) => {
        showAlert('error', 'Erro ao validar código: ' + response.message);
      })
      .finally(() => setIsCodigoLoading(false));
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
                  value={firstName}
                  placeholder="Digite seu primeiro nome"
                  handleChangeText={checkFirstName}
                  msg={firstNameError}
                  isValid={isValidFirstName}
                />
                <FormField
                  title="Último Nome"
                  value={lastName}
                  placeholder="Digite seu último nome"
                  handleChangeText={checkLastName}
                  msg={lastNameError}
                  isValid={isValidLastName}
                />
                <FormField
                  title="Username"
                  value={userName}
                  placeholder="Digite seu username"
                  handleChangeText={checkUsername}
                  msg={userNameError}
                  isValid={isValidUserName}
                />
                <FormFieldSelectList
                  title="Nível de habilidade"
                  selectedValue={habilidade}
                  options={listNivelHabilidade}
                  handleChange={setHabilidade}
                  msg={nivelHabilidadeError}
                  isValid={isValidHabilidade}
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
                  value={masks.CEP(cep)}
                  placeholder="Digite seu CEP"
                  handleChangeText={checkCep}
                  msg={cepError}
                  isValid={isValidCep}
                  isLoading={isCepLoading}
                  maxLength={9}
                  keyboardType="numeric"
                />
                <FormField
                  title="Cidade"
                  value={cidade}
                  placeholder="Digite sua Cidade"
                  handleChangeText={setCidade}
                  disableEdit={true}
                />
                <FormField
                  title="Estado"
                  value={estado}
                  placeholder="Digite seu Estado"
                  handleChangeText={setEstado}
                  disableEdit={true}
                />
                <FormField
                  title="Rua"
                  value={rua}
                  placeholder="Digite sua rua"
                  handleChangeText={setRua}
                  disableEdit={true}
                />
                <FormField
                  title="Número"
                  value={numero}
                  placeholder="Digite seu número"
                  handleChangeText={checkNumber}
                  msg={numberError}
                  isValid={isValidNumber}
                />
                <FormField
                  title="Bairro"
                  value={bairro}
                  placeholder="Digite seu bairro"
                  handleChangeText={setBairro}
                  disableEdit={true}
                />
                <CustomButton title="Próximo" handlePress={nextStep} />
              </View>
              </>
            )}
            {step === 3 && (
              <>
               <View style={{position: 'absolute', width: '100%', bottom: 0, top: 170}}>
               {cpfCnpj.length <= 14 ? (
                    <FormField
                      title="CPF ou CNPJ"
                      value={masks.CPF(cpfCnpj)}
                      placeholder="Digite seu CPF"
                      handleChangeText={checkCpfCnpj}
                      msg={cpfCnpjError}
                      isValid={isValidCpfCnpj}
                      isLoading={isCpfLoading}
                      keyboardType="numeric"
                      maxLength={18}
                    />
                  ) : ( 
                    <FormField
                    title="CNPJ"
                    value={masks.CNPJ(cpfCnpj)}
                    placeholder="Digite seu CNPJ"
                    handleChangeText={checkCpfCnpj}
                    msg={cpfCnpjError}
                    isValid={isValidCpfCnpj}
                    isLoading={isCpfLoading}
                    keyboardType="numeric"
                    maxLength={18}
                  />
                  )  
                }
                
                <FormField
                  title="Senha"
                  value={password}
                  placeholder="Digite sua senha"
                  handleChangeText={checkPassword}
                  msg={passwordError}
                  isValid={isValidPassword}
                  secureTextEntry={true}
                />
                <FormField
                  title="Confirmar Senha"
                  value={confirmPassword}
                  placeholder="Confirme sua senha"
                  handleChangeText={checkConfirmPassword}
                  msg={confirmPasswordError}
                  isValid={isValidConfirmPassword}
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
                  value={masks.EMAIL(email)}
                  placeholder="Digite seu email"
                  handleChangeText={checkEmail}
                  msg={emailError}
                  isValid={isValidEmail}
                  isLoading={isEmailCodeLoading}
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
                  handleChangeText={checkCodigo}
                  msg={codigoError}
                  isValid={isValidCodigo}
                  maxLength={4}
                />
                <CustomButton title="Confirmar Código" isLoading={isCodigoLoading} handlePress={nextStep} />
              </View>
              </>
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