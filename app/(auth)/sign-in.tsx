import { View, Text, ScrollView } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

export default function SignIn() {

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const submitForm = () => {
    console.log('form', form)
    router.push('home')
  }


  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        
          <View className='my-4 mx-4'>
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

            <CustomButton
              title='Sign In'
              handlePress={() => submitForm()}
              containerStyles='mt-4'
              isLoading={isSubmittingForm}
            />

            <View className='flex-row justify-center mt-4'>
              <Text>Don't have an account?</Text>
              <Text
                onPress={() => router.push('sign-up')}
                className='text-blue-500'
              >
                Sign Up
              </Text>
            </View>

          </View>

      </ScrollView>
    </SafeAreaView>
  )
}