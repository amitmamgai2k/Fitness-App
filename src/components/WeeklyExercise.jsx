import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from '../../tailwind';

const WeeklyExercise = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const weekdays = [
    { day: "MON", fullName: "Monday", color: "#FF5757" },
    { day: "TUE", fullName: "Tuesday", color: "#FF9F57" },
    { day: "WED", fullName: "Wednesday", color: "#FFDE59" },
    { day: "THU", fullName: "Thursday", color: "#4CAF50" },
    { day: "FRI", fullName: "Friday", color: "#2196F3" },
    { day: "SAT", fullName: "Saturday", color: "#9C27B0" },
    { day: "SUN", fullName: "Sunday", color: "#E91E63" }
  ];

  return (
    <View style={tw`mt-6`}>
      <Text style={tw`text-4xl text-gray-900 font-bold mb-2 tracking-wider`}>
        Weekly Exercise Plan
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`items-center bg-gray-50 p-2`}
      >
        {weekdays.map((item) => (
          <TouchableOpacity
            key={item.day}
            onPress={() => {
              navigation.navigate('WeekExercise', {
                title: item.fullName,
                color: item.color
              });
              setSelectedCategory(item.day);
            }}
            style={[
              tw`mr-4 rounded-xl overflow-hidden shadow-md`,
              {
                backgroundColor: selectedCategory === item.day
                  ? '#eeeeee' : 'white',
                borderWidth: 2,
                borderColor: selectedCategory === item.day
                  ? 'rgb(219 39 119)' : 'rgba(0,0,0,0.1)',
                width: 120,
                height: 160
              }
            ]}
          >
            <View style={tw`items-center justify-center h-full`}>
              <View
                style={[
                  tw`rounded-full items-center justify-center mb-3`,
                  {
                    backgroundColor: `${item.color}20`, // 20% opacity of the color
                    width: 100,
                    height: 100,
                    transform: [
                      { scale: selectedCategory === item.day ? 0.95 : 1 }
                    ]
                  }
                ]}
              >
                <Text
                  style={[
                    tw`text-2xl font-bold`,
                    { color: item.color }
                  ]}
                >
                  {item.day}
                </Text>
              </View>
              <Text
                style={[
                  tw`text-base font-semibold`,
                  {
                    color: selectedCategory === item.day
                      ? 'rgb(219 39 119)' : 'rgba(55, 65, 81, 1)'
                  }
                ]}
              >
                {item.fullName}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default WeeklyExercise;