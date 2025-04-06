import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, Dumbbell, Award, BookOpen, Zap, ChevronRight } from 'lucide-react-native';
import tw from '../../tailwind';

// Import the workout data
import { workoutPlans, getWorkoutByDay } from './weekdata';

const WeekExerciseDetails = ({ route, navigation }) => {
  const { title } = route.params || {};

  // Get the workout data for the selected day
  const workout = getWorkoutByDay(title) || {
    title: "Default Workout",
    color: "#db2777",
    duration: "45 min",
    description: "A balanced full-body workout routine.",
    exercises: []
  };


  const { color, duration, description, exercises = [] } = workout;

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-100`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={tw`ml-2 text-xl font-bold text-gray-800`}>
          {title} Training Plan
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[tw`p-5 mb-4`, { backgroundColor: `${color}10` }]}>
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-1 pr-4`}>
              <Text style={[tw`text-3xl font-bold mb-1`, { color }]}>
                {workout.title}
              </Text>
              <Text style={tw`text-gray-700 text-lg font-medium`}>
                {title} Focus
              </Text>

              <View style={tw`flex-row mt-3`}>
                <View style={tw`flex-row items-center mr-4`}>
                  <Dumbbell size={16} color="#666" style={tw`mr-1`} />
                  <Text style={tw`text-gray-600`}>{exercises.length} Exercises</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Clock size={16} color="#666" style={tw`mr-1`} />
                  <Text style={tw`text-gray-600`}>{duration} Workout</Text>
                </View>
              </View>
            </View>

            <View style={[tw`rounded-full p-4`, { backgroundColor: `${color}30` }]}>
              <Calendar size={32} color={color} />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={tw`px-5 mb-6`}>
          <Text style={tw`text-gray-700 leading-6 text-base`}>
            {description}
          </Text>
        </View>

        {/* Exercise List */}
        <View style={tw`px-5 mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
            Workout Program
          </Text>

          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <View
                key={index}
                style={tw`mb-3 p-4 bg-gray-50 rounded-xl border border-gray-100`}
              >
                <View style={tw`flex-row justify-between items-start`}>
                  <View style={tw`flex-row items-center flex-1 pr-2`}>
                    <View style={[tw`w-8 h-8 rounded-full items-center justify-center mr-3`, { backgroundColor: `${color}20` }]}>
                      <Text style={[tw`font-bold`, { color }]}>{index + 1}</Text>
                    </View>
                    <View>
                      <Text style={tw`text-lg font-bold text-gray-800`}>{exercise.name}</Text>
                      <View style={tw`flex-row items-center flex-wrap`}>
                        <Text style={tw`text-gray-600 text-sm`}>
                          <Text style={tw`font-medium`}>{exercise.sets}</Text> sets × <Text style={tw`font-medium`}>{exercise.reps}</Text>
                        </Text>
                        {exercise.rest && (
                          <Text style={tw`text-gray-600 text-sm`}> • <Text style={tw`font-medium`}>{exercise.rest}</Text> rest</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={tw`py-1 px-3 bg-gray-200 rounded-lg flex-row items-center`}
                    onPress={() => navigation.navigate('ExerciseDetail', {
                      exercise: exercise,
                      color: color,
                      title: title,
                      workout: workout,

                    })}
                  >
                    <Text style={tw`font-semibold text-gray-800 mr-1`}>View</Text>
                    <ChevronRight size={16} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Exercise details */}
                <View style={tw`ml-11 mt-2`}>
                  <Text style={tw`text-gray-600 mb-2 text-sm leading-5`}>{exercise.description}</Text>

                  <View style={tw`flex-row flex-wrap mt-2`}>
                    {exercise.muscle && (
                      <View style={[tw`flex-row items-center mr-4 mb-1 px-2 py-1 rounded-full`, { backgroundColor: `${color}10` }]}>
                        <Zap size={12} color={color} style={tw`mr-1`} />
                        <Text style={[tw`text-xs font-medium`, { color }]}>{exercise.muscle}</Text>
                      </View>
                    )}

                    {exercise.equipment && (
                      <View style={tw`flex-row items-center mb-1 bg-gray-200 px-2 py-1 rounded-full`}>
                        <Dumbbell size={12} color="#666" style={tw`mr-1`} />
                        <Text style={tw`text-gray-700 text-xs font-medium`}>{exercise.equipment}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={tw`items-center justify-center py-10 bg-gray-50 rounded-xl`}>
              <BookOpen size={40} color="#ccc" style={tw`mb-3`} />
              <Text style={tw`text-gray-500 text-lg font-medium`}>No Workout Found</Text>
              <Text style={tw`text-gray-400 text-sm mt-1`}>Select a different training day</Text>
            </View>
          )}
        </View>

        {/* Start Button */}
        {exercises.length > 0 && (
          <View style={tw`px-5 pb-10`}>
            <TouchableOpacity
              style={[tw`py-4 rounded-xl items-center flex-row justify-center`, { backgroundColor: color }]}
              onPress={() => navigation.navigate('WorkoutSessionScreen', {
                title: title,
                workout: workout,
                color: color
              })}
            >
              <Dumbbell size={20} color="white" style={tw`mr-2`} />
              <Text style={tw`text-white font-bold text-lg`}>
                Start Your Workout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeekExerciseDetails;