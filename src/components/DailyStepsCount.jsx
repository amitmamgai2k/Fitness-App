import React, { useState, useEffect } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import tw from 'twrnc';
import { Flame } from 'lucide-react-native';

const STEP_GOAL = 10000;

const StepCounterApp = () => {
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const totalSteps = pastStepCount + currentStepCount;
  const progressPercent = Math.min((totalSteps / STEP_GOAL) * 100, 100);
  const caloriesBurned = (totalSteps * 0.053).toFixed(0); // Avg
  const distanceKm = (totalSteps * 0.0008).toFixed(2); // ~0.8m per step

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

  return (
    <View style={tw`flex-1 bg-white justify-center items-center px-6 mb-4 border-1 border-gray-200 rounded-xl shadow-md mx-6 py-3 mt-2`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>🏃 Step Tracker</Text>

      {/* Circular Progress */}
      <View style={tw`shadow-lg rounded-full`}>
        <AnimatedCircularProgress
          size={220}
          width={16}
          fill={progressPercent}
          tintColor="#6366f1"
          backgroundColor="#f3f4f6"
          lineCap="round"
        >
          {() => (
            <View style={tw`items-center justify-center`}>
              <View style={tw`bg-indigo-100 p-4 rounded-full mb-2`}>
                <Text style={tw`text-3xl`}>🏃‍♂️</Text>
              </View>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Step count */}
      <Text style={tw`text-5xl font-extrabold text-gray-900 mt-4`}>{totalSteps}</Text>
      <Text style={tw`text-base text-gray-500 mb-4`}>Today Steps </Text>

      {/* Mini Stats */}
      <View style={tw`flex-row justify-around mt-4 w-full px-10`}>
        {/* Calories */}
        <View style={tw`items-center`}>
          <AnimatedCircularProgress
            size={70}
            width={6}
            fill={(caloriesBurned / 600) * 100}
            tintColor="#8b5cf6"
            backgroundColor="#e5e7eb"
            lineCap="round"
          >
            {() => (
              <View style={tw`items-center`}>
                <Text style={tw`text-base font-semibold text-gray-800`}>
                  {caloriesBurned}
                </Text>
                <Text style={tw`text-xs text-gray-500`}>kcal</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Distance */}
        <View style={tw`items-center`}>
          <AnimatedCircularProgress
            size={70}
            width={6}
            fill={(distanceKm / 6) * 100}
            tintColor="#8b5cf6"
            backgroundColor="#e5e7eb"
            lineCap="round"
          >
            {() => (
              <View style={tw`items-center`}>
                <Text style={tw`text-base font-semibold text-gray-800`}>
                  {distanceKm}
                </Text>
                <Text style={tw`text-xs text-gray-500`}>km</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>

      {/* Highlighted Calories Burned */}
      <View style={tw`flex-row items-center mt-10 bg-orange-100 px-5 py-3 rounded-xl`}>
        <Flame size={22} color="#f97316" />
        <Text style={tw`text-lg text-orange-500 font-semibold ml-2`}>
          {caloriesBurned} cal burned today
        </Text>
      </View>
    </View>
  );
};

export default StepCounterApp;
