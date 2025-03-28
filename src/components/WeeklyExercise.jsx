import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react'
import tw from '../../tailwind'
import { useState } from 'react';



const WeeklyExercise = ({navigation,route}) => {
   const [selectedCategory, setSelectedCategory] = useState(null);
  const Weekdata = [
    {
      week: "Monday",
      image: require("../../assets/days/mon.png"
 )   },
    {
      week: "Tuesday",
      image: require("../../assets/days/tue.png")
    },
    {
      week: "Wednesday",
      image: require("../../assets/days/wed.png")
    },
    {
      week: "Thursday",
      image: require("../../assets/days/thu.png")
    },
    {
      week: "Friday",
      image: require("../../assets/days/fri.png")
    },
    {
      week: "Saturday",
      image: require("../../assets/days/sat.png")
    },
    {
      week: "Sunday",
      image: require("../../assets/days/sun.png")
    }
  ];

  return (
    <View style={tw`mt-6 `}>
    <Text style={tw`text-4xl text-gray-900 font-bold mb-2 tracking-wider`}>
     Weekly Exercise Plan
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw` items-center bg-gray-50 p-2 `}
    >
      {Weekdata.map((part) => (
        <TouchableOpacity
          key={part.week}
          onPress={() => {

              setSelectedCategory(part.week);

          }}

          style={[
            tw`mr-4 rounded-xl overflow-hidden shadow-md`,
            {
              backgroundColor: selectedCategory === part.week
                ? '#eeeeee' : 'white',
              borderWidth: 2,
              borderColor: selectedCategory === part.week
                ? 'rgb(219 39 119)' : 'rgba(0,0,0,0.1)',
            }
          ]}
        >
          <View style={tw`items-center`}>
            <Image
              source={ part.image }
              style={[
                tw`w-35 h-40 rounded-xl`,
                {
                  opacity: selectedCategory === part.week ? 0.8 : 1,
                  transform: [
                    { scale: selectedCategory === part.week ? 0.95 : 1 }
                  ]
                }
              ]}
              resizeMode="cover"
            />
            <Text
              style={[
                tw`mt-3 mb-3 text-base font-semibold`,
                {
                  color: selectedCategory === part.week
                    ? 'rgb(219 39 119)' : 'rgba(55, 65, 81, 1)'
                }
              ]}
            >
              {part.week}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
  )
}

export default WeeklyExercise

