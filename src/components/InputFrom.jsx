import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../../tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


const InputFrom = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    height: { feet: 5, inches: 9, cm: 0 },
    heightUnit: 'ft_in'
  });

  const isCurrentScreenValid = () => {
    switch (currentScreen) {
      case 0:
        return userData.name.trim() !== '' && userData.age.trim() !== '';
      case 1:
        return userData.gender !== '';
      case 2:
        return userData.heightUnit === 'cm'
          ? userData.height.cm > 0
          : userData.height.feet > 0 || userData.height.inches > 0;
      default:
        return false;
    }
  };

  const handleTextChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleGenderSelect = (gender) => {
    setUserData({ ...userData, gender });
  };

  const handleNext = async () => {
    if (!isCurrentScreenValid()) return;

    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
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
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
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

  const renderNameAgeScreen = () => {
    return (
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <View style={tw`w-full mb-10 items-center`}>
          <Text style={tw`text-4xl text-gray-800 font-bold mb-3 text-center`}>
            Personal Information
          </Text>
          <Text style={tw`text-gray-600 text-xl text-center`}>
            Let's set up your fitness profile
          </Text>
        </View>

        {/* Name Input */}
        <View style={tw`w-full mb-8`}>

          <TextInput
            style={tw`border-2 border-gray-300 rounded-xl p-5 text-xl bg-white w-full text-center`}
            placeholder="Enter your name"
            value={userData.name}
            onChangeText={(text) => handleTextChange('name', text)}
          />
        </View>

        {/* Age Input */}
        <View style={tw`w-full mb-8`}>

          <TextInput
            style={tw`border-2 border-gray-300 rounded-xl p-5 text-xl bg-white w-full text-center`}
            placeholder="Enter your age"
            keyboardType="numeric"
            maxLength={3}
            value={userData.age}
            onChangeText={(text) => handleTextChange('age', text)}
          />
        </View>

        {/* Tips */}
        <View style={tw`mt-6 bg-blue-50 p-5 rounded-xl w-full`}>
          <Text style={tw`text-blue-800 font-medium mb-2 text-lg text-center`}>
            Why we ask for this
          </Text>
          <Text style={tw`text-blue-700 text-center text-base`}>
            Your age and personal details help us create a customized fitness plan that's right for you.
          </Text>
        </View>
      </View>
    );
  };

  const renderGenderScreen = () => (
    <View style={tw`flex-1 justify-center items-center px-10`}>
      <View style={tw`flex-row items-center mb-8 w-full`}>
        <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
          <Text style={tw`text-gray-500 text-5xl`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-2xl text-gray-700 font-medium`}>What's your gender?</Text>
      </View>

      <View style={tw`flex-row justify-around w-full mb-16`}>
        {['male', 'female'].map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              tw`items-center justify-center p-4 w-32 border rounded-lg`,
              userData.gender === gender
                ? tw`bg-gray-100 border-yellow-500`
                : tw`border-gray-400`
            ]}
            onPress={() => handleGenderSelect(gender)}
          >
            <Image
              source={
                gender === 'male'
                  ? require('../../assets/male-icon.png')
                  : require('../../assets/female-icon.png')
              }
              style={tw`w-16 h-24 mb-4`}
              resizeMode="contain"
            />
            <Text
              style={[
                tw`text-base`,
                userData.gender === gender
                  ? tw`text-yellow-500 font-bold`
                  : tw`text-gray-400`
              ]}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderHeightScreen = () => {
    const displayCm = userData.height.cm || ftInToCm(userData.height.feet, userData.height.inches);

    return (
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <View style={tw`flex-row items-center mb-8 w-full`}>
          <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
            <Text style={tw`text-gray-500 text-5xl`}>←</Text>
          </TouchableOpacity>
          <Text style={tw`text-2xl text-gray-700 font-medium`}>How tall are you?</Text>
        </View>

        <View style={tw`flex-row mb-8`}>
          <TouchableOpacity
            style={[
              tw`py-3 px-8 border rounded-l-lg`,
              userData.heightUnit === 'ft_in'
                ? tw`bg-orange-400 border-orange-500`
                : tw`bg-gray-100 border-gray-300`
            ]}
            onPress={() => setUserData({ ...userData, heightUnit: 'ft_in' })}
          >
            <Text style={tw`${userData.heightUnit === 'ft_in' ? 'text-white' : 'text-gray-800'} text-lg font-medium`}>
              Feet & Inches
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`py-3 px-8 border rounded-r-lg`,
              userData.heightUnit === 'cm'
                ? tw`bg-yellow-400 border-yellow-500`
                : tw`bg-gray-100 border-gray-300`
            ]}
            onPress={() => setUserData({ ...userData, heightUnit: 'cm' })}
          >
            <Text style={tw`${userData.heightUnit === 'cm' ? 'text-white' : 'text-gray-800'} text-lg font-medium`}>
              Centimeters
            </Text>
          </TouchableOpacity>
        </View>

        {userData.heightUnit === 'ft_in' ? (
          <View style={tw`w-full px-4`}>
            <Text style={tw`text-center text-2xl font-medium mb-4 text-gray-600`}>Enter your height</Text>
            <View style={tw`flex-row justify-between`}>
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-sm text-center text-gray-500 mb-1`}>Feet</Text>
                <TextInput
                  style={tw`border-2 border-gray-300 rounded-lg p-4 text-xl bg-white text-center`}
                  keyboardType="numeric"
                  maxLength={1}
                  value={(userData.height.feet || '').toString()}
                  onChangeText={(text) => handleFeetInput(text)}
                  placeholder="0"
                />
              </View>
              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-sm text-center text-gray-500 mb-1`}>Inches</Text>
                <TextInput
                  style={tw`border-2 border-gray-300 rounded-lg p-4 text-xl bg-white text-center`}
                  keyboardType="numeric"
                  maxLength={2}
                  value={(userData.height.inches || '').toString()}
                  onChangeText={(text) => handleInchesInput(text)}
                  placeholder="0"
                />
              </View>
            </View>

            <View style={tw`mt-6 items-center`}>
              <Text style={tw`text-3xl text-gray-800 font-light`}>
                {userData.height.feet} ft {userData.height.inches} in
              </Text>
              <Text style={tw`text-gray-500 mt-1`}>
                ({displayCm} cm)
              </Text>
            </View>
          </View>
        ) : (
          <View style={tw`w-full px-4`}>
            <Text style={tw`text-center text-2xl font-medium mb-4 text-gray-600`}>Enter your height</Text>
            <TextInput
              style={tw`border-2 border-gray-300 rounded-lg p-4 text-xl bg-white text-center`}
              keyboardType="numeric"
              maxLength={3}
              value={(displayCm || '').toString()}
              onChangeText={(text) => handleCmInput(text)}
              placeholder="0"
            />
            <View style={tw`mt-6 items-center`}>
              <Text style={tw`text-3xl text-gray-800 font-light`}>
                {displayCm} cm
              </Text>
              <Text style={tw`text-gray-500 mt-1`}>
                ({userData.height.feet} ft {userData.height.inches} in)
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 0:
        return renderNameAgeScreen();
      case 1:
        return renderGenderScreen();
      case 2:
        return renderHeightScreen();
      default:
        return renderNameAgeScreen();
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {renderCurrentScreen()}

      <View style={tw`px-6 mb-10`}>
        <Pressable
          style={[
            tw`rounded-full py-4 items-center justify-center`,
            isCurrentScreenValid() ? tw`bg-blue-600` : tw`bg-gray-300`
          ]}
          onPress={handleNext}
          disabled={!isCurrentScreenValid()}
        >
          <Text style={tw`text-white font-bold text-lg`}>
            {currentScreen === 2 ? 'FINISH' : 'NEXT'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default InputFrom;
