import { SafeAreaView, Image, Dimensions, Text, View, Pressable } from "react-native";
import React from "react";
import Start from "./src/components/Start";
import Home from "./src/components/Home";
import InputFrom from "./src/components/InputFrom";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllExercise from "./src/components/AllExercise";
import ExerciseDetails from "./src/components/ExerciseDetails";
import WeekExerciseDetails from "./src/components/WeekExerciseDetails";
import SingleExerciseDetails from "./src/components/SingleExerciseDetails";
import UserProfile from "./src/components/UserProfile";
import WorkoutSessionScreen from "./src/components/StartWorkout";
import MyWorkouts from "./src/components/Navigation/MyWorkouts";
import StepCounterApp from "./src/components/DailyStepsCount";
import CreatePlan from "./src/components/Navigation/CreatePlan";


const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Start">
				<Stack.Screen
          name="Start"
          component={Start}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
        name = 'Home'
        component={Home}
        options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
        name = 'Form'
        component={InputFrom}
        options={{
            headerShown: false,
          }}
        />
          <Stack.Screen
        name = 'Workout'
        component={AllExercise}
        options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
        name = 'ExerciseDetails'
        component={ExerciseDetails}
        options={{
            headerShown: false,
          }}
        />
           <Stack.Screen
        name = 'WeekExercise'
        component={WeekExerciseDetails}
        options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
        name = 'ExerciseDetail'
        component={SingleExerciseDetails}
        options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
        name = 'UserProfile'
        component={UserProfile}
        options={{
            headerShown: false,
          }}
        />
           <Stack.Screen
        name = 'WorkoutSessionScreen'
        component={ WorkoutSessionScreen }
        options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
        name = 'MyWorkouts'
        component={ MyWorkouts }
        options={{
            headerShown: false,
          }}
        />
          <Stack.Screen
        name = 'Steps'
        component={ StepCounterApp }
        options={{
            headerShown: false,
          }}
        />
          <Stack.Screen
        name = 'CreatePlan'
        component={ CreatePlan }
        options={{
            headerShown: false,
          }}
        />




			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
