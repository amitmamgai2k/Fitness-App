import React from "react";
import { Text, View, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview"; // Import WebView
import tw from "../../tailwind";
import {  Target ,Crosshair,Dumbbell,Undo2 } from 'lucide-react-native';



const ExerciseDetails = ({ route }) => {
	const { exercise } = route.params || {};
	console.log("Exercise Details:", exercise);

    const secondary = (exercise.secondaryMuscles?.length > 0)
    ? exercise.secondaryMuscles.join(", ")
    : "None specified";


	if (!exercise) {
        setLoading(true);
		return (
			<SafeAreaView style={tw`flex-1 bg-white`}>

				<Text style={tw`text-center mt-4`}>No exercise data available</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={tw`flex-1 bg-white`}>
			<ScrollView contentContainerStyle={tw`p-4`}>
				<Text style={tw`text-4xl font-bold tracking-wider text-center mb-4 text-pink-600 uppercase bg-gray-50 self-center p-2 rounded-lg`}>
					{exercise.name || "Unnamed Exercise"}
				</Text>

				{exercise.gifUrl && (
                    <View style={tw`border-solid border-2 border-gray-400 rounded-lg`}>
					<WebView
						source={{ uri: exercise.gifUrl }}
						style={tw`w-70 h-60   self-center rounded-full mb-4`}
						scalesPageToFit={true}
						javaScriptEnabled={true}
					/>
                    </View>
				)}
                <View style={tw`mt-4 gap-2 bg-gray-100 p-2 rounded-xl`}>
                <View style={tw` flex-row items-center gap-1 bg-yellow-100 p-2 rounded-lg`} >
                 <Target color="#FF0000" style={tw`bg-pink-200 p-6 rounded-lg`} size={10} />
                 <Text style={tw`text-2xl font-bold tracking-wider text-pink-600 `}> Targeted Muscle - <Text style={tw`text-2xl font-bold tracking-wider text-pink-600 `}>{exercise.target.toUpperCase()}</Text></Text>
                 </View>

                 <View style={tw` flex-row items-center gap-1 bg-orange-100 p-2 rounded-lg`} >
                 <Crosshair color="blue" style={tw`bg-blue-200 p-6 rounded-lg`} size={10} />
                 <Text style={tw`text-2xl font-bold tracking-wider text-blue-600  `}> Targeted Body Part - <Text style={tw`text-2xl font-bold tracking-wider text-blue-600 `}>{exercise.bodyPart.toUpperCase()}</Text></Text>
                 </View>
                 <View style={tw` flex-row items-center gap-1 bg-green-100 p-2 rounded-lg`} >
                 <Dumbbell color="gray" style={tw`bg-gray-200 p-6 rounded-lg`} size={10} />
                 <Text style={tw`text-2xl font-bold tracking-wider text-violet-600  `}> Equipment - <Text style={tw`text-2xl font-bold tracking-wider text-violet-600 `}>{exercise.equipment.toUpperCase()}</Text></Text>
                 </View>
                 <View style={tw` flex-row items-center gap-1 bg-blue-100 p-2 rounded-lg`} >
                 <Undo2  color="orange" style={tw`bg-orange-200 p-6 rounded-lg`} size={10} />
                 <Text style={tw`text-2xl font-bold tracking-wider text-green-600 `}> Secondary Muscle - <Text style={tw`text-2xl font-bold tracking-wider text-green-600 `}>{secondary.toUpperCase()}</Text></Text>
                 </View>
                </View>


					<View>
						<View style={tw`flex-row items-center mb-2 mt-3 pl-2`}>

							<Text style={tw`text-2xl font-semibold text-gray-700`}>Follow This Steps For Correct Workout </Text>
						</View>
						<View style={tw`pl-3 bg-red-50  p-2 rounded-lg`}>
							{exercise.instructions && exercise.instructions.length > 0 ? (
								exercise.instructions.map((instruction, index) => (
									<View key={index} style={tw`flex-row mb-1`}>
										<Text style={tw`text-lg font-bold text-gray-600 w-6`}>{`${index + 1}.`}</Text>
										<Text style={tw`text-lg font-semibold text-gray-600 flex-1`}>
											{instruction}
										</Text>
									</View>
								))
							) : (
								<Text style={tw`text-base text-gray-600`}>None specified</Text>
							)}
						</View>
					</View>





			</ScrollView>
		</SafeAreaView>
	);
};

export default ExerciseDetails;
