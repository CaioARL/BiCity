import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomProfile from '../../components/CustomProfile';

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

  return (
    <ScrollView>
      <View style={CustomProfile.profileCard}>
        <View style={CustomProfile.topSection}>
          <View style={CustomProfile.imageContainer}>
            <Image source={image} style={CustomProfile.profileImage}  resizeMode="cover"  />
            <TouchableOpacity style={CustomProfile.editButton} onPress={pickImage}>
              <Ionicons name="pencil" size={16} color="#1f2937" />
            </TouchableOpacity>
            <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} />
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
      </View>
    </ScrollView>
  );
};

export default Profile;
