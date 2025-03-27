import { StyleSheet, Text, View, Image, ScrollView,ActivityIndicator } from 'react-native';
import { useState,useEffect } from 'react';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../../tailwind';

const AllExercise = ({ route }) => {
  const { title } = route.params || {};
  const { image } = route.params || {};
  const [exercise, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'f21b049adfmsh949b3b50c4cae42p1f3cb0jsnf76c04510318'; // replace with your key

  const getExercises = async () => {
    try {
      const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${title.toLowerCase()}?limit=30&offset=0`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      });

      const data = await response.json();

      setExercises(data.slice(0, 30)); // just show first 10


    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExercises();
  }, [title]);


  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
 <ScrollView
        contentContainerStyle={tw`p-4`}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Text style={tw`text-4xl font-bold tracking-wider text-center`}>
          <Text style={tw`text-pink-600`}>{title}</Text> Exercise
        </Text>

        <Image
          source={{ uri: image }}
          style={[
            tw`self-center mt-6 rounded-full border-2 border-pink-600`,
            { width: 280, height: 280 },
          ]}
          resizeMode="cover"
        />

        <View style={tw`mt-8`}>
          <Text style={tw`text-2xl font-semibold mb-4 text-center border-solid border-1 bg-gray-50 w-1/2  self-center p-2 rounded-lg` }>Available Workouts</Text>
          {loading ? (
          <ActivityIndicator size="large" color="#f472b6" />
        ):(

          <View style={tw`flex-row flex-wrap justify-between gap-2`}>
            {exercise.map((item, index) => (
              <View
                key={index}
                style={tw`w-[48%] h-60 bg-gray-100 mb-1 rounded-xl pt-4 pb-4 items-center justify-between shadow-md`}
              >
                <Image
              source={item.gifUrl ? { uri: item.gifUrl } : require('../../assets/male-icon.png')}
                style={tw`w-[90%] h-[80%] rounded-xl  border-2 border-gray-400 `}
                />
                <Text style={tw`text-black text-lg text-center font-semibold bg-gray-100 px-2 py-1 rounded-xl`}>
                {item.name.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>)
}

        </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default AllExercise;

const styles = StyleSheet.create({});
