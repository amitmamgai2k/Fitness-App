import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions, FlatList } from 'react-native';
import tw from '../../../tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, ChevronDown, ChevronUp, Check, Calendar, AlertCircle } from 'lucide-react-native';

const bodyParts = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const screenHeight = Dimensions.get('window').height;

const CreateWorkoutPlan = ({ navigation }) => {
  // Main plan info
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');

  // Weekly workout setup
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [currentEditingDay, setCurrentEditingDay] = useState(null);

  // Exercise selection
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'f21b049adfmsh949b3b50c4cae42p1f3cb0jsnf76c04510318';

  useEffect(() => {
    if (exercises.length > 0) {
      filterExercises();
    }
  }, [searchQuery, exercises]);

  // Initialize empty workout for a day
  const initializeDay = (day) => {
    if (!weeklyPlan[day]) {
      setWeeklyPlan({
        ...weeklyPlan,
        [day]: { exercises: [], bodyPart: null }
      });
    }
  };

  // Select a day to edit
  const selectDayToEdit = (day) => {
    initializeDay(day);
    setCurrentEditingDay(day);
    setSelectedBodyPart(weeklyPlan[day]?.bodyPart || null);
    setSelectedExercises(weeklyPlan[day]?.exercises || []);

    // Clear exercise search if changing days
    if (currentEditingDay !== day) {
      setExercises([]);
      setFilteredExercises([]);
      setSearchQuery('');
    }
  };

  const filterExercises = () => {
    if (!searchQuery.trim()) {
      setFilteredExercises(exercises);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = exercises.filter(
      exercise =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.target.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query)
    );

    setFilteredExercises(filtered);
  };

  const fetchExercisesByBodyPart = async (part) => {
    setLoading(true);
    setSearchQuery('');
    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${part}?limit=200&offset=0`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        }
      );
      const data = await response.json();
      setExercises(data);
      setFilteredExercises(data);

      // Update the body part for the current day
      if (currentEditingDay) {
        setWeeklyPlan({
          ...weeklyPlan,
          [currentEditingDay]: {
            ...weeklyPlan[currentEditingDay],
            bodyPart: part
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      Alert.alert('Error', 'Failed to fetch exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addExercise = (exercise) => {
    if (!currentEditingDay) {
      Alert.alert('Please select a day first');
      return;
    }

    const dayExercises = weeklyPlan[currentEditingDay]?.exercises || [];
    const exists = dayExercises.find((e) => e.id === exercise.id);

    if (!exists) {
      const updatedExercises = [...dayExercises, exercise];
      setSelectedExercises(updatedExercises);

      // Update weekly plan
      setWeeklyPlan({
        ...weeklyPlan,
        [currentEditingDay]: {
          ...weeklyPlan[currentEditingDay],
          exercises: updatedExercises
        }
      });
    }
  };

  const removeExercise = (exerciseId) => {
    if (!currentEditingDay) return;

    const updatedExercises = selectedExercises.filter((e) => e.id !== exerciseId);
    setSelectedExercises(updatedExercises);

    // Update weekly plan
    setWeeklyPlan({
      ...weeklyPlan,
      [currentEditingDay]: {
        ...weeklyPlan[currentEditingDay],
        exercises: updatedExercises
      }
    });
  };

  const handleSaveWorkoutPlan = async () => {
    // Validate plan name
    if (!planName.trim()) {
      Alert.alert('Please enter a workout plan name');
      return;
    }

    // Check if at least one day has exercises
    const hasExercises = Object.values(weeklyPlan).some(day => day.exercises.length > 0);
    if (!hasExercises) {
      Alert.alert('Please add exercises for at least one day');
      return;
    }

    const plan = {
      id: Date.now().toString(),
      name: planName,
      description,
      difficulty,
      weeklyPlan,
      createdAt: new Date().toISOString()
    };

    try {
      const stored = await AsyncStorage.getItem('workoutPlans');
      const parsed = stored ? JSON.parse(stored) : [];
      const updated = [...parsed, plan];
      await AsyncStorage.setItem('workoutPlans', JSON.stringify(updated));
      Alert.alert('✅ Weekly Plan Created');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('❌ Failed to save plan');
    }
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => addExercise(item)}
      style={tw`mb-3 p-4 bg-gray-100 rounded-xl flex-row items-center`}
    >
      <Image
        source={{ uri: item.gifUrl }}
        style={tw`w-16 h-16 rounded-lg mr-4`}
        resizeMode="cover"
      />
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-semibold`}>{item.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>Target: {item.target}</Text>
        <Text style={tw`text-sm text-gray-500`}>Equipment: {item.equipment}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSelectedExerciseItem = ({ item }) => (
    <View
      style={tw`flex-row items-center p-3 mb-2 bg-white border border-gray-200 rounded-lg justify-between`}
    >
      <View style={tw`flex-row items-center`}>
        <Image
          source={{ uri: item.gifUrl }}
          style={tw`w-14 h-14 rounded-md mr-4`}
          resizeMode="cover"
        />
        <View>
          <Text style={tw`font-semibold text-gray-800`}>{item.name}</Text>
          <Text style={tw`text-sm text-gray-500`}>Target: {item.target}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeExercise(item.id)}>
        <Text style={tw`text-pink-600 font-semibold`}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDayButton = (day) => {
    const isActive = currentEditingDay === day;
    const hasExercises = (weeklyPlan[day]?.exercises || []).length > 0;

    return (
      <TouchableOpacity
        key={day}
        onPress={() => selectDayToEdit(day)}
        style={tw`mr-3 px-4 py-2 rounded-full border ${
          isActive ? 'bg-pink-600 border-pink-600' : hasExercises ? 'bg-green-50 border-green-400' : 'border-gray-300'
        }`}
      >
        <View style={tw`flex-row items-center`}>
          <Text
            style={tw`${
              isActive ? 'text-white' : hasExercises ? 'text-green-700' : 'text-gray-800'
            } font-semibold`}
          >
            {day}
          </Text>
          {hasExercises && !isActive && (
            <Check size={14} color="#10b981" style={tw`ml-1`} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Get summary of weekly plan
  const getWeekSummary = () => {
    const daysPlanned = Object.keys(weeklyPlan).filter(day =>
      weeklyPlan[day]?.exercises && weeklyPlan[day].exercises.length > 0
    ).length;

    const totalExercises = Object.values(weeklyPlan).reduce(
      (sum, day) => sum + (day.exercises?.length || 0), 0
    );

    return { daysPlanned, totalExercises };
  };

  const { daysPlanned, totalExercises } = getWeekSummary();

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-5 pb-28`}>
        <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>Create Weekly Workout Plan</Text>

        <TextInput
          style={tw`border border-gray-300 p-3 rounded-xl mb-4`}
          placeholder="Weekly Plan Name"
          value={planName}
          onChangeText={setPlanName}
        />

        <TextInput
          style={tw`border border-gray-300 p-3 rounded-xl mb-4`}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
        />

        {/* Week Overview */}
        <View style={tw`mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Calendar size={18} color="#3b82f6" style={tw`mr-2`} />
            <Text style={tw`text-lg font-bold text-blue-800`}>Weekly Plan Overview</Text>
          </View>

          <Text style={tw`text-blue-700 mb-1`}>Days planned: {daysPlanned} of 7</Text>
          <Text style={tw`text-blue-700 mb-2`}>Total exercises: {totalExercises}</Text>

          {daysPlanned === 0 && (
            <View style={tw`flex-row items-center mt-1`}>
              <AlertCircle size={16} color="#f59e0b" style={tw`mr-2`} />
              <Text style={tw`text-amber-600`}>Select days below to plan your workouts</Text>
            </View>
          )}
        </View>

        <Text style={tw`text-base font-semibold text-gray-700 mb-2`}>Select Day to Edit</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
          {weekdays.map(day => renderDayButton(day))}
        </ScrollView>

        {currentEditingDay && (
          <>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>
                {currentEditingDay}'s Workout
              </Text>
              {weeklyPlan[currentEditingDay]?.exercises?.length > 0 && (
                <Text style={tw`text-sm font-medium text-green-600`}>
                  {weeklyPlan[currentEditingDay].exercises.length} exercises
                </Text>
              )}
            </View>

            <Text style={tw`text-base font-semibold text-gray-700 mb-2`}>Select Body Part</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
              {bodyParts.map((part) => (
                <TouchableOpacity
                  key={part}
                  onPress={() => {
                    setSelectedBodyPart(part);
                    fetchExercisesByBodyPart(part);
                  }}
                  style={tw`mr-3 px-4 py-2 rounded-full border ${
                    selectedBodyPart === part ? 'bg-pink-600 border-pink-600' : 'border-gray-300'
                  }`}
                >
                  <Text
                    style={tw`${
                      selectedBodyPart === part ? 'text-white' : 'text-gray-800'
                    } font-semibold`}
                  >
                    {part}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {currentEditingDay && selectedBodyPart && (
          <>
            <Text style={tw`text-base font-semibold text-gray-700 mb-2`}>Select Exercises</Text>

            {/* Search Bar */}
            <View style={tw`flex-row border border-gray-300 rounded-xl mb-4 px-3 items-center`}>
              <Search size={20} color="#9ca3af" />
              <TextInput
                style={tw`flex-1 p-2 text-gray-800`}
                placeholder="Search exercises..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={tw`text-gray-500 font-medium`}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#ec4899" style={tw`mb-3`} />
            ) : filteredExercises.length > 0 ? (
              <View style={tw`mb-6 relative`}>
                <FlatList
                  data={filteredExercises}
                  renderItem={renderExerciseItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  style={tw`max-h-[${screenHeight * 0.4}px]`}
                />
              </View>
            ) : (
              <Text style={tw`text-gray-600 mb-3`}>
                {searchQuery ? "No exercises matching your search" : "No exercises found"}
              </Text>
            )}
          </>
        )}

        {currentEditingDay && selectedExercises.length > 0 && (
          <View style={tw`mt-6 relative`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
              {currentEditingDay}'s Exercises ({selectedExercises.length})
            </Text>
            <FlatList
              data={selectedExercises}
              renderItem={renderSelectedExerciseItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              style={tw`max-h-[${screenHeight * 0.4}px]`}
            />
          </View>
        )}

        {/* Save Full Weekly Plan Button */}
        <TouchableOpacity
          onPress={handleSaveWorkoutPlan}
          style={tw`mt-6 bg-pink-600 py-3 rounded-xl ${daysPlanned === 0 ? 'opacity-50' : ''}`}
          disabled={daysPlanned === 0}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>
            Save Weekly Workout Plan
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateWorkoutPlan;