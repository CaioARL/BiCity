import { View, Text, ScrollView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

export default function SignIn() {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const submitForm = () => {
    console.log('form', form);
    router.push('home');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="container  w-full h-full">
          <View className="flex-1 min-h-screen h-full">
            <Text className="text-[14px] font-bold text-center text-secondary_black mb-24">Sign In</Text>
            <Text className="text-2xl font-bold text-center text-secondary_black mb-4">BICITY</Text>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: string) => setForm({ ...form, email: e })}
              otherStyles="mb-4"
              keyboardType="email-address"
              placeholder="email@email.com"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: string) => setForm({ ...form, password: e })}
              otherStyles="mb-4"
              placeholder="Insert your password"
              secureTextEntry={true}
            />

            <View className="flex-row justify-between mb-6">
              {['Facebook', 'Gmail', 'Linkedin'].map((icon, index) => (
                <View key={index} className="flex-col items-center">
                  <View className="flex-col items-center border border-[#818181] rounded-[20px] p-2">
                    <Svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                      {icon === 'Facebook' && (
                        <Path d="M26.0828 20.8125L26.7484 17.0104H22.5813V14.5453C22.5813 13.5035 23.1625 12.4904 25.0281 12.4904H26.9219V9.2584C26.9219 9.2584 25.2063 9 23.5656 9C20.1344 9 17.8891 10.8211 17.8891 14.1146V17.0104H14.0734V20.8125H17.8891V30H22.5859V20.8125H26.0828Z" fill="black" />
                      )}
                      {icon === 'Gmail' && (
                        <Path d="M24.082 17.1572C24.1523 17.6309 24.2031 18.1045 24.2031 18.7197C24.2031 24.0762 21.3281 27.875 17 27.875C12.8555 27.875 9.5 23.6807 9.5 18.5C9.5 13.3193 12.8555 9.125 17 9.125C19.0273 9.125 20.7148 10.0479 22.0234 11.5811L19.9883 14.0225C19.4375 13.3584 18.4648 12.5771 17 12.5771C14.4414 12.5771 12.3555 15.2236 12.3555 18.5C12.3555 21.7764 14.4414 24.4229 17 24.4229C19.9688 24.4229 21.082 21.752 21.2578 20.3799H17V17.1572H24.082ZM31.3242 17.4697V14.75H29.1367V17.4697H26.9609V20.2041H29.1367V22.9238H31.3242V20.2041H33.5V17.4697H31.3242Z" fill="black" />
                      )}
                      {icon === 'Linkedin' && (
                        <Path d="M13.7016 26.375H9.34688V14.1072H13.7016V26.375ZM11.5219 12.4338C10.1297 12.4338 9 11.4248 9 10.2066C9 9.6214 9.2657 9.06014 9.73864 8.64631C10.2116 8.23248 10.853 8 11.5219 8C12.1907 8 12.8322 8.23248 13.3051 8.64631C13.7781 9.06014 14.0437 9.6214 14.0437 10.2066C14.0437 11.4248 12.9141 12.4338 11.5219 12.4338ZM29.9953 26.375H25.65V20.4031C25.65 18.9799 25.6172 17.1547 23.3859 17.1547C21.1219 17.1547 20.775 18.701 20.775 20.3006V26.375H16.425V14.1072H20.6016V15.7807H20.6625C21.2438 14.8168 22.6641 13.7996 24.7828 13.7996C29.1891 13.7996 30 16.3385 30 19.6361V26.375H29.9953Z" fill="black" />
                      )}
                    </Svg>
                  </View>

                  {/* Nome do ícone abaixo da bola */}
                  <Text className="text-xs text-secondary_black">{icon}</Text>
                </View>
              ))}
            </View>

            <CustomButton
              title="Sign In"
              handlePress={() => submitForm()}
              containerStyles="mt-4"
              isLoading={isSubmittingForm}
            />
            <View className="flex-row justify-center mt-4">
              <Text>Don't have an account? </Text>
              <Text
                onPress={() => router.push('sign-up')}
                className="text-blue-500 font-bold"
              >
                Sign Up
              </Text>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}
