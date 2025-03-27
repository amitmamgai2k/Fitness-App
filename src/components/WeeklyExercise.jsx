import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import tw from '../../tailwind'

const WeeklyExercise = ({navigation,route}) => {
  return (
    <View>
     <Text style={tw`text-3xl text-gray-900 font-bold mb-2 tracking-wider mt-2`}>Weekly Exercise</Text>


    </View>
  )
}

export default WeeklyExercise

const styles = StyleSheet.create({})