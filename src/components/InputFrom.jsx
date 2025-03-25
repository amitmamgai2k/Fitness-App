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
import { Picker } from '@react-native-picker/picker';



const InputFrom = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [userData, setUserData] = useState({
    gender: '',
    height: { feet: 5, inches: 9 },
    birthday: { month: 'Jun', day: '15', year: '1985' },
     heightUnit: 'ft_in'
  });

  // List of available options for pickers
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 80 }, (_, i) => (2025 - i).toString());
  const feet = Array.from({ length: 8 }, (_, i) => (i + 1));
  const inches = Array.from({ length: 12 }, (_, i) => i);

  // Function to check if the current screen has valid data
  const isCurrentScreenValid = () => {
    switch (currentScreen) {
      case 0:
        return userData.gender !== ''; // Gender must be selected
      case 1:
        return userData.height.feet > 0 || userData.height.inches > 0;
      case 2:
        return userData.birthday.month && userData.birthday.day && userData.birthday.year; // All birthday fields must be filled
      default:
        return false;
    }
  };

  const handleGenderSelect = (gender) => {
    setUserData({ ...userData, gender });
  };

  const handleHeightChange = (type, value) => {
    setUserData({
      ...userData,
      height: { ...userData.height, [type]: value }
    });
  };

  const handleBirthdayChange = (type, value) => {
    setUserData({
      ...userData,
      birthday: { ...userData.birthday, [type]: value }
    });
  };

  const handleNext = () => {
    if (!isCurrentScreenValid()) return;

    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Handle form completion here
      console.log('Form completed with data:', userData);
      // You could navigate to the next screen or submit the data
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const renderGenderScreen = () => {
    return (
      <View style={tw`flex-1 justify-center items-center px-10`}>
        <Text style={tw`text-4xl text-gray-700 font-medium mb-12`}>What's your gender?</Text>

        <View style={tw`flex-row justify-around w-full mb-16`}>
          <TouchableOpacity
            style={[
              tw`items-center justify-center p-4 w-32 border border-gray-400 rounded-lg `,
              userData.gender === 'male' && tw`bg-gray-100 rounded-lg border-yellow-500 `
            ]}
            onPress={() => handleGenderSelect('male')}
          >
            <View style={tw`w-16 h-24 mb-4 justify-center items-center  `}>
              <Image
                source={require('../../assets/male-icon.png')}
                style={tw`w-20 h-24 `}
                resizeMode="contain"
              />
            </View>
            <Text style={[
              tw`text-base`,
              userData.gender === 'male' ? tw`text-yellow-500 font-bold` : tw`text-gray-400`
            ]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`items-center justify-center p-4 w-32 border border-gray-400 rounded-lg`,
              userData.gender === 'female' && tw`bg-gray-100 rounded-lg border-yellow-500 `
            ]}
            onPress={() => handleGenderSelect('female')}
          >
            <View style={tw`w-16 h-24 mb-4 justify-center items-center`}>
              <Image
                source={require('../../assets/female-icon.png')}
                style={tw`w-12 h-24`}
                resizeMode="contain"
              />
            </View>
            <Text style={[
              tw`text-base`,
              userData.gender === 'female' ? tw`text-yellow-500 font-bold` : tw`text-gray-400`
            ]}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };



const renderHeightScreen = () => {
  // Conversion functions
  const ftInToCm = (feet, inches) => {
    return Math.round((feet * 30.48) + (inches * 2.54));
  };

  const cmToFtIn = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };


  const handleFeetInput = (text) => {
    const feet = text === '' ? 0 : parseInt(text);
    setUserData({
      ...userData,
      height: { ...userData.height, feet }
    });
  };

  // Handle text input changes for inches
  const handleInchesInput = (text) => {
    const inches = text === '' ? 0 : parseInt(text);
    // Ensure inches are between 0-11
    const validInches = Math.min(11, Math.max(0, inches));
    setUserData({
      ...userData,
      height: { ...userData.height, inches: validInches }
    });
  };

  // Handle text input changes for cm
  const handleCmInput = (text) => {
    if (text === '') {
      setUserData({
        ...userData,
        height: { feet: 0, inches: 0 }
      });
      return;
    }

    const cm = parseInt(text);
    if (!isNaN(cm)) {
      const { feet, inches } = cmToFtIn(cm);
      setUserData({
        ...userData,
        height: { feet, inches }
      });
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center px-6`}>
      <View style={tw`flex-row items-center mb-8 w-full`}>
        <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
          <Text style={tw`text-gray-500 text-5xl`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-2xl text-gray-700 font-medium`}>How tall are you?</Text>
      </View>


      <View style={tw`flex-row items-center mb-8 w-full justify-center`}>
        <TouchableOpacity
          style={[
            tw`py-3 px-8 rounded-tl-lg rounded-bl-lg border border-gray-300`,
            userData.heightUnit === 'ft_in' ? tw`bg-orange-400 ` : tw`bg-gray-100`
          ]}
          onPress={() => setUserData({...userData, heightUnit: 'ft_in'})}
        >
          <Text style={[
            tw`text-center text-lg font-medium`,
            userData.heightUnit === 'ft_in' ? tw`text-white` : tw`text-gray-800`
          ]}>Feet & Inches</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`py-3 px-8 rounded-tr-lg rounded-br-lg border border-gray-300`,
            userData.heightUnit === 'cm' ? tw`bg-yellow-400 border-yellow-500` : tw`bg-gray-100`
          ]}
          onPress={() => setUserData({...userData, heightUnit: 'cm'})}
        >
          <Text style={[
            tw`text-center font-medium text-lg`,
            userData.heightUnit === 'cm' ? tw`text-white` : tw`text-gray-800`
          ]}>Centimeters</Text>
        </TouchableOpacity>
      </View>


      {userData.heightUnit === 'ft_in' ? (
        <View style={tw`w-full px-4`}>
          <Text style={tw`text-lg text-gray-600 mb-2 font-medium text-center text-2xl`}>Enter your height</Text>

          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-sm text-gray-500 mb-1`}>Feet</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-4 text-lg bg-white`}
                keyboardType="numeric"
                maxLength={1}
                value={userData.height.feet.toString()}
                onChangeText={handleFeetInput}
                placeholder="0"
              />
            </View>

            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-sm text-gray-500 mb-1`}>Inches</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-4 text-lg bg-white`}
                keyboardType="numeric"
                maxLength={2}
                value={userData.height.inches.toString()}
                onChangeText={handleInchesInput}
                placeholder="0"
              />
            </View>
          </View>

          <View style={tw`mt-4 items-center`}>
            <Text style={tw`text-3xl text-gray-800 font-light`}>
              {userData.height.feet} ft {userData.height.inches} in
            </Text>
            <Text style={tw`text-gray-500 mt-1`}>
              ({ftInToCm(userData.height.feet, userData.height.inches)} cm)
            </Text>
          </View>
        </View>
      ) : (
        <View style={tw`w-full px-4`}>
          <Text style={tw`text-lg text-gray-600 mb-2 font-medium text-2xl text-center mb-4`}>Enter your height</Text>

          <TextInput
            style={tw`border border-gray-300 rounded-lg p-4 text-lg bg-white`}
            keyboardType="numeric"
            maxLength={3}
            value={ftInToCm(userData.height.feet, userData.height.inches).toString()}
            onChangeText={handleCmInput}
            placeholder="0"
          />

          <View style={tw`mt-4 items-center`}>
            <Text style={tw`text-3xl text-gray-800 font-light`}>
              {ftInToCm(userData.height.feet, userData.height.inches)} cm
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

  const renderBirthdayScreen = () => {
    return (
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <View style={tw`flex-row items-center mb-10`}>
          <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
            <Text style={tw`text-gray-500 text-2xl`}>←</Text>
          </TouchableOpacity>
          <Text style={tw`text-2xl text-gray-700 font-medium`}>What's your birthday?</Text>
        </View>

        <View style={tw`flex-row justify-between w-full mb-12`}>
          <View style={tw`items-center`}>
            <Picker
              selectedValue={userData.birthday.month}
              style={tw`h-48 w-24`}
              onValueChange={(value) => handleBirthdayChange('month', value)}
            >
              {months.map((month) => (
                <Picker.Item key={`month-${month}`} label={month} value={month} />
              ))}
            </Picker>
          </View>

          <View style={tw`items-center`}>
            <Picker
              selectedValue={userData.birthday.day}
              style={tw`h-48 w-24`}
              onValueChange={(value) => handleBirthdayChange('day', value)}
            >
              {days.map((day) => (
                <Picker.Item key={`day-${day}`} label={day} value={day} />
              ))}
            </Picker>
          </View>

          <View style={tw`items-center`}>
            <Picker
              selectedValue={userData.birthday.year}
              style={tw`h-48 w-24`}
              onValueChange={(value) => handleBirthdayChange('year', value)}
            >
              {years.map((year) => (
                <Picker.Item key={`year-${year}`} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    );
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 0:
        return renderGenderScreen();
      case 1:
        return renderHeightScreen();
      case 2:
        return renderBirthdayScreen();
      default:
        return renderGenderScreen();
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
          <Text style={tw`text-white font-bold text-lg`}>NEXT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default InputFrom;