import { SafeAreaView, Image, Text, View, Pressable, StatusBar,ActivityIndicator } from 'react-native';
import React, { useEffect,useState } from 'react';
import tw from '../../tailwind';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Context/UserContext';


const Start = ({ navigation }) => {
  const[loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) {
        navigation.replace('Authentication');
        return;
      }

      try {
        const userData = await AsyncStorage.getItem('USER_DATA');
        if (userData !== null) {
          const parsedUserData = JSON.parse(userData);
          navigation.replace('Home', { userData: parsedUserData });
        } else {
          navigation.replace('Home'); // fallback
        }
      } catch (error) {
        console.error('Error reading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserData();
  }, [user, navigation]);
 const handleStart = () => {
  setLoading(true);
  setTimeout(() => {

    navigation.navigate('Authentication');
    setLoading(false);
  } , 1000);

 }
 if (loading) {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <ActivityIndicator size="large" color="#22C55E" />
    </View>
  );
}
  return (
    <View style={tw`flex-1`}>
      <StatusBar barStyle="light-content" />
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=3098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
        style={[tw`absolute w-full h-full`, { resizeMode: 'cover' }]}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
        style={tw`absolute w-full h-full`}
      />

      <SafeAreaView style={tw`flex-1 justify-end`}>
        <View style={tw`mb-20 mx-10 items-center`}>
          {/* Title */}
          <Text style={tw`text-4xl text-center font-bold text-white mb-4`}>
            Best <Text style={tw`text-red-500`}>Workout</Text> For You
          </Text>
          {/* Button */}
          <Pressable
            style={({pressed}) => [
              tw`bg-red-500 rounded-full py-4 w-full shadow-lg`,
              pressed ? tw`bg-red-600` : null
            ]}
            onPress={handleStart}
          >
            <Text style={tw`text-white text-center text-lg font-bold`}>
              Get Started
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Start;