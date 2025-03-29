import { SafeAreaView, Text, View, Image } from 'react-native';
import React from 'react';
import tw from '../../tailwind';
import { StatusBar } from 'expo-status-bar';

import ImageSlider from './ImageSlider';
import Exercise from './Exercise';
import WeeklyExercise from './WeeklyExercise';

const Home = ({ navigation, route }) => {
  const { userData } = route.params || {};

  return (
    <SafeAreaView style={tw`flex-1 bg-white mt-10`}>
      <StatusBar style="dark" />
      <View style={tw`flex-1 px-5 pt-2 `}>
        {/* Main Content */}
        <View style={tw`flex-row items-center justify-between mt-2 `}>
          <View>
            <Text style={tw`text-4xl text-gray-800 font-bold tracking-wider`}>READY TO</Text>
            <Text style={tw`text-4xl text-pink-600 font-bold tracking-wider`}>WORKOUT</Text>


          </View>
          <View style={tw`w-10 h-10 rounded-full  mr-5 mt-[-32]`}>
              <Image
                source={require('../../assets/avatar.png')}
                style={tw`w-20 h-20 rounded-full`}

              />
            </View>


        </View>
        <View>
          <ImageSlider/>
        </View>
        <Exercise navigation={navigation} />
        <View ><WeeklyExercise navigation={navigation} /></View>



      </View>
    </SafeAreaView>
  );
};

export default Home;