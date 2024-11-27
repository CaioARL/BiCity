import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

// Função para formatar CPF
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// Função para formatar CNPJ
const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '') 
    .replace(/(\d{2})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1/$2') 
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export default function SignUp() {
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [step, setStep] = useState(1);  
  const [emailEditable, setEmailEditable] = useState(false); 

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
      return formatCPF(input); 
    } else {
      return formatCNPJ(input);
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
