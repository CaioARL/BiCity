import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function ListModal({ eventos, problemas, onClose, onSelectEvento, onSelectProblema }) {
  const [activeTab, setActiveTab] = useState('eventos');

  const renderEventoItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white mb-3 rounded-lg shadow-sm p-3 flex-row"
      onPress={() => onSelectEvento && onSelectEvento(item)}
    >
      <View className="rounded-full bg-primary_green justify-center items-center h-12 w-12 mr-3">
        <Ionicons 
          name={item.gratuito ? "bicycle" : "cash-outline"} 
          size={24} 
          color="black" 
        />
      </View>
      <View className="flex-1">
        <Text className="text-secondary_black_title font-bold text-base">{item.nome}</Text>
        <Text className="text-secondary_black_sub_title text-sm">{item.descricao.substring(0, 70)}...</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text className="text-secondary_black_sub_title text-xs ml-1">
            {item.gratuito ? 'Evento Gratuito' : 'Evento Pago'} • {item.faixaKm}km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProblemaItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white mb-3 rounded-lg shadow-sm p-3 flex-row"
      onPress={() => onSelectProblema && onSelectProblema(item)}
    >
      <View className="rounded-full bg-red-100 justify-center items-center h-12 w-12 mr-3">
        <Image 
          source={
            item.tipoProblema.id === 1 ? require('../../assets/pins/pin_problema_tipo_1.png') :
            item.tipoProblema.id === 2 ? require('../../assets/pins/pin_problema_tipo_2.png') :
            item.tipoProblema.id === 3 ? require('../../assets/pins/pin_problema_tipo_3.png') :
            item.tipoProblema.id === 4 ? require('../../assets/pins/pin_problema_tipo_4.png') :
            item.tipoProblema.id === 5 ? require('../../assets/pins/pin_problema_tipo_5.png') :
            item.tipoProblema.id === 6 ? require('../../assets/pins/pin_problema_tipo_6.png') :
            item.tipoProblema.id === 7 ? require('../../assets/pins/pin_problema_tipo_7.png') :
            item.tipoProblema.id === 8 ? require('../../assets/pins/pin_problema_tipo_8.png') :
            require('../../assets/pins/pin_problema_tipo_1.png')
          }
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </View>
      <View className="flex-1">
        <Text className="text-secondary_black_title font-bold text-base">{item.tipoProblema.nome}</Text>
        <Text className="text-secondary_black_sub_title text-sm">{item.descricao?.substring(0, 70) || 'Sem descrição'}...</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="alert-circle-outline" size={16} color="#666" />
          <Text className="text-secondary_black_sub_title text-xs ml-1">
            Reportado em {new Date(item.dataHora).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="absolute bottom-0 bg-white rounded-t-xl shadow-lg w-full h-[60%] z-50">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-lg font-bold text-secondary_black_title">Lista</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'eventos' ? 'border-b-2 border-primary_green' : ''}`}
          onPress={() => setActiveTab('eventos')}
        >
          <Text className={`font-medium ${activeTab === 'eventos' ? 'text-primary_green' : 'text-gray-500'}`}>
            Eventos ({eventos.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'problemas' ? 'border-b-2 border-primary_green' : ''}`}
          onPress={() => setActiveTab('problemas')}
        >
          <Text className={`font-medium ${activeTab === 'problemas' ? 'text-primary_green' : 'text-gray-500'}`}>
            Problemas ({problemas.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
      >
        {activeTab === 'eventos' ? (
          eventos.length > 0 ? (
            eventos.map(item => (
              <View key={item.id}>
                {renderEventoItem({item})}
              </View>
            ))
          ) : (
            <View className="flex-1 justify-center items-center p-8">
              <Ionicons name="bicycle" size={48} color="#ccc" />
              <Text className="text-center text-gray-400 mt-3">
                Nenhum evento encontrado nesta área
              </Text>
            </View>
          )
        ) : (
          problemas.length > 0 ? (
            problemas.map(item => (
              <View key={item.id}>
                {renderProblemaItem({item})}
              </View>
            ))
          ) : (
            <View className="flex-1 justify-center items-center p-8">
              <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
              <Text className="text-center text-gray-400 mt-3">
                Nenhum problema reportado nesta área
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}