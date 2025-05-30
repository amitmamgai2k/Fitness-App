import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert, ToastAndroid } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Calendar, Ruler, LogOut } from 'lucide-react-native';
import YourPlans from './Navigation/YourPlans';
import tw from '../../tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase.config';
import { signOut } from 'firebase/auth';

const UserProfile = ({ navigation, route }) => {
  const { userData } = route.params;


  // Handle case where no user data is passed
  if (!userData) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white p-4 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-600`}>No user data available</Text>
        <TouchableOpacity
          style={tw`mt-4 bg-pink-600 px-4 py-2 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white font-bold`}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const displayHeight = userData.heightUnit === "ft_in"
    ? `${userData.height.feet}'${userData.height.inches}"`
    : `${userData.height.cm} cm`;
    const handleLogout = async () => {

      try {
        await signOut(auth);
        ToastAndroid.show('Signed out successfully!', ToastAndroid.SHORT);
        navigation.navigate('Authentication');
        setError('');
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        setError(error.message);
      } finally {
      }
    };


  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Details Section */}
        <View style={tw`px-5`}>
          <View style={tw`flex-row justify-between items-center mb-2 mt-4`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Personal Information</Text>
            <TouchableOpacity
              style={tw`bg-red-500 py-2 px-4 rounded-lg flex-row items-center`}
              onPress={handleLogout}
            >
              <LogOut size={16} color="#fff" />
              <Text style={tw`text-white font-medium ml-2`}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`bg-white rounded-xl shadow-sm mt-2 mb-6`}>
            {/* Name */}
            <View style={tw`flex-row items-center p-4 border-b border-gray-100`}>
              <View style={tw`w-10 h-10 rounded-full bg-pink-100 items-center justify-center mr-4`}>
                <User size={20} color="#db2777" />
              </View>
              <View>
                <Text style={tw`text-sm text-gray-500`}>Name</Text>
                <Text style={tw`text-lg font-medium text-gray-800`}>{userData.name}</Text>
              </View>
            </View>

            {/* Age */}
            <View style={tw`flex-row items-center p-4 border-b border-gray-100`}>
              <View style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-4`}>
                <Calendar size={20} color="#3b82f6" />
              </View>
              <View>
                <Text style={tw`text-sm text-gray-500`}>Age</Text>
                <Text style={tw`text-lg font-medium text-gray-800`}>{userData.age} years</Text>
              </View>
            </View>

            {/* Gender */}
            <View style={tw`flex-row items-center p-4 border-b border-gray-100`}>
              <View style={tw`w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-4`}>
                <User size={20} color="#8b5cf6" />
              </View>
              <View>
                <Text style={tw`text-sm text-gray-500`}>Gender</Text>
                <Text style={tw`text-lg font-medium text-gray-800`}>
                  {userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)}
                </Text>
              </View>
            </View>

            {/* Height */}
            <View style={tw`flex-row items-center p-4`}>
              <View style={tw`w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4`}>
                <Ruler size={20} color="#10b981" />
              </View>
              <View>
                <Text style={tw`text-sm text-gray-500`}>Height</Text>
                <Text style={tw`text-lg font-medium text-gray-800`}>{displayHeight}</Text>
              </View>
            </View>
          </View>
        </View>

        <YourPlans navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default UserProfile;