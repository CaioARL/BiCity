import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { masks } from '../../util/masks';
import { valid } from '../../util/validationSchemas';
import { getCep } from '../../api/endereco';
import { NivelHabilidade } from '../../types/nivel-habilidade';






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
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [cpfError, setCpfError] = useState('')
  const [isValidCpf, setIsValidCpf] = useState(false)
  const [cnpjError, setCnpjError] = useState('')
  const [isValidCnpj, setIsValidCnpj] = useState(false)

  
  const [nivelHabilidade, setNivelHabilidade] = useState<NivelHabilidade>()

  
  const [step, setStep] = useState(1)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Funções para avançar ou voltar entre as etapas
  const nextStep = () => {
    

    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (password !== confirmPassword) {
        alert('Passwords do not match')
        return
      }
      setStep(3)
    } else if (step === 3) {
      setStep(4)
      
    }
  };

  const prevStep = () => {
    setStep(step - 1)
  }




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
        getCep(cepText , abortControllerRef.current)
          .then((response) => {
            setRua(response.street)
            setBairro(response.neighborhood)
            setCidade(response.city)
            setEstado(response.state)
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



    const checkEmail = () => { 
      const result = valid.emailSchema.safeParse(email)
      setIsValidEmail(result.success)
      if (!result.success) {
        result.error.issues.map((issue) => {
          setEmailError(issue.message)
        })
      } else {
        setEmailError('')
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
          setCpfError(issue.message)
        })
      } else {
        setCpfError('')
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

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className='container'>
        {step === 1 && (
          <View>
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
           
            <CustomButton
              title="Próximo"
              handlePress={nextStep}
            />
          </View>
        )}

        {step === 2 && (
          <View>
        
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
          <View>
            {cpfCnpj.length <= 14 ? (
              <FormField
                title="CPF ou CNPJ"
                value={masks.CPF(cpfCnpj)}
                placeholder="Digite seu CPF"
                msg={cpfError}
                isValid={isValidCpf}
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
          />
          <FormField
            title="Confirmar Senha"
            value={confirmPassword}
            placeholder="Confirme sua senha"
            secureTextEntry={true}
            handleChangeText={setConfirmPassword}
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
          <View>
             <FormField
              title="Email"
              value={masks.EMAIL(email)}
              placeholder="Digite seu email"
              msg={emailError}
              isValid={isValidEmail}
              handleChangeText={setEmail}
              validantionCheck={checkEmail}
            />
            <CustomButton
              title="Submit"
              handlePress={handleSubmit}
            />
            <CustomButton
              title="Back"
              handlePress={prevStep}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
