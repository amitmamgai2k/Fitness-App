import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from "../../tailwind";
import { Target, Crosshair, Dumbbell, Undo2, ChevronLeft, BookOpen } from 'lucide-react-native';

const ExerciseDetails = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
  const { exercise } = route.params || {};

  useEffect(() => {
    const checkIfAdded = async () => {
      const stored = await AsyncStorage.getItem('myWorkouts');
      const parsed = stored ? JSON.parse(stored) : [];
      const exists = parsed.some(item => item.id === exercise.id);
      setIsAlreadyAdded(exists);
    };

    if (exercise?.id) {
      checkIfAdded();
    }
  }, [exercise]);

  const secondary = (exercise?.secondaryMuscles?.length > 0)
    ? exercise.secondaryMuscles.join(", ")
    : "None specified";

  const handleAddToWorkout = async () => {
    try {
      const stored = await AsyncStorage.getItem('myWorkouts');
      const parsed = stored ? JSON.parse(stored) : [];
      const isAlready = parsed.some(item => item.id === exercise.id);

      if (!isAlready) {
        const updated = [...parsed, exercise];
        await AsyncStorage.setItem('myWorkouts', JSON.stringify(updated));
        setIsAlreadyAdded(true);
        Alert.alert('✅ Added', 'Exercise added to My Workouts');
      } else {
        Alert.alert('⚠️ Already Added', 'This exercise is already in My Workouts');
      }
    } catch (error) {
      console.error('Add to workout failed:', error);
      Alert.alert('Error', 'Failed to add exercise');
    }
  };

  if (!exercise) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <Text style={tw`text-center mt-4`}>No exercise data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center justify-between px-4 pt-2 pb-3`}>
        <TouchableOpacity style={tw`p-2 -ml-2`} onPress={() => navigation?.goBack?.()}>
          <ChevronLeft size={26} color="#333" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800`}>Exercise Details</Text>
        <View style={tw`w-10`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-8`}>
        <View style={tw`px-4 mb-5`}>
          <Text style={tw`text-2xl font-bold text-pink-600 mb-2 text-center p-2 bg-gray-50 rounded-lg uppercase tracking-wider`}>
            {exercise.name || "Unnamed Exercise"}
          </Text>

          {exercise.gifUrl && (
            <View style={tw`rounded-2xl overflow-hidden bg-gray-100 shadow-md`}>
              <WebView
                source={{ uri: exercise.gifUrl }}
                style={tw`w-70 h-60 self-center`}
                scalesPageToFit={true}
                javaScriptEnabled={true}
              />
            </View>
          )}
        </View>

        {/* Tab Bar */}
        <View style={tw`flex-row border-b border-gray-200 mb-4`}>
          <TouchableOpacity
            style={tw`flex-1 pb-3 ${activeTab === 'details' ? 'border-b-2 border-pink-600' : ''}`}
            onPress={() => setActiveTab('details')}
          >
            <Text style={tw`text-center font-semibold ${activeTab === 'details' ? 'text-pink-600' : 'text-gray-500'}`}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 pb-3 ${activeTab === 'instructions' ? 'border-b-2 border-pink-600' : ''}`}
            onPress={() => setActiveTab('instructions')}
          >
            <Text style={tw`text-center font-semibold ${activeTab === 'instructions' ? 'text-pink-600' : 'text-gray-500'}`}>Instructions</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'details' ? (
          <View style={tw`px-4`}>
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg font-bold text-gray-900 mb-3`}>Muscle Groups</Text>
              <View style={tw`bg-white rounded-xl shadow-sm border border-gray-100`}>
                <View style={tw`p-4 flex-row items-center border-b border-gray-100`}>
                  <View style={tw`bg-pink-50 p-3 rounded-xl mr-4`}>
                    <Target color="#db2777" size={22} />
                  </View>
                  <View>
                    <Text style={tw`text-sm text-gray-500`}>Primary Target</Text>
                    <Text style={tw`text-base font-semibold text-gray-900`}>{exercise.target}</Text>
                  </View>
                </View>

                <View style={tw`p-4 flex-row items-center border-b border-gray-100`}>
                  <View style={tw`bg-orange-50 p-3 rounded-xl mr-4`}>
                    <Undo2 color="#ea580c" size={22} />
                  </View>
                  <View>
                    <Text style={tw`text-sm text-gray-500`}>Secondary Muscles</Text>
                    <Text style={tw`text-base font-semibold text-gray-900`}>{secondary}</Text>
                  </View>
                </View>

                <View style={tw`p-4 flex-row items-center`}>
                  <View style={tw`bg-blue-50 p-3 rounded-xl mr-4`}>
                    <Crosshair color="#2563eb" size={22} />
                  </View>
                  <View>
                    <Text style={tw`text-sm text-gray-500`}>Body Part</Text>
                    <Text style={tw`text-base font-semibold text-gray-900`}>{exercise.bodyPart}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-lg font-bold text-gray-900 mb-3`}>Equipment</Text>
              <View style={tw`bg-white rounded-xl shadow-sm p-4 flex-row items-center border border-gray-100`}>
                <View style={tw`bg-purple-50 p-3 rounded-xl mr-4`}>
                  <Dumbbell color="#7c3aed" size={22} />
                </View>
                <View>
                  <Text style={tw`text-sm text-gray-500`}>Required Equipment</Text>
                  <Text style={tw`text-base font-semibold text-gray-900`}>{exercise.equipment}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={tw`px-4`}>
            <View style={tw`flex-row items-center mb-4`}>
              <BookOpen size={20} color="#4b5563" style={tw`mr-2`} />
              <Text style={tw`text-lg font-bold text-gray-900`}>How to Perform</Text>
            </View>
            <View style={tw`bg-white rounded-xl shadow-sm border border-gray-100`}>
              {exercise.instructions && exercise.instructions.length > 0 ? (
                exercise.instructions.map((instruction, index) => (
                  <View key={index} style={tw`p-4 ${index !== exercise.instructions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <View style={tw`flex-row`}>
                      <View style={tw`bg-pink-100 h-6 w-6 rounded-full items-center justify-center mr-3 mt-0.5`}>
                        <Text style={tw`text-pink-700 font-bold text-sm`}>{index + 1}</Text>
                      </View>
                      <Text style={tw`text-base text-gray-700 flex-1 leading-relaxed`}>
                        {instruction}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={tw`p-4`}>
                  <Text style={tw`text-base text-gray-600`}>No instructions available</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={tw`px-4 pb-6 pt-2 border-t border-gray-200`}>
  {isAlreadyAdded ? (
    <TouchableOpacity
      onPress={async () => {
        try {
          const stored = await AsyncStorage.getItem('myWorkouts');
          const parsed = stored ? JSON.parse(stored) : [];
          const updated = parsed.filter(item => item.id !== exercise.id);
          await AsyncStorage.setItem('myWorkouts', JSON.stringify(updated));
          setIsAlreadyAdded(false);
          Alert.alert('🗑️ Removed', 'Exercise removed from My Workouts');
        } catch (error) {
          console.error('Failed to remove:', error);
        }
      }}
      style={tw`bg-red-500 py-3.5 rounded-xl flex-row justify-center items-center`}
    >
      <Text style={tw`text-white font-bold text-lg`}>Remove from Workout</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={handleAddToWorkout}
      style={tw`bg-pink-600 py-3.5 rounded-xl flex-row justify-center items-center`}
    >
      <Text style={tw`text-white font-bold text-lg`}>Add to Workout</Text>
    </TouchableOpacity>
  )}
</View>

    </SafeAreaView>
  );
};

export default ExerciseDetails;
