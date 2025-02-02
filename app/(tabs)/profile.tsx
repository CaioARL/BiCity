import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomProfile from '../../css/CustomProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthProvider } from '../context/AuthProvider';
import { replace } from 'expo-router/build/global-state/routing';
import { router } from 'expo-router';
import { Usuario } from '../../types';
import { set } from 'zod';

interface DadosdoUsuário {
  id: string;
  nome: string;
  nome_usuario: string;
  endereco: string;
  email: string;
  senha: string;
  dt_criacao: string;
  cpf: string;
  cnpj: string;
}

const nearbyPlaces: DadosdoUsuário[] = [
  {
    id: "1",
    nome: "Bicity",
    nome_usuario: "Bi",
    endereco: "Rua Exemplo, 123",
    email: "exemplo@dominio.com",
    senha: "senha123",
    dt_criacao: "2023-01-01",
    cpf: "123.456.789-00",
    cnpj: "12.345.678/0001-95",
  },
];

const Profile = () => {

  const {onLogout, authState} = useAuthProvider()

  const [usuario, setUsuario] = useState<Usuario | null>(null); //not used but impl for test
    
  const user = nearbyPlaces[0];
  const [image, setImage] = useState(require('../../assets/img/logo-perfil.png'));
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [nome, setNome] = useState(user.nome);
  const [nomeUsuario, setNomeUsuario] = useState(user.nome_usuario);
  const [endereco, setEndereco] = useState(user.endereco);
  const [email, setEmail] = useState(user.email);
  const [cpf, setCpf] = useState(user.cpf);
  const [cnpj, setCnpj] = useState(user.cnpj);
  const [passwordVisible, setPasswordVisible] = useState(false); // Estado para controle da visibilidade da senha


  useEffect(() => {
    if (authState?.user) {
      if(authState.user){
        setUsuario(authState.user);
        setNome(authState.user.nome);
        setNomeUsuario(authState.user.nomeUsuario);
        setEndereco(authState.user.endereco.cidade);
        setEmail(authState.user.email);
        setCpf(authState.user.cpf);
        setCnpj(authState.user.cnpj);
      }
    }
  } 
  , [authState]);



  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setShowMoreInfo(!showMoreInfo);
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(user.dt_criacao); // Formatar a data para o formato desejado


  const handleLogout = () => {
   if(onLogout){
      onLogout()
      .then((respose)=>{
        alert(respose)
      })
      .catch((error)=>{
        alert(error)
      })
      router.replace('sign-in')
   }
  }


  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView >
        <View style={CustomProfile.profileCard}>
          <View style={CustomProfile.topSection}>
            <View style={CustomProfile.imageContainer}>
              {/* <Image source={image} style={CustomProfile.profileImage}  resizeMode="cover"  />
              <TouchableOpacity style={CustomProfile.editButton} onPress={pickImage}>
                <Ionicons name="pencil" size={16} color="#1f2937" />
              </TouchableOpacity>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} /> */}
              <View className='w-[350px] h-[350px] rounded-[350px] border-[3px] border-[white] bg-[white] mr-[10px] items-center'>
                  <Text className='text-[245px]'>{usuario && usuario.nome[0]}</Text>
              </View>
              
            </View>
          </View>
          

          {/*  Editar as informações */}
          <View style={CustomProfile.bottomSection}>
            {isEditing ? (
              <>
                <TextInput
                  style={CustomProfile.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome"
                />
                <TextInput
                  style={CustomProfile.input}
                  value={nomeUsuario}
                  onChangeText={setNomeUsuario}
                  placeholder="Nome de Usuário"
                />
                <TextInput
                  style={CustomProfile.input}
                  value={endereco}
                  onChangeText={setEndereco}
                  placeholder="Endereço"
                />
                <TextInput
                  style={CustomProfile.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="E-mail"
                  editable={false}
                />
                <TextInput
                  style={[CustomProfile.input, { opacity: 2, backgroundColor: '#f0f0f0' }]}
                  value={`${cpf || ''} ${cnpj || ''}`}
                  onChangeText={setCpf}
                  placeholder="CPF/CNPJ"
                  editable={false}
                />

                {/* Campo de Senha */}
                <View style={CustomProfile.passwordInput}>
                  <TextInput
                    style={CustomProfile.input}
                    value={passwordVisible ? user.senha : '●●●●●●●●'}
                    secureTextEntry={!passwordVisible}
                    placeholder="Senha"
                  />
                  <TouchableOpacity
                    style={CustomProfile.eyeIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="#1f2937" />
                  </TouchableOpacity>
                </View>

                {/* Data de Criação */}
                <Text style={CustomProfile.title}>Data de Criação: {formattedDate}</Text>
              </>
            ) : (
              <>
                <Text style={CustomProfile.name}>{nome}</Text>
                <Text style={CustomProfile.title}>@{nomeUsuario}</Text>
              </>
            )}


            <View style={CustomProfile.nivelHabilidadeContainer}>
              <Text style={CustomProfile.nivelHabilidade}>Nível</Text>
              <Ionicons name="star-half-outline" size={20} color="#ffcc00" style={{ marginTop: -5 }} />
            </View>

            {showMoreInfo && (
              <View style={CustomProfile.informaçõesContainer}>
                <Text>Endereço: {endereco}</Text>
                <Text>E-mail: {email}</Text>
                <Text>CPF: {cpf}</Text>
                <Text>CNPJ: {cnpj}</Text>
                <Text>Data de Criação: {formattedDate}</Text>
              </View>
            )}
          </View>

          <View style={CustomProfile.iconSection}>
            <TouchableOpacity style={CustomProfile.iconButton} onPress={toggleEdit}>
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={CustomProfile.button}
            onPress={handleLogout}
          >
            <Text style={{ fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
