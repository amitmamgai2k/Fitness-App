
import { SafeAreaView, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from '../../tailwind';
import { StatusBar } from 'expo-status-bar';
import ImageSlider from './ImageSlider';
import Exercise from './Exercise';
import WeeklyExercise from './WeeklyExercise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home as HomeIcon, List, User, Target } from 'lucide-react-native';


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
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-24`}>
        <StatusBar hidden={true} />
        <View style={tw`flex-1 px-5 pt-2`}>
          {/* Header */}
          <View style={tw`flex-row mt-10`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-4xl text-gray-800 font-bold tracking-wider`}>READY TO</Text>
              <Text style={tw`text-4xl text-pink-600 font-bold tracking-wider`}>WORKOUT </Text>
            </View>

              <Image
                source={require('../../assets/avatar.png')}
                style={tw`w-30 h-18 mt-[-10]`}
                resizeMethod="resize"
                resizeMode="cover"
              />

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
          <View>

          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row justify-around py-3 px-4`}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={tw`items-center`}>
          <HomeIcon size={24} color="#db2777" />
          <Text style={tw`text-xs text-pink-600 mt-1`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyWorkouts')} style={tw`items-center`}>
          <List size={24} color="#6b7280" />
          <Text style={tw`text-xs text-gray-600 mt-1`}>My Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreatePlan')} style={tw`items-center`}>
          <Target size={24} color="#6b7280" />
          <Text style={tw`text-xs text-gray-600 mt-1`}>Create Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Steps')} style={tw`items-center`}>
          <List size={24} color="#6b7280" />
          <Text style={tw`text-xs text-gray-600 mt-1`}>Today Steps</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userData: UserData })} style={tw`items-center`}>
          <User size={24} color="#6b7280" />
          <Text style={tw`text-xs text-gray-600 mt-1`}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
