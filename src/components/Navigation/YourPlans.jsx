// YourPlans.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from '../../../tailwind';
import { Trash2, Edit, ChevronRight, Calendar, Dumbbell, Info, Clock } from 'lucide-react-native';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const YourPlans = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem('workoutPlans');
      const parsed = stored ? JSON.parse(stored) : [];
      setPlans(parsed);
    } catch (error) {
      console.error('Failed to load plans:', error);
      Alert.alert('Error', 'Failed to load your workout plans');
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id) => {
    Alert.alert(
      'Delete Workout Plan',
      'Are you sure you want to delete this workout plan?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = plans.filter(plan => plan.id !== id);
            setPlans(updated);
            try {
              await AsyncStorage.setItem('workoutPlans', JSON.stringify(updated));
            } catch (error) {
              console.error('Failed to save after deletion:', error);
              Alert.alert('Error', 'Failed to delete the workout plan');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleExpandPlan = (id) => {
    setExpandedPlan(expandedPlan === id ? null : id);
    setExpandedDay(null); // Reset expanded day when changing plan
  };

  const toggleExpandDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const editPlan = (plan) => {
    // Navigate to edit screen or implement edit functionality
    Alert.alert('Coming Soon', 'Edit functionality will be available in the next update');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadPlans);
    return unsubscribe;
  }, [navigation]);

  const navigateToExerciseDetails = (exercise) => {
    // Navigate to exercise details screen with the exercise data
    navigation.navigate('ExerciseDetails', { exercise });
  };

  const renderExerciseItem = ({ item: ex }) => (
    <TouchableOpacity
      onPress={() => navigateToExerciseDetails(ex)}
      style={tw`mb-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-row items-center`}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: ex.gifUrl }}
        resizeMode="cover"
        style={tw`w-28 h-28 rounded-l-xl`}
      />
      <View style={tw`flex-1 p-3`}>
        <Text style={tw`text-lg font-bold text-pink-600 tracking-wider mb-1`}>
          {ex.name.toUpperCase()}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          <Text style={tw`font-medium`}>Target:</Text> {ex.target}
        </Text>
        <Text style={tw`text-sm text-gray-600 mt-1`}>
          <Text style={tw`font-medium`}>Body Part:</Text> {ex.bodyPart || ex.target}
        </Text>
        <Text style={tw`text-sm text-gray-600 mt-1`}>
          <Text style={tw`font-medium`}>Equipment:</Text> {ex.equipment}
        </Text>
      </View>
      <View style={tw`pr-4`}>
        <ChevronRight size={20} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );

  const renderDayItem = ({ item: day, plan }) => {
    const dayData = plan.weeklyPlan[day];
    if (!dayData || !dayData.exercises || dayData.exercises.length === 0) return null;

    const isExpanded = expandedDay === `${plan.id}-${day}`;
    const exerciseCount = dayData.exercises.length;

    return (
      <View style={tw`mb-3 bg-white rounded-lg border border-gray-200 overflow-hidden`}>
        <TouchableOpacity
          onPress={() => toggleExpandDay(`${plan.id}-${day}`)}
          style={tw`p-3 flex-row justify-between items-center`}
        >
          <View style={tw`flex-row items-center`}>
            <Calendar size={16} color="#6b7280" style={tw`mr-2`} />
            <Text style={tw`font-semibold text-gray-700`}>{day}</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-sm text-gray-500 mr-2`}>{exerciseCount} exercises</Text>
            <ChevronRight
              size={18}
              color="#9ca3af"
              style={isExpanded ? tw`rotate-90` : {}}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={tw`px-3 pb-3 pt-1 bg-gray-50`}>
            <FlatList
              data={dayData.exercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item, index) => `${plan.id}-${day}-ex-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    );
  };

  const renderPlanItem = ({ item: plan }) => {
    const isExpanded = expandedPlan === plan.id;
    const isWeeklyPlan = plan.weeklyPlan && Object.keys(plan.weeklyPlan).length > 0;

    // Calculate statistics for weekly plan
    let totalExercises = 0;
    let plannedDays = 0;

    if (isWeeklyPlan) {
      weekdays.forEach(day => {
        if (plan.weeklyPlan[day]?.exercises?.length > 0) {
          plannedDays++;
          totalExercises += plan.weeklyPlan[day].exercises.length;
        }
      });
    } else {
      // Handle legacy plans
      totalExercises = plan.exercises?.length || 0;
      plannedDays = plan.day ? 1 : 0;
    }

    return (
      <View style={tw`mb-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100`}>
        <TouchableOpacity
          onPress={() => toggleExpandPlan(plan.id)}
          style={tw`p-4 flex-row justify-between items-center bg-white`}
        >
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>{plan.name}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              {isWeeklyPlan ? (
                <>
                  <Calendar size={14} color="#6b7280" style={tw`mr-1`} />
                  <Text style={tw`text-gray-600 mr-3`}>{plannedDays} days</Text>
                  <Dumbbell size={14} color="#6b7280" style={tw`mr-1`} />
                  <Text style={tw`text-gray-600`}>{totalExercises} exercises</Text>
                </>
              ) : (
                <>
                  <Calendar size={14} color="#6b7280" style={tw`mr-1`} />
                  <Text style={tw`text-gray-600 mr-3`}>{plan.day || "Not specified"}</Text>
                  <Dumbbell size={14} color="#6b7280" style={tw`mr-1`} />
                  <Text style={tw`text-gray-600`}>{plan.difficulty}</Text>
                </>
              )}
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              onPress={() => editPlan(plan)}
              style={tw`p-2 mr-1`}
            >
              <Edit size={18} color="#ec4899" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deletePlan(plan.id)}
              style={tw`p-2 mr-1`}
            >
              <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
            <ChevronRight
              size={20}
              color={isExpanded ? "#ec4899" : "#9ca3af"}
              style={isExpanded ? tw`rotate-90` : {}}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={tw`px-4 pb-4 bg-gray-50`}>
            {plan.description ? (
              <View style={tw`mb-3 bg-blue-50 p-3 rounded-lg flex-row items-start`}>
                <Info size={16} color="#3b82f6" style={tw`mr-2 mt-0.5`} />
                <Text style={tw`text-blue-800 flex-1`}>{plan.description}</Text>
              </View>
            ) : null}

            {plan.createdAt && (
              <View style={tw`mb-3 flex-row items-center`}>
                <Clock size={14} color="#6b7280" style={tw`mr-1`} />
                <Text style={tw`text-sm text-gray-500`}>
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}

            {isWeeklyPlan ? (
              <View>
                <Text style={tw`text-base font-semibold text-gray-800 mb-3`}>
                  Weekly Schedule
                </Text>

                {weekdays.map(day => {
                  if (plan.weeklyPlan[day]?.exercises?.length > 0) {
                    return renderDayItem({ item: day, plan });
                  }
                  return null;
                })}
              </View>
            ) : (
              <>
                <Text style={tw`text-base font-semibold text-gray-800 mb-3 flex-row items-center`}>
                  Exercises ({plan.exercises?.length || 0})
                </Text>

                <FlatList
                  data={plan.exercises || []}
                  renderItem={renderExerciseItem}
                  keyExtractor={(item, index) => `${plan.id}-ex-${index}`}
                  scrollEnabled={false}
                />
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  const EmptyPlaceholder = () => (
    <View style={tw`mt-4 items-center py-10 px-4 rounded-xl border border-gray-200`}>
      <Dumbbell size={48} color="#d1d5db" style={tw`mb-3`} />
      <Text style={tw`text-lg font-semibold text-gray-600 mb-2`}>No Workout Plans Yet</Text>
      <Text style={tw`text-gray-500 text-center mb-4`}>
        Create your first workout plan to start tracking your fitness journey.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateWorkoutPlan')}
        style={tw`bg-pink-600 py-3 px-6 rounded-xl`}
      >
        <Text style={tw`text-white font-semibold text-center`}>Create New Plan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row justify-between items-center p-5 self-center`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Your Workout Plans</Text>

      </View>

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#ec4899" />
          <Text style={tw`mt-4 text-gray-600`}>Loading your plans...</Text>
        </View>
      ) : (
        <FlatList
          data={plans}
          renderItem={renderPlanItem}
          keyExtractor={item => item.id}
          contentContainerStyle={tw`p-4 pb-24`}
          ListEmptyComponent={EmptyPlaceholder}
        />
      )}
    </SafeAreaView>
  );
};

export default YourPlans;