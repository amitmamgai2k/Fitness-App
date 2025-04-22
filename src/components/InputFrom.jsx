import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../../tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const InputForm = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    height: { feet: 5, inches: 9, cm: 0 },
    heightUnit: 'ft_in'
  });

  const isFormValid = () => {
    return (
      userData.name.trim() !== '' &&
      userData.age.trim() !== '' &&
      userData.gender !== '' &&
      (userData.heightUnit === 'cm'
        ? userData.height.cm > 0
        : userData.height.feet > 0 || userData.height.inches > 0)
    );
  };

  const handleTextChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleGenderSelect = (gender) => {
    setUserData({ ...userData, gender });
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('Form Incomplete', 'Please fill all required fields.');
      return;
    }

    try {
      // Save user data to AsyncStorage
      await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
      console.log('Data saved locally:', userData);

      // Navigate to Home with the data
      navigation.navigate('Home', { userData });
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert(
        'Storage Error',
        'Could not save your data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const ftInToCm = (feet, inches) => {
    return Math.round((Number(feet) * 30.48) + (Number(inches) * 2.54));
  };

  const handleFeetInput = (text) => {
    let feet = parseInt(text);
    if (isNaN(feet)) feet = 0;

    setUserData(prevState => ({
      ...prevState,
      height: {
        ...prevState.height,
        feet,
        cm: ftInToCm(feet, prevState.height.inches)
      }
    }));
  };

  const handleInchesInput = (text) => {
    let inches = parseInt(text);
    if (isNaN(inches)) inches = 0;
    inches = Math.min(11, Math.max(0, inches));

    setUserData(prevState => ({
      ...prevState,
      height: {
        ...prevState.height,
        inches,
        cm: ftInToCm(prevState.height.feet, inches)
      }
    }));
  };

  const handleCmInput = (text) => {
    const cmValue = parseInt(text);
    if (isNaN(cmValue)) return;

    const totalInches = cmValue / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    setUserData({
      ...userData,
      height: { feet, inches, cm: cmValue }
    });
  };

  const displayCm = userData.height.cm || ftInToCm(userData.height.feet, userData.height.inches);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 py-8`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mb-8 items-center`}>
          <Text style={tw`text-3xl text-gray-800 font-bold mb-2`}>
            Your Fitness Profile
          </Text>
          <Text style={tw`text-gray-600 text-lg text-center`}>
            Complete your profile to get personalized fitness recommendations
          </Text>
        </View>

        {/* Name Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold text-gray-700 mb-2 ml-1`}>
            What's your name?
          </Text>
          <TextInput
            style={tw`border-2 border-gray-300 rounded-xl p-4 text-lg bg-white`}
            placeholder="Enter your name"
            value={userData.name}
            onChangeText={(text) => handleTextChange('name', text)}
          />
        </View>

        {/* Age Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold text-gray-700 mb-2 ml-1`}>
            What's your age?
          </Text>
          <TextInput
            style={tw`border-2 border-gray-300 rounded-xl p-4 text-lg bg-white`}
            placeholder="Enter your age"
            keyboardType="numeric"
            maxLength={3}
            value={userData.age}
            onChangeText={(text) => handleTextChange('age', text)}
          />
        </View>

        {/* Gender Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold text-gray-700 mb-4 ml-1`}>
            What's your gender?
          </Text>
          <View style={tw`flex-row justify-around`}>
            {['male', 'female'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  tw`items-center justify-center p-3 border rounded-lg w-2/5`,
                  userData.gender === gender
                    ? tw`bg-blue-50 border-blue-500`
                    : tw`border-gray-300`
                ]}
                onPress={() => handleGenderSelect(gender)}
              >
                <Image
                  source={
                    gender === 'male'
                      ? require('../../assets/male-icon.png')
                      : require('../../assets/female-icon.png')
                  }
                  style={tw`w-12 h-16 mb-2`}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    tw`text-base`,
                    userData.gender === gender
                      ? tw`text-blue-500 font-bold`
                      : tw`text-gray-500`
                  ]}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Height Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold text-gray-700 mb-3 ml-1`}>
            How tall are you?
          </Text>
          <View style={tw`flex-row justify-center mb-5`}>
            <TouchableOpacity
              style={[
                tw`py-2 px-6 border rounded-l-lg`,
                userData.heightUnit === 'ft_in'
                  ? tw`bg-blue-500 border-blue-500`
                  : tw`bg-gray-100 border-gray-300`
              ]}
              onPress={() => setUserData({ ...userData, heightUnit: 'ft_in' })}
            >
              <Text style={tw`${userData.heightUnit === 'ft_in' ? 'text-white' : 'text-gray-700'} font-medium`}>
                Feet & Inches
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tw`py-2 px-6 border rounded-r-lg`,
                userData.heightUnit === 'cm'
                  ? tw`bg-blue-500 border-blue-500`
                  : tw`bg-gray-100 border-gray-300`
              ]}
              onPress={() => setUserData({ ...userData, heightUnit: 'cm' })}
            >
              <Text style={tw`${userData.heightUnit === 'cm' ? 'text-white' : 'text-gray-700'} font-medium`}>
                Centimeters
              </Text>
            </TouchableOpacity>
          </View>

          {userData.heightUnit === 'ft_in' ? (
            <View style={tw`w-full`}>
              <View style={tw`flex-row justify-between`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={tw`text-sm text-gray-500 mb-1 ml-1`}>Feet</Text>
                  <TextInput
                    style={tw`border-2 border-gray-300 rounded-lg p-4 text-lg bg-white text-center`}
                    keyboardType="numeric"
                    maxLength={1}
                    value={(userData.height.feet || '').toString()}
                    onChangeText={(text) => handleFeetInput(text)}
                    placeholder="0"
                  />
                </View>
                <View style={tw`flex-1 ml-2`}>
                  <Text style={tw`text-sm text-gray-500 mb-1 ml-1`}>Inches</Text>
                  <TextInput
                    style={tw`border-2 border-gray-300 rounded-lg p-4 text-lg bg-white text-center`}
                    keyboardType="numeric"
                    maxLength={2}
                    value={(userData.height.inches || '').toString()}
                    onChangeText={(text) => handleInchesInput(text)}
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={tw`mt-3 items-center`}>
                <Text style={tw`text-xl text-gray-800`}>
                  {userData.height.feet} ft {userData.height.inches} in
                </Text>
                <Text style={tw`text-gray-500 text-sm`}>
                  ({displayCm} cm)
                </Text>
              </View>
            </View>
          ) : (
            <View style={tw`w-full`}>
              <TextInput
                style={tw`border-2 border-gray-300 rounded-lg p-4 text-lg bg-white text-center`}
                keyboardType="numeric"
                maxLength={3}
                value={(displayCm || '').toString()}
                onChangeText={(text) => handleCmInput(text)}
                placeholder="0"
              />
              <View style={tw`mt-3 items-center`}>
                <Text style={tw`text-xl text-gray-800`}>
                  {displayCm} cm
                </Text>
                <Text style={tw`text-gray-500 text-sm`}>
                  ({userData.height.feet} ft {userData.height.inches} in)
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Info Card */}
        <View style={tw`mt-2 mb-8 bg-blue-50 p-4 rounded-xl`}>
          <Text style={tw`text-blue-800 font-medium mb-1 text-base`}>
            Why we need this information
          </Text>
          <Text style={tw`text-blue-700 text-sm`}>
            Your personal details help us create a customized fitness plan that's tailored to your specific needs and goals.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button - Fixed at bottom */}
      <View style={tw`px-6 py-4 border-t border-gray-200 bg-white`}>
        <TouchableOpacity
          style={[
            tw`rounded-xl py-4 items-center justify-center`,
            isFormValid() ? tw`bg-blue-600` : tw`bg-gray-300`
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid()}
        >
          <Text style={tw`text-white font-bold text-lg`}>
            SAVE AND CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InputForm;