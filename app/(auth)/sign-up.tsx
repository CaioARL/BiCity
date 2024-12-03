import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { masks } from '../../util/masks';
import { valid } from '../../util/validationSchemas';
import { getCep } from '../../api/external-api';




export default function SignUp() {
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')	
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [step, setStep] = useState(1)
  const [emailEditable, setEmailEditable] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Funções para avançar ou voltar entre as etapas
  const nextStep = () => {
    if (step === 1) {
      if (email.trim() === '') {
        alert('Please enter a valid email');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Função de mudança de texto para aplicar a formatação de CPF/CNPJ
  const handleCpfCnpjChange = (text: string) => {
    setCpfCnpj(text);
  };

  // Função para formatar CPF ou CNPJ após a atualização do campo
  const formatInput = (input: string) => {
    if (input.length <= 14) {
      return masks.CPF(input); 
    } else {
      return masks.CNPJ(input);
    }
  };



  


  // Função para formatar CEP
  const handleCepChange = (text: string) => {
    const cepText = text.replace('-','')
    console.log("TEXT ", text)
    console.log("CEPTEXT ", cepText)

    const result = valid.cepSchema.safeParse(cepText) 
      
      if (result.success) {
        console.log('CEP válido:', text)
        setCep(cepText)
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
          getCep(cepText , abortControllerRef.current)
            .then((response) => {
              console.log(response)
              console.log(response.street)
              setRua(response.street)
              setBairro(response.neighborhood)
              setCidade(response.city)
              setEstado(response.state)
            })
            .catch((error) => {

            })
            .finally(() => {
            })
        
      } else {
        // setErrorMapCep(result.error.message)
        
        setCep(text);
        console.log('CEP inválido:', text)
      }


  };


  // Função para alternar entre editar e salvar o email
  const toggleEmailEditable = () => {
    if (emailEditable) {
      // Salvar email (aqui você pode adicionar lógica para salvar, se necessário) - ATENÇÃO: Fazer animação depois de salvar
      console.log('Email salvo:', email);
    }
    setEmailEditable(!emailEditable);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className='container'>
        {step === 1 && (
          <View>
            <FormField
              title="Email"
              value={email}
              placeholder="Digite seu email"
              handleChangeText={setEmail}
            />
            <CustomButton
              title="Next"
              handlePress={nextStep}
            />
          </View>
        )}

        {step === 2 && (
          <View>
            <FormField
              title="CPF ou CNPJ"
              value={formatInput(cpfCnpj)}  
              placeholder="Digite seu CPF ou CNPJ"
              handleChangeText={handleCpfCnpjChange}  
            />
            <FormField
              title='CEP'
              value={masks.CEP(cep)}
              placeholder='Digite seu CEP'
              handleChangeText={handleCepChange}
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

        {step === 3 && (
          <View>
          <FormField
            title="CPF ou CNPJ"
            value={formatInput(cpfCnpj)}  
            placeholder="Digite seu CPF ou CNPJ"
            handleChangeText={handleCpfCnpjChange}  
          />
          <FormField
            title="Email"
            value={email}  
            placeholder="Digite seu email"
            handleChangeText={setEmail}  
            editable={emailEditable} 
          />
          <TouchableOpacity onPress={toggleEmailEditable}>
            <Text style={{ color: '#007BFF', marginLeft: 10 }}>
              {emailEditable ? 'Salvar' : 'Editar'}
            </Text>
          </TouchableOpacity>
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
              title="Primeiro Nome"
              value={firstName}
              placeholder="Digite seu primeiro nome"
              handleChangeText={setFirstName}
            />
            <FormField
              title="Último Nome"
              value={lastName}
              placeholder="Digite seu último nome"
              handleChangeText={setLastName}
            />
            <CustomButton
              title="Submit"
              handlePress={() => console.log('Form submitted')}
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
