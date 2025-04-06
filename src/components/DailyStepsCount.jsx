import React, { useState, useEffect } from 'react';
import { View, Text, Platform, PermissionsAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import tw from 'twrnc';
import { Flame, Map, Target, Award, TrendingUp, Calendar } from 'lucide-react-native';

const STEP_GOAL = 10000;
const DAILY_CALORIE_GOAL = 600;
const DAILY_DISTANCE_GOAL = 6; // km

const StepCounterApp = () => {
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const totalSteps = pastStepCount + currentStepCount;
  const progressPercent = Math.min((totalSteps / STEP_GOAL) * 100, 100);
  const caloriesBurned = (totalSteps * 0.053).toFixed(0); // Avg
  const distanceKm = (totalSteps * 0.0008).toFixed(2); // ~0.8m per step

  // Calculate calories and distance percentages for the mini circles
  const caloriesPercent = Math.min((caloriesBurned / DAILY_CALORIE_GOAL) * 100, 100);
  const distancePercent = Math.min((distanceKm / DAILY_DISTANCE_GOAL) * 100, 100);

  const requestActivityPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    let subscription = null;

    const init = async () => {
      const hasPermission = await requestActivityPermission();
      if (!hasPermission) return;

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();

      try {
        const { steps } = await Pedometer.getStepCountAsync(start, end);
        setPastStepCount(steps || 0);
      } catch {}

      subscription = Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    };

    init();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const getStepsSummary = () => {
    if (totalSteps < STEP_GOAL * 0.3) {
      return "Keep going! Every step counts.";
    } else if (totalSteps < STEP_GOAL * 0.7) {
      return "Great progress! You're well on your way.";
    } else if (totalSteps < STEP_GOAL) {
      return "Almost there! Keep pushing!";
    } else {
      return "Congratulations! You've reached your goal!";
    }
  };

  // Current date formatted nicely
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-indigo-600 pt-12 pb-6 px-5 rounded-b-3xl shadow-lg`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-2xl font-bold text-white`}>Activity Tracker</Text>
          <Calendar size={22} color="white" />
        </View>
        <Text style={tw`text-white text-opacity-80`}>{currentDate}</Text>
      </View>



      {/* Main Content */}
      <View style={tw`flex-1 px-5 pt-6`}>
        {/* Goal Card */}
        <View style={tw`bg-white p-4 rounded-xl shadow-sm mb-5 flex-row items-center`}>
          <View style={tw`bg-indigo-100 p-2 rounded-lg mr-3`}>
            <Target size={20} color="#4f46e5" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-500 text-sm`}>Daily Goal</Text>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-gray-800 font-bold text-lg`}>{totalSteps.toLocaleString()} / {STEP_GOAL.toLocaleString()}</Text>
              <Text style={tw`text-indigo-600 font-bold`}>{Math.round(progressPercent)}%</Text>
            </View>
          </View>
        </View>

        {/* Circular Progress */}
        <View style={tw`items-center justify-center py-3`}>
          <AnimatedCircularProgress
            size={230}
            width={18}
            fill={progressPercent}
            tintColor={progressPercent >= 100 ? "#059669" : "#6366f1"}
            backgroundColor="#e5e7eb"
            lineCap="round"
            rotation={0}
            backgroundWidth={12}
          >
            {() => (
              <View style={tw`items-center justify-center`}>
                <Text style={tw`text-5xl font-bold text-gray-800`}>
                  {totalSteps.toLocaleString()}
                </Text>
                <Text style={tw`text-base text-gray-500`}>steps today</Text>
                {progressPercent >= 100 && (
                  <View style={tw`mt-2 flex-row items-center`}>
                    <Award size={16} color="#059669" style={tw`mr-1`} />
                    <Text style={tw`text-green-600 font-medium`}>Goal Reached!</Text>
                  </View>
                )}
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Step Summary */}
        <View style={tw`bg-indigo-50 p-4 rounded-xl mb-6`}>
          <Text style={tw`text-indigo-700 font-medium text-center`}>
            {getStepsSummary()}
          </Text>
        </View>

        {/* Stats Cards */}
        <Text style={tw`text-xl font-bold text-gray-800 mb-3`}>Today's Activity</Text>
        <View style={tw`flex-row justify-between mb-5`}>
          {/* Calories Card */}
          <View style={tw`bg-white p-4 rounded-xl shadow-sm w-[48%]`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <View style={tw`bg-orange-100 p-2 rounded-lg`}>
                <Flame size={18} color="#f97316" />
              </View>
              <AnimatedCircularProgress
                size={45}
                width={4}
                fill={caloriesPercent}
                tintColor="#f97316"
                backgroundColor="#e5e7eb"
              />
            </View>
            <Text style={tw`text-2xl font-bold text-gray-800`}>{caloriesBurned}</Text>
            <Text style={tw`text-gray-500 text-sm`}>calories burned</Text>
          </View>

          {/* Distance Card */}
          <View style={tw`bg-white p-4 rounded-xl shadow-sm w-[48%]`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <View style={tw`bg-blue-100 p-2 rounded-lg`}>
                <Map size={18} color="#3b82f6" />
              </View>
              <AnimatedCircularProgress
                size={45}
                width={4}
                fill={distancePercent}
                tintColor="#3b82f6"
                backgroundColor="#e5e7eb"
              />
            </View>
            <Text style={tw`text-2xl font-bold text-gray-800`}>{distanceKm}</Text>
            <Text style={tw`text-gray-500 text-sm`}>kilometers</Text>
          </View>
        </View>

        {/* Achievement Card */}
        {progressPercent > 0 && (
          <View style={tw`bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl shadow-md flex-row items-center`}>
            <View style={tw`bg-white bg-opacity-20 p-3 rounded-lg mr-4`}>
              <TrendingUp size={24} color="white" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white font-bold text-lg`}>
                {progressPercent >= 100
                  ? "Daily Goal Achieved!"
                  : `${Math.round(progressPercent)}% of daily goal`}
              </Text>
              <Text style={tw`text-white text-opacity-80`}>
                {progressPercent >= 100
                  ? "Excellent job staying active today!"
                  : `${STEP_GOAL - totalSteps} steps to go`}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default StepCounterApp;