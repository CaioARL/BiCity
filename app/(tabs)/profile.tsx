import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomProfile from '../../css/CustomProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthProvider } from '../context/AuthProvider';
import { router } from 'expo-router';
import { Usuario } from '../../types';
import { useTheme } from '../context/ThemeProvider';
import tailwindConfig from '../../tailwind.config';
import { useTabBar } from '../context/TabBarContext'; 
import { withSpring } from 'react-native-reanimated';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

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
  const { theme } = useTheme();
  const { onLogout, authState } = useAuthProvider();
  const { tabBarOffset } = useTabBar();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (authState?.user) {
      if (authState.user) {
        setUsuario(authState.user);
        setNome(authState.user.nome);
        setNomeUsuario(authState.user.nomeUsuario);
        setEndereco(authState.user.endereco.cidade);
        setEmail(authState.user.email);
        setCpf(authState.user.cpf);
        setCnpj(authState.user.cnpj);
      }
    }
  }, [authState]);

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

  const formatCPF = (cpf: string) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cleaned;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return '';
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return cleaned;
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formattedDate = formatDate(user.dt_criacao);

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
        .then((response) => {
          alert(response);
        })
        .catch((error) => {
          alert(error);
        });
      router.replace('sign-in');
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY > lastScrollY && currentScrollY > 0) {
      tabBarOffset.value = withSpring(30, { damping: 20, stiffness: 100 });
    } else if (currentScrollY < lastScrollY) {
      tabBarOffset.value = withSpring(0, { damping: 20, stiffness: 100 });
    }
    setLastScrollY(currentScrollY);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme === 'dark' ? colors.secondary_black || '#1f2937' : colors.white || '#FFF',
        flex: 1,
      }}
    >
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 107 }}>
        <View
          style={{
            ...CustomProfile.profileCard,
            backgroundColor: theme === 'dark' ? colors.secondary_black || '#1f2937' : colors.white || '#FFF',
            shadowColor: theme === 'dark' ? '#FFF' : '#000',
          }}
        >
          <View
            style={{
              ...CustomProfile.topSection,
              backgroundColor: theme === 'dark' ? colors.primary_green : colors.primary_green
            }}
          >
            <View style={CustomProfile.imageContainer}>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} />

               {/* <Image source={image} style={CustomProfile.profileImage}  resizeMode="cover"  />
              <TouchableOpacity style={CustomProfile.editButton} onPress={pickImage}>
                <Ionicons name="pencil" size={16} color="#1f2937" />
              </TouchableOpacity>
              <Image source={require('../../assets/greengradient.png')} style={CustomProfile.gradientOverlay} /> */}
              <View
                className={`w-[350px] h-[350px] rounded-[350px] border-[3px] border-white mr-[10px] items-center shadow-md ${
                  theme === 'dark' ? 'bg-[#1f2937]' : 'bg-white'
                }`}
              >
                <Text className={`text-[250px] ${theme === 'dark' ? 'color-white' : 'color-secondary_black'}`}>
                  {usuario && usuario.nome[0].toUpperCase()}
                </Text>

                <TouchableOpacity style={{...CustomProfile.editButton, backgroundColor: theme === 'dark' ?  colors.secondary_black : colors.primary_green }} onPress={pickImage} >
                 <Ionicons name="pencil" size={16} style={{marginLeft: 2, color: theme === 'dark' ? 'white' : 'secondary_black' }}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={CustomProfile.bottomSection}>
            {isEditing ? (
              <>
                <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome"
                />
                <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={nomeUsuario}
                  onChangeText={setNomeUsuario}
                  placeholder="Nome de Usuário"
                />
                <TextInput
                  style={{
                    ...CustomProfile.input,
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                  }}
                  value={endereco}
                  onChangeText={setEndereco}
                  placeholder="Endereço"
                />
                <TextInput
                  style={{
                    ...CustomProfile.input,
                    opacity: 2,
                    backgroundColor: theme === 'dark' ? '#444' : '#f0f0f0',
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                    borderColor: theme === 'dark' ? '#666' : '#ccc',
                  }}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="E-mail"
                  editable={false}
                />
                <TextInput
                  style={{
                    ...CustomProfile.input,
                    opacity: 2,
                    backgroundColor: theme === 'dark' ? '#444' : '#f0f0f0',
                    color: theme === 'dark' ? '#FFF' : '#1f2937',
                    borderColor: theme === 'dark' ? '#666' : '#ccc',
                  }}
                  value={`${formatCPF(cpf)} ${formatCNPJ(cnpj)}`}
                  onChangeText={setCpf}
                  placeholder="CPF / CNPJ"
                  editable={false}
                  placeholderTextColor={theme === 'dark' ? '#999' : '#6b7280'}
                />
                <Text style={CustomProfile.title}>Data de Criação: {formattedDate}</Text>
              </>
            ) : (
              <>
                <Text style={{...CustomProfile.name, color: theme === 'dark' ? colors.white : '' }}>{nome}</Text>
                <Text style={CustomProfile.title}>@{nomeUsuario}</Text>
              </>
            )}

            <View style={CustomProfile.nivelHabilidadeContainer}>
              <Text style={CustomProfile.nivelHabilidade}>Nível</Text>
              <Ionicons name="star-half-outline" size={20} color="#ffcc00" style={{ marginTop: -5 }} />
            </View>

            {showMoreInfo && (
              <View style={CustomProfile.informaçõesContainer}>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>Endereço: {endereco}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>E-mail: {email}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>CPF: {formatCPF(cpf)}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>CNPJ: {formatCNPJ(cnpj)}</Text>
                <Text style={{ color: theme === 'dark' ? colors.white : '' }}>Data de Criação: {formattedDate}</Text>
              </View>
            )}
          </View>

          <View style={CustomProfile.iconSection}>
            <TouchableOpacity
              style={{
                ...CustomProfile.iconButton,
                backgroundColor: theme === 'dark' ? colors.primary_green : colors.primary_green,
              }}
              onPress={toggleEdit}
            >
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={CustomProfile.button} onPress={handleLogout}>
            <Text style={{ fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={CustomProfile.buttonSalve}>
              <Text style={{ fontWeight: 'bold' }}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;