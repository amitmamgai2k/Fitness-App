import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from '../../../tailwind'; // Assuming this is your Tailwind setup
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, ChevronRight } from 'lucide-react-native';

const MyWorkouts = ({ navigation }) => {
  const [myWorkouts, setMyWorkouts] = useState([]);

  const loadWorkouts = async () => {
    try {
      const stored = await AsyncStorage.getItem('myWorkouts');
      const parsed = stored ? JSON.parse(stored) : [];
      setMyWorkouts(parsed);
    } catch (error) {
      console.error('Failed to load My Workouts:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWorkouts();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-white  p-6 `}>
        <Text style={tw`text-2xl font-semibold text-gray-900`}>
          My Favorite Workouts
        </Text>
        <Text style={tw`text-sm text-gray-500 mt-1`}>
          {myWorkouts.length} Exercise Saved
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`px-4 py-6 flex-grow`}>
        {myWorkouts.length === 0 ? (
          <View style={tw`flex-1 items-center justify-center py-20`}>
            <List size={48} color="#9ca3af" />
            <Text style={tw`text-lg font-medium text-gray-600 mt-4`}>
              No Workouts Added Yet
            </Text>
            <Text style={tw`text-sm text-gray-400 mt-2 text-center px-6`}>
              Start building your collection by adding your favorite exercises!
            </Text>
            <TouchableOpacity
              style={tw`mt-6 px-6 py-3 bg-blue-600 rounded-full`}
              onPress={() => navigation.navigate('Home')} // Adjust to your home screen route
            >
              <Text style={tw`text-white font-semibold`}>Explore Workouts</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myWorkouts.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={tw`mb-4 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex-row items-center`}
              onPress={() => navigation.navigate('ExerciseDetails', { exercise })}
              activeOpacity={0.9}
            >
              {exercise.gifUrl ? (
                <Image
                  source={{ uri: exercise.gifUrl }}
                  resizeMode="cover"
                  style={tw`w-32 h-32 rounded-l-xl`}
                />
              ) : (
                <View style={tw`w-32 h-32 bg-gray-200 rounded-l-xl items-center justify-center`}>
                  <Text style={tw`text-gray-400 text-sm`}>No Image</Text>
                </View>
              )}

              <View style={tw`flex-1 p-4`}>
                <Text style={tw`text-lg font-bold text-blue-600 tracking-wider mb-1`}>
                  {exercise.name.toUpperCase()}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>
                  <Text style={tw`font-medium`}>Target:</Text> {exercise.target}
                </Text>
                <Text style={tw`text-sm text-gray-600 mt-1`}>
                  <Text style={tw`font-medium`}>Body Part:</Text> {exercise.bodyPart}
                </Text>
                <Text style={tw`text-sm text-gray-600 mt-1`}>
                  <Text style={tw`font-medium`}>Equipment:</Text> {exercise.equipment}
                </Text>
              </View>
              <View style={tw`pr-4`}>
                <ChevronRight size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyWorkouts;