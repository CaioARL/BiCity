import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View } from 'react-native'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

export default function SignUp() {
  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        <View className='my-4 mx-4'>

          <FormField
            title='First Name'
            value=''
            placeholder='Enter your first name'
            handleChangeText={(e) => console.log(e)}
          />
          <FormField
            title='First Name'
            value=''
            placeholder='Enter your first name'
            handleChangeText={(e) => console.log(e)}
          />
          <FormField
            title='First Name'
            value=''
            placeholder='Enter your first name'
            handleChangeText={(e) => console.log(e)}
          />
          <FormField
            title='First Name'
            value=''
            placeholder='Enter your first name'
            handleChangeText={(e) => console.log(e)}
          />
          <FormField
            title='First Name'
            value=''
            placeholder='Enter your first name'
            handleChangeText={(e) => console.log(e)}
          />
          <FormField
            title='First Name'
            value=''
            placeholder='Enter your first name'
            handleChangeText={(e) => console.log(e)}
          />

          <CustomButton
            title='Sign Up'
            handlePress={() => console.log('Sign Up')}
            containerStyles='mt-4'
          />
        </View>

      </ScrollView>
    </SafeAreaView>  
    )
}