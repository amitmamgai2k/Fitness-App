import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, Image,ToastAndroid } from 'react-native';
import { auth } from '../../../firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import tw from '../../../tailwind';
import avatar from '../../../assets/avatar.png';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AuthScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const[isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);



const handleSignUp = async () => {
  if (!email || !password) {
    setError('Email and password are required');
    ToastAndroid.show('Email and password are required', ToastAndroid.SHORT);
    return;
  }

  setLoading(true);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    ToastAndroid.show('Signed up successfully!', ToastAndroid.SHORT);
    navigation.navigate('Form');
    setError('');
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.LONG);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

const handleSignIn = async () => {
  if (!email || !password) {
    setError('Email and password are required');
    ToastAndroid.show('Email and password are required', ToastAndroid.SHORT);
    return;
  }

  setLoading(true);
  try {
    const savedData = await AsyncStorage.getItem('USER_DATA');
    await signInWithEmailAndPassword(auth, email, password);
    ToastAndroid.show('Signed in successfully!', ToastAndroid.SHORT);
    if(savedData){
      navigation.navigate('Home');
    }

    setError('');
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.LONG);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};




// Example usage:
const handleForgotPassword = async () => {
  if (!email) {
    ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    ToastAndroid.show('Password reset email sent!', ToastAndroid.SHORT);
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.LONG);
  }
};



  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-black`}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }



  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <StatusBar/>
      <ScrollView contentContainerStyle={tw`flex-grow`}>
        <View style={tw`px-6 py-12 flex-1 justify-center`}>
          <View style={tw`items-center mb-8`}>
         <Image source={avatar} style={tw`h-24 w-40 `} resizeMode='cover' />
            <Text style={tw`text-white font-bold text-3xl mt-4`}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </Text>
            <Text style={tw`text-gray-400 text-center mt-2`}>
              {isLogin
                ? "Sign in to access your fitness journey"
                : "Join us and start your fitness journey today"}
            </Text>
          </View>

          <View style={tw`gap-4 mb-6`}>
            <View style={[
          tw`bg-gray-800 rounded-lg px-4 py-3`,
        isFocused && tw`border-2 border-green-500`
         ]}>

              <TextInput
                placeholder="Enter Your Email"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                style={tw`text-white text-base`}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}

              />
            </View>

            <View style={[
          tw`bg-gray-800 rounded-lg px-4 py-3`,
        isPasswordFocused && tw`border-2 border-green-400`
         ]}>

              <TextInput
                placeholder="Enter Your Password"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                 onFocus={() => setIsPasswordFocused(true)}
                 onBlur={() => setIsPasswordFocused(false)}
                secureTextEntry
                style={tw`text-white text-base`}
              />
            </View>
            {isLogin && (
              <TouchableOpacity style={tw`items-end`} onPress={handleForgotPassword}>
                <Text style={tw`text-green-500 text-sm`}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={tw`bg-green-500 py-4 rounded-lg items-center shadow-lg mb-6`}
            onPress={isLogin ? handleSignIn : handleSignUp}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              {isLogin ? "Log In" : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={tw`flex-row justify-center`}>
            <Text style={tw`text-gray-400`}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={tw`text-green-500 font-semibold`}>
                {isLogin ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
