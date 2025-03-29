import { SafeAreaView, Text, View, Image, ScrollView, TouchableOpacity,ActivityIndicator } from 'react-native';
import React from 'react';
import tw from '../../tailwind';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import ImageSlider from './ImageSlider';
import Exercise from './Exercise';
import WeeklyExercise from './WeeklyExercise';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = ({ navigation, route }) => {
  const { userData } = route.params || {};
  const [UserData, setUserData] = useState(userData || null);
  const [isLoading, setIsLoading] = useState(!userData);

  useEffect(() => {
    if (!userData) {
      loadSavedData();
    }
  }, [userData]);
  const loadSavedData = async () => {
    try {
      setIsLoading(true);
      const savedData = await AsyncStorage.getItem('USER_DATA');

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setUserData(parsedData);
        console.log('Loaded saved data:', parsedData);
      } else {

        console.log('No saved data found');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }

  };
  useEffect(() => {
    if (!isLoading && !UserData) {
      Alert.alert(
        'No Profile Found',
        'We need some information to personalize your experience.',
        [
          {
            text: 'Create Profile',
            onPress: () => navigation.navigate('Start')
          }
        ]
      );
    }
  }, [UserData, isLoading, navigation]);


  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-100 justify-center items-center`}>
       <ActivityIndicator size="large" color="#db2777" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={tw`flex-1 bg-white mt-10`}>
      <StatusBar style="dark" />

      <View style={tw`flex-1 px-5 pt-2`}>

        <View style={tw`flex-row items-center justify-between mt-2`}>
          <View>
            <Text style={tw`text-4xl text-gray-800 font-bold tracking-wider`}>READY TO</Text>
            <Text style={tw`text-4xl text-pink-600 font-bold tracking-wider`}>WORKOUT</Text>
          </View>


          <TouchableOpacity
            style={tw`mr-2`}
            onPress={() => navigation.navigate('UserProfile', { userData })}
          >
            <Image
              source={require('../../assets/avatar.png')}
              style={tw`w-20 h-20 rounded-full`}
            />
          </TouchableOpacity>
        </View>

        {/* Image Slider */}
        <View style={tw`mt-4`}>
          <ImageSlider />
        </View>

        {/* Exercise Categories */}
        <Exercise navigation={navigation} />

        {/* Weekly Exercise */}
        <View>
          <WeeklyExercise navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;