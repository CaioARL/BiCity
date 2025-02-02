import React, { useEffect, useRef, useState} from 'react';
import { ScrollView, View, Text, TouchableOpacity, ImageBackground  } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { masks } from '../../util/masks';
import { valid } from '../../util/validationSchemas';
import { getCep, getViaCep } from '../../api/endereco';
import { NivelHabilidade } from '../../types/nivel-habilidade';
import FormFieldSelectList from '../../components/FormFieldSelectList';
import { getNivelHabilidade } from '../../api/nivel-habilidade';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUser, validateCPF } from '../../api/usuario';
import { CriarUsuarioRequest } from '../../types';
import { checkToken, sendToken } from '../../api/token';
import { useAuthProvider } from '../context/AuthProvider';
import { router } from 'expo-router';

interface ListNivelHabilidade {
  nome: string
  id: number
  value: NivelHabilidade
}

export default function SignUp() {
  const [userName, setUserName] = useState('')
  const [userNameError, setUserNameError] = useState('')
  const [isValidUserName, setIsValidUserName] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [fristNameError, setFirstNameError] = useState('')
  const [isValidFirstName, setIsValidFirstName] = useState(false)

  const [lastName, setLastName] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [isValidLastName, setIsValidLastName] = useState(false)

  const [cep, setCep] = useState('')
  const [cepError, setCepError ] = useState('')
  const [isCepLoading, setIsCepLoading] = useState(false)
  const [isValidCep, setIsValidCep] = useState(false)
  
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [bairro, setBairro] = useState('')
  const [rua, setRua] = useState('')	

  const [numero, setNumero] = useState('')
  const [numberError, setNumberError] = useState('')
  const [isValidNumber, setIsValidNumber] = useState(false)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isValidPassword, setIsValidPassword] = useState(false)
  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false)
  
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [cpfError, setCpfError] = useState('')
  const [isCpfLoading, setIsCpfLoading] = useState(false)
  const [isValidCpf, setIsValidCpf] = useState(false)
  const [cnpjError, setCnpjError] = useState('')
  const [isValidCnpj, setIsValidCnpj] = useState(false)
  
  
  
  const [codigo, setCodigo] = useState('')
  const [codigoError, setCodigoError] = useState('')
  const [isValidCodigo, setIsValidCodigo] = useState(false)
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false)
  const [isCodigoLoading, setIsCodigoLoading] = useState(false)	


  
  const [habilidade, setHabilidade] = useState<NivelHabilidade>({id: 1, nome: '', descricao: ''})
  const [listNivelHabilidade, setListNivelHabilidade] = useState<ListNivelHabilidade[]>([])
  const [nivelHabilidadeError, setNivelHabilidadeError] = useState('')
 
  
  const [step, setStep] = useState(1)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { onRegister } = useAuthProvider()



  const backgroundImage = require('../../assets/img/background-fundo-figura.png'); 

  // Funções para avançar ou voltar entre as etapas
  const nextStep = () => {
    if (step === 1) {
      /*
      First name
      Last name
      Username
      Nivel habilidade

      */
      if (!isValidFirstName || !isValidLastName || !isValidUserName || !habilidade) {
        alert('Preencha todos os campos corretamente')
        return
      }

      setStep(2)
    } else if (step === 2) {
      /*
      CEP
      Cidade
      Estado
      Rua
      Numero
      Bairro
      */
      if (!isValidCep || !isValidNumber) {
        alert('Preencha todos os campos corretamente')
        return
      }


      setStep(3)
    } else if (step === 3) {
      /* 
      CPF ou CNPJ
      Senha
      Confirmar senha
      */
      if (!isValidCpf && !isValidCnpj || !isValidPassword || !isValidConfirmPassword) {
        alert('Preencha todos os campos corretamente')
        return
      }

      if (password !== confirmPassword) {
        alert('As senhas não são iguais')
        return
      }


      setStep(4)
    } else if (step === 4) {  

        if (!isValidEmail) {
          alert('Preencha todos os campos corretamente')
          return
        }
        setIsEmailCodeLoading(true)
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        sendToken(email, abortControllerRef.current)
        .then((response) => {
          alert(response + ' Verifique seu email.')
          setStep(5)
          


        })
        .catch(
          (response) => {
            alert('Erro ao enviar código: '+ response.message)
          }
        )
        .finally(() => {
          setIsEmailCodeLoading(false)

        })



    
    } else if (step === 5) {
      if (!isValidCodigo) {
        alert('Preencha todos os campos corretamente')
        return
      }
      handleSubmit()
    }



  };

  const prevStep = () => {
    setStep(step - 1)
  }


  
  useEffect(() => {
    getNivelHabilidade()
    .then((response) => {
      setListNivelHabilidade([])
      response.map((nivel) => {
        setListNivelHabilidade((prevList) => {
          return [
            ...prevList,
            {
              nome: nivel.nome,
              id: nivel.id,
              value: nivel
            }
          ]
        })
      })
    }
  )
  .catch((response) => { 
    setNivelHabilidadeError('Erro ao carregar niveis de habilidade: '+ response.message)
  })

  }, [])


  const checkUsername = () => { 
    const result = valid.usernameSchema.safeParse(userName)   
    setIsValidUserName(result.success)
    if(!result.success)
      {
        result.error.issues.map((issue) => {
          setUserNameError(issue.message)
        })
      }else{
        setUserNameError('')
      }  
  }  
  
  const handleSubmit = () => {

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    setIsCodigoLoading(true)
    checkToken(codigo, email, abortControllerRef.current)
    .then(() => {
      const novoUsuario: CriarUsuarioRequest = {
        nome: firstName + ' ' + lastName,
        nomeUsuario: userName,
        endereco: {
          cep: cep,
          estado: estado,
          cidade: cidade,
          bairro: bairro,
          rua: rua,
          numero: parseInt(numero)
        },
        email: email,
        senha: password,
        cpf: cpfCnpj.length <= 14 ? cpfCnpj : '',
        cnpj: cpfCnpj.length > 14 ? cpfCnpj : '',
        nivelHabilidade: habilidade.id
      }
  
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      createUser(novoUsuario, abortControllerRef.current)
      .then((response) => {
        if(onRegister){
          onRegister(response)
          .then((response) => {
            alert(response)
            router.replace('home')
          })
          .catch((response) => {
            alert('Erro ao registrar na memoria: '+ response.message)
          })

        }
      })
      .catch((response) => {
        alert('Erro ao cadastrar: '+ response.message)
      })


    })
    .catch((response) => {
      alert('Erro ao validar código: '+ response.message)
    })
    .finally(() => {
      setIsCodigoLoading(false)
    })




  }

  // Função para formatar CEP
  const checkCep = () => {
    const cepText = cep.replace('-','')
    const result = valid.cepSchemaRegex.safeParse(cepText)
    
    setIsValidCep(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setCepError(issue.message)
      })
    } else {
        setIsCepLoading(true)
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        getViaCep(cepText , abortControllerRef.current)
          .then((response) => {
            setRua(response.logradouro)
            setBairro(response.bairro)
            setCidade(response.localidade)
            setEstado(response.estado)
            setCepError('')   
          })
          .catch((response) => {
            setCepError('CEP não encontrado: '+ response.message)
          })
          .finally(() => {
            setIsCepLoading(false)
          })
    }
  }



  const checkEmail = () =>{
    const result = valid.emailSchema.safeParse(email)
    setIsValidEmail(result.success)
    if(!result.success){
      result.error.issues.map((issue) => {
        setEmailError(issue.message)
      })
    } else {
      setEmailError('')
    }
  }


  const checkCodigo = () => {
    const result = valid.codeUserValidationSchema.safeParse(codigo)
    setIsValidCodigo(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setCodigoError(issue.message)
      })
    } else {
      setCodigoError('')
    } 
  }





  const checkFirstName = () => { 
    const result = valid.nameSchema.safeParse(firstName)
    setIsValidFirstName(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setFirstNameError(issue.message)
      })
    } else {
      setFirstNameError('')
    } 
  }
  const checkLastName = () => { 
    const result = valid.nameSchema.safeParse(lastName)
    setIsValidLastName(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setLastNameError(issue.message)
      })
    } else {
      setLastNameError('')
    } 
  }

  const checkNumber = () => {
    const result = valid.houseNumberSchema.safeParse(numero)
    setIsValidNumber(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setNumberError(issue.message)
      })
    } else {
      setNumberError('')
    } 
  }

  const checkCpf = () => {
    const cpfText = cpfCnpj.replace('.','').replace('.','').replace('-','')
    const result = valid.cpfSchema.safeParse(cpfText)
    setIsValidCpf(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setCepError(issue.message)
      })
    } else {
      setIsCpfLoading(true)
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      validateCPF(cpfCnpj, abortControllerRef.current)
      .then(() => {
        setCepError('')
      })
      .catch((response) => {
        setCepError(response)
      })
      .finally(() => {
        setIsCpfLoading(false)
      })
    } 
  }

  const checkCnpj = () => {
    const cnpjText = cpfCnpj.replace('.','').replace('.','').replace('/','').replace('-','')
    const result = valid.cnpjSchema.safeParse(cnpjText)
    setIsValidCnpj(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setCnpjError(issue.message)
      })
    } else {
      setCnpjError('')
    } 
  }

  const checkPassword = () => {
    const result = valid.passwordSchema.safeParse(password)
    setIsValidPassword(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setPasswordError(issue.message)
      })
    } else {
      setPasswordError('')
    } 
  }

  const checkConfirmPassword = () => {
    const result = valid.passwordSchema.safeParse(confirmPassword)
    setIsValidConfirmPassword(result.success)
    if (!result.success) {
      result.error.issues.map((issue) => {
        setConfirmPasswordError(issue.message)
      })
    } else {
      setConfirmPasswordError('')
    } 
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
      <ImageBackground 
        source={backgroundImage} 
        style={{ flex: 1, position: 'absolute', width: '100%', top: 0, height: 335 }}
        resizeMode="cover"
      />

      <ScrollView className='container' contentContainerStyle={{ flexGrow: 1 }}>
        {step === 1 && (
          <View className="flex-1 justify-center">
            <FormField
              title="Primeiro Nome"
              value={firstName}
              placeholder="Digite seu primeiro nome"
              handleChangeText={setFirstName}
              msg={fristNameError}
              isValid={isValidFirstName}
              validantionCheck={checkFirstName}
            />
            <FormField
              title="Último Nome"
              value={lastName}
              placeholder="Digite seu último nome"
              handleChangeText={setLastName}
              msg={lastNameError}
              isValid={isValidLastName}
              validantionCheck={checkLastName}
            />
           
            <FormField
              title="Username"
              value={userName}
              placeholder="Digite seu username"
              handleChangeText={setUserName}
              msg={userNameError}
              isValid={isValidUserName}
              validantionCheck={checkUsername}
            />

            <FormFieldSelectList
              title='Nivel de habilidade'
              selectedValue={habilidade}
              options={listNivelHabilidade}
              handleChange={setHabilidade}
              msg={nivelHabilidadeError}
            />
           
            <CustomButton
              title="Próximo"
              handlePress={nextStep}
            />
          </View>
        )}

        {step === 2 && (
          <View className="flex-1 justify-center">
        
            <FormField
              title='CEP'
              value={masks.CEP(cep)}
              placeholder='Digite seu CEP'
              msg={cepError}
              handleChangeText={setCep}
              isLoading={isCepLoading}
              isValid={isValidCep}
              validantionCheck={checkCep}
              maxLength={9}
            />
            <FormField
              title='Cidade'
              value={cidade}
              placeholder='Digite sua Cidade'
              handleChangeText={setCidade}
              disableEdit={true}
            />
            <FormField
              title='Estado'
              value={estado}
              placeholder='Digite seu Estado'
              handleChangeText={setEstado}
              disableEdit={true}
            />
            <FormField
              title='Rua'
              value={rua}
              placeholder='Digite seu rua'
              handleChangeText={setRua}
              disableEdit={true}
            />
            <FormField
              title='Numero'
              value={numero}
              placeholder='Digite seu numero'
              handleChangeText={setNumero}
              msg={numberError}
              isValid={isValidNumber}
              validantionCheck={checkNumber}
            />
            <FormField
              title='Bairro'
              value={bairro}
              placeholder='Digite seu bairro'
              handleChangeText={setBairro}
              disableEdit={true}
            />


            <CustomButton
              title="Próximo"
              handlePress={nextStep}
            />
            <CustomButton
              title="Back"
              handlePress={prevStep}
            />
          </View>
        )}

        {step === 3 && (
          <View className="flex-1 justify-center">
            {cpfCnpj.length <= 14 ? (
              <FormField
                title="CPF ou CNPJ"
                value={masks.CPF(cpfCnpj)}
                placeholder="Digite seu CPF"
                msg={cpfError}
                isValid={isValidCpf}
                isLoading={isCpfLoading}
                handleChangeText={setCpfCnpj}
                validantionCheck={checkCpf}
              />
            ) : (
              <FormField
                title="CNPJ"
                value={masks.CNPJ(cpfCnpj)}
                placeholder="Digite seu CNPJ"
                msg={cnpjError}
                isValid={isValidCnpj}
                handleChangeText={setCpfCnpj}
                validantionCheck={checkCnpj}
                maxLength={18}
              />
            )  
          }
          
          <FormField
            title="Senha"
            value={password}
            placeholder="Digite sua senha"
            secureTextEntry={true}
            handleChangeText={setPassword}
            msg={passwordError}
            isValid={isValidPassword}
            validantionCheck={checkPassword}
          />
          <FormField
            title="Confirmar Senha"
            value={confirmPassword}
            placeholder="Confirme sua senha"
            secureTextEntry={true}
            handleChangeText={setConfirmPassword}
            msg={confirmPasswordError}
            isValid={isValidConfirmPassword}
            validantionCheck={checkConfirmPassword}
            maxLength={20}
          />
          <CustomButton
            title="Next"
            handlePress={nextStep}
          />
          <CustomButton
            title="Back"
            handlePress={prevStep}
          />
          </View>
        )}

        {step === 4 && (
          <View className="flex-1 justify-center">
             <FormField
              title="Email"
              value={masks.EMAIL(email)}
              placeholder="Digite seu email"
              msg={emailError}
              isValid={isValidEmail}
              handleChangeText={setEmail}
              validantionCheck={checkEmail}
              isLoading={isEmailCodeLoading}
            />
            <CustomButton
              title="Next"
              handlePress={ nextStep }
            />
            <CustomButton
              title="Back"
              handlePress={prevStep}
            />
          </View>
        )}

        {step === 5 && (
          <View className="flex-1 justify-center">
            <FormField
              title="Código de confirmação"
              value={masks.CODIGO(codigo)}
              placeholder="Digite o código de confirmação"
              msg={codigoError}
              isValid={isValidCodigo}
              handleChangeText={setCodigo}
              validantionCheck={checkCodigo}
              maxLength={4}
            />
            
            <CustomButton
              title="Confirma Código"
              isLoading={isCodigoLoading}
              handlePress={nextStep}
            />
          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}
