import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'

export default function SignIn() {

  const [form, setForm] = React.useState({
    email: '',
    password: ''
  })



  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        
          <View className=''>
            <Text>SignIn</Text>
            <FormField
              title='Email'
              value={form.email}
              handleChangeText={(e : string) => setForm({ ...form, email: e })}
              otherStyles='mb-4'
              keyboardType='email-address'
              placeholder='email@email.com'
            />
            <FormField
              title='Password'
              value={form.password}
              handleChangeText={(e : string) => setForm({ ...form, password: e })}
              otherStyles='mb-4'
              placeholder='insert your password'
            />
          </View>

      </ScrollView>
    </SafeAreaView>
  )
}