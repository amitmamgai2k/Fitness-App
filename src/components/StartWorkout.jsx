import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native';
import { X, ChevronRight, Play, Pause, CheckCircle, Dumbbell } from 'lucide-react-native';
import tw from '../../tailwind'; // Assuming this is your Tailwind utility
import YoutubePlayer from 'react-native-youtube-iframe';

const WorkoutSessionScreen = ({ route, navigation }) => {
  // Get workout data from navigation params
  const { workout, color, title } = route.params || {};

  // Workout progress states
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetNumber, setCurrentSetNumber] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60); // Default 60 seconds rest
  const [isPaused, setIsPaused] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  // Use rest time from exercise data if available
  useEffect(() => {
    if (workout?.exercises?.[currentExerciseIndex]) {
      const exercise = workout.exercises[currentExerciseIndex];
      if (exercise.rest) {
        const restSeconds = parseInt(exercise.rest, 10);
        if (!isNaN(restSeconds)) {
          setRestTime(restSeconds);
        }
      }
    }
  }, [currentExerciseIndex, workout]);

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (!isPaused && workout) {
      if (isResting) {
        interval = setInterval(() => {
          setRestTime((prevTime) => {
            if (prevTime <= 1) {
              setIsResting(false);
              const nextIndex = currentExerciseIndex + 1;
              if (nextIndex < workout.exercises.length) {
                const nextExercise = workout.exercises[nextIndex];
                if (nextExercise.rest) {
                  const restSeconds = parseInt(nextExercise.rest, 10);
                  return !isNaN(restSeconds) ? restSeconds : 60;
                }
              }
              return 60; // Default rest time
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [isPaused, isResting, workout, currentExerciseIndex]);

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle completed set
  const handleCompletedSet = () => {
    const currentExercise = workout.exercises[currentExerciseIndex];
    const totalSets = parseInt(currentExercise.sets, 10);

    if (currentSetNumber < totalSets) {
      setCurrentSetNumber((prevSet) => prevSet + 1);
      setTimer(0);
      setIsResting(true);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      setCurrentSetNumber(1);
      setTimer(0);
      setIsResting(true);
    } else {
      handleWorkoutComplete();
    }
  };

  // Handler for moving to previous exercise/set
  const handlePrevious = () => {
    if (currentSetNumber > 1) {
      setCurrentSetNumber((prevSet) => prevSet - 1);
      setTimer(0);
    } else if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prevIndex) => prevIndex - 1);
      const prevExercise = workout.exercises[currentExerciseIndex - 1];
      const totalSets = parseInt(prevExercise.sets, 10);
      setCurrentSetNumber(totalSets);
      setTimer(0);
    }
  };

  // Toggle pause state
  const togglePause = () => {
    setIsPaused((prevState) => !prevState);
  };

  // Handle workout completion
  const handleWorkoutComplete = () => {
    setShowCompleteModal(true);
  };

  // Handle no workout data
  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tw`text-lg mb-4`}>No workout data available</Text>
        <TouchableOpacity
          style={tw`px-6 py-3 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`font-bold text-blue-500`}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  // Start workout screen
  if (!workoutStarted) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white mt-3`}>
        <View style={tw`flex-row justify-between items-center p-4 bg-white border-b border-gray-100`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-gray-800`}>{title} - {workout.title}</Text>
          <View style={tw`w-6`} />
        </View>

        <View style={tw`flex-1 p-5`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>First Exercise</Text>
          <Text style={tw`text-xl text-gray-700 mb-6`}>{currentExercise.name}</Text>

          {currentExercise.videoId ? (
            <View style={tw`h-64 rounded-xl overflow-hidden bg-gray-100 mb-6`}>
              <Image
                source={{ uri: `https://img.youtube.com/vi/${currentExercise.videoId}/0.jpg` }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
              <View style={tw`bg-black bg-opacity-30 absolute inset-0 items-center justify-center`}>
                <TouchableOpacity
                  style={tw`w-16 h-16 rounded-full bg-white bg-opacity-90 items-center justify-center`}
                  onPress={() => setShowVideo(true)}
                >
                  <Play size={28} color={color} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={tw`h-64 rounded-xl overflow-hidden bg-gray-100 items-center justify-center mb-6`}>
              <Dumbbell size={48} color="#ccc" />
              <Text style={tw`text-gray-500 mt-2`}>No video available</Text>
            </View>
          )}

          <View style={tw`bg-gray-50 p-4 rounded-xl mb-6`}>
            <Text style={tw`font-bold text-lg text-gray-800 mb-2`}>Instructions:</Text>
            <Text style={tw`text-gray-700 leading-5 mb-3`}>{currentExercise.description}</Text>

            <View style={tw`flex-row flex-wrap`}>
              <View style={tw`mr-4 mb-2`}>
                <Text style={tw`text-gray-500 text-sm`}>Sets</Text>
                <Text style={tw`font-bold text-gray-800`}>{currentExercise.sets}</Text>
              </View>
              <View style={tw`mr-4 mb-2`}>
                <Text style={tw`text-gray-500 text-sm`}>Reps</Text>
                <Text style={tw`font-bold text-gray-800`}>{currentExercise.reps}</Text>
              </View>
              {currentExercise.rest && (
                <View style={tw`mb-2`}>
                  <Text style={tw`text-gray-500 text-sm`}>Rest</Text>
                  <Text style={tw`font-bold text-gray-800`}>{currentExercise.rest}</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[tw`py-4 rounded-xl items-center flex-row justify-center mt-auto`, { backgroundColor: color }]}
            onPress={() => setWorkoutStarted(true)}
          >
            <Dumbbell size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-bold text-lg`}>Start Workout</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showVideo}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowVideo(false)}
        >
          <View style={tw`flex-1 bg-black`}>
            <SafeAreaView style={tw`flex-1`}>
              <View style={tw`flex-row justify-end p-4`}>
                <TouchableOpacity
                  onPress={() => setShowVideo(false)}
                  style={tw`w-10 h-10 rounded-full bg-white bg-opacity-20 items-center justify-center`}
                >
                  <X size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={tw`flex-1 justify-center`}>
                {currentExercise.videoId && (
                  <YoutubePlayer
                    height={300}
                    videoId={currentExercise.videoId}
                    play={true}
                  />
                )}
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // Main workout screen
  return (
    <SafeAreaView style={tw`flex-1 bg-white mt-3`}>
      <View style={tw`flex-row justify-between items-center p-4 bg-white border-b border-gray-100`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color="#333" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-800`}>{title} - {workout.title}</Text>
        <TouchableOpacity onPress={togglePause}>
          {isPaused ? <Play size={24} color="#333" /> : <Pause size={24} color="#333" />}
        </TouchableOpacity>
      </View>

      {isResting ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>Rest Time</Text>
          <Text style={[tw`text-6xl font-bold mb-6`, { color }]}>{formatTime(restTime)}</Text>

          {currentSetNumber < parseInt(currentExercise.sets, 10) ? (
            <>
              <Text style={tw`mt-2 text-lg text-center px-6`}>{currentExercise.name}</Text>
              <Text style={tw`mt-1 text-sm text-gray-500`}>
                Completed set {currentSetNumber} of {currentExercise.sets}
              </Text>
              <Text style={tw`mt-1 text-base font-medium`}>Next: Set {currentSetNumber + 1}</Text>
            </>
          ) : (
            <>
              <Text style={tw`mt-2 text-lg text-center px-6`}>Completed: {currentExercise.name}</Text>
              <Text style={tw`mt-1 text-sm text-gray-500`}>All {currentExercise.sets} sets done</Text>
              <Text style={tw`mt-3 text-base font-medium`}>
                Next: {workout.exercises[currentExerciseIndex + 1]?.name || 'Workout Complete'}
              </Text>
              {workout.exercises[currentExerciseIndex + 1] && (
                <Text style={tw`mt-1 text-sm text-gray-500`}>
                  {workout.exercises[currentExerciseIndex + 1].sets} sets ×{' '}
                  {workout.exercises[currentExerciseIndex + 1].reps}
                </Text>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={() => setIsResting(false)}
            style={[tw`mt-10 px-8 py-3 rounded-lg`, { backgroundColor: color }]}
          >
            <Text style={tw`text-white font-bold text-lg`}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={tw`flex-1`}>
          <View style={tw`px-5 py-4`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>{currentExercise.name}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Text style={tw`text-gray-600`}>
                Set <Text style={tw`font-medium`}>{currentSetNumber}</Text> of{' '}
                <Text style={tw`font-medium`}>{currentExercise.sets}</Text> •{' '}
                <Text style={tw`font-medium`}>{currentExercise.reps}</Text> reps
              </Text>
              {currentExercise.rest && (
                <Text style={tw`text-gray-600`}>
                  {' • '}
                  <Text style={tw`font-medium`}>{currentExercise.rest}</Text> rest
                </Text>
              )}
            </View>
          </View>

          {currentExercise.videoId ? (
            <TouchableOpacity
              style={tw`h-56 mx-4 rounded-xl overflow-hidden bg-gray-100 items-center justify-center`}
              onPress={() => setShowVideo(true)}
            >
              <Image
                source={{ uri: `https://img.youtube.com/vi/${currentExercise.videoId}/0.jpg` }}
                style={tw`w-full h-full absolute`}
                resizeMode="cover"
              />
              <View style={tw`bg-black bg-opacity-30 absolute inset-0 items-center justify-center`}>
                <View style={tw`w-16 h-16 rounded-full bg-white bg-opacity-90 items-center justify-center`}>
                  <Play size={28} color={color} />
                </View>
                <Text style={tw`text-white font-bold mt-2`}>Watch Exercise</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={tw`h-56 mx-4 rounded-xl overflow-hidden bg-gray-100 items-center justify-center`}>
              <Dumbbell size={48} color="#ccc" />
              <Text style={tw`text-gray-500 mt-2`}>No video available</Text>
            </View>
          )}

          <View style={tw`px-5 mt-4`}>
            <Text style={tw`font-bold text-lg text-gray-800 mb-2`}>Instructions:</Text>
            <Text style={tw`text-gray-700 leading-5`}>{currentExercise.description}</Text>

            <View style={tw`flex-row flex-wrap mt-4`}>
              {currentExercise.muscle && (
                <View
                  style={[tw`flex-row items-center mr-3 mb-2 px-3 py-1 rounded-full`, { backgroundColor: color }]}
                >
                  <Text style={[tw`text-sm font-medium`, { color: 'white' }]}>{currentExercise.muscle}</Text>
                </View>
              )}
              {currentExercise.equipment && (
                <View style={tw`flex-row items-center mb-2 bg-gray-200 px-3 py-1 rounded-full`}>
                  <Text style={tw`text-gray-700 text-sm font-medium`}>{currentExercise.equipment}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-100`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-gray-700`}>
                Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
              </Text>
              <Text style={tw`text-lg font-bold`}>{formatTime(timer)}</Text>
            </View>

            <View style={tw`flex-row items-center justify-center mb-4`}>
              <View style={tw`h-1 rounded-full w-full bg-gray-200`}>
                <View
                  style={[
                    tw`h-1 rounded-full`,
                    {
                      backgroundColor: color,
                      width: `${(currentSetNumber / parseInt(currentExercise.sets, 10)) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                onPress={handlePrevious}
                style={tw`px-4 py-3 bg-gray-200 rounded-lg ${
                  currentExerciseIndex === 0 && currentSetNumber === 1 ? 'opacity-50' : ''
                }`}
                disabled={currentExerciseIndex === 0 && currentSetNumber === 1}
              >
                <Text style={tw`font-semibold text-gray-800`}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCompletedSet}
                style={[tw`px-6 py-3 rounded-lg flex-row items-center`, { backgroundColor: color }]}
              >
                <Text style={tw`text-white font-bold mr-2`}>
                  {currentSetNumber < parseInt(currentExercise.sets, 10)
                    ? `Complete Set ${currentSetNumber}`
                    : currentExerciseIndex < workout.exercises.length - 1
                    ? 'Next Exercise'
                    : 'Complete Workout'}
                </Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Modal
        visible={showVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVideo(false)}
      >
        <View style={tw`flex-1 bg-black`}>
          <SafeAreaView style={tw`flex-1`}>
            <View style={tw`flex-row justify-end p-4`}>
              <TouchableOpacity
                onPress={() => setShowVideo(false)}
                style={tw`w-10 h-10 rounded-full bg-white bg-opacity-20 items-center justify-center`}
              >
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={tw`flex-1 justify-center`}>
              {currentExercise.videoId && (
                <YoutubePlayer
                  height={300}
                  videoId={currentExercise.videoId}
                  play={true}
                />
              )}
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal visible={showCompleteModal} transparent={true} animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-xl p-6 m-4 w-5/6`}>
            <View style={tw`items-center mb-4`}>
              <CheckCircle size={60} color={color} />
              <Text style={tw`text-2xl font-bold mt-4 text-gray-800`}>Workout Complete!</Text>
            </View>

            <View style={tw`my-4`}>
              <Text style={tw`text-lg text-center text-gray-700`}>Great job! You've completed:</Text>
              <Text style={tw`text-xl font-bold text-center mt-2 text-gray-800`}>{workout.title}</Text>
              <Text style={tw`text-center mt-4 text-gray-600`}>Total time: {formatTime(timer)}</Text>
              <Text style={tw`text-center mt-1 text-gray-600`}>Exercises: {workout.exercises.length}</Text>
            </View>



            <TouchableOpacity
              onPress={() => {
                setShowCompleteModal(false);
                navigation.navigate('Home');
              }}
              style={tw`mt-3 py-3 rounded-lg border border-gray-300`}
            >
              <Text style={tw`text-center font-semibold text-gray-700`}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WorkoutSessionScreen;