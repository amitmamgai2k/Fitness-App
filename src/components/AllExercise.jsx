import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, StatusBar, Modal } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../../tailwind';
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Filter, XCircle, Check } from 'lucide-react-native';

const AllExercise = ({ navigation, route }) => {
  const { title } = route.params || {};
  const { image } = route.params || {};
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [equipmentFilters, setEquipmentFilters] = useState([]);
  const [targetFilters, setTargetFilters] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(20);
  const scrollViewRef = useRef(null);

  const API_KEY = 'f21b049adfmsh949b3b50c4cae42p1f3cb0jsnf76c04510318';

  const getExercises = async () => {
    try {
      const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${title.toLowerCase()}?limit=200&offsert=0`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      });

      const data = await response.json();
      const exerciseData = data.slice(0, 200);
      setExercises(exerciseData);
      setFilteredExercises(exerciseData);

      // Extract unique equipment and target values for filters
      const uniqueEquipment = [...new Set(exerciseData.map(ex => ex.equipment))].sort();
      const uniqueTargets = [...new Set(exerciseData.map(ex => ex.target))].sort();

      setEquipmentFilters(uniqueEquipment);
      setTargetFilters(uniqueTargets);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExercises();
  }, [title]);

  useEffect(() => {
    // Apply both search and filters
    let result = exercises;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      result = result.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply equipment filter
    if (selectedEquipment.length > 0) {
      result = result.filter(exercise =>
        selectedEquipment.includes(exercise.equipment)
      );
    }

    // Apply target muscle filter
    if (selectedTargets.length > 0) {
      result = result.filter(exercise =>
        selectedTargets.includes(exercise.target)
      );
    }

    setFilteredExercises(result);
    setFiltersApplied(selectedEquipment.length > 0 || selectedTargets.length > 0);

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchQuery, exercises, selectedEquipment, selectedTargets]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const toggleEquipmentFilter = (equipment) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const toggleTargetFilter = (target) => {
    setSelectedTargets(prev =>
      prev.includes(target)
        ? prev.filter(t => t !== target)
        : [...prev, target]
    );
  };

  const clearFilters = () => {
    setSelectedEquipment([]);
    setSelectedTargets([]);
    setFiltersApplied(false);
  };

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const getPageRange = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header with Back Button */}
      <View style={tw`flex-row items-center px-4 py-2 border-b border-gray-100`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-xl font-bold text-gray-800`}>{title} Exercises</Text>
        </View>
        <View style={tw`w-10`}></View> {/* Spacer for centering */}
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section with Image */}
        <View style={tw`bg-gray-50 px-4 pt-4 pb-6 mb-2`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-3xl font-bold text-gray-900`}>
                {title}
              </Text>
              <Text style={tw`text-lg text-pink-600 font-semibold mt-1`}>
                Training
              </Text>
              <Text style={tw`text-gray-600 mt-2 pr-4`}>
                Explore {filteredExercises.length} exercises designed to target your {title.toLowerCase()} muscles.
              </Text>
            </View>
            <Image
              source={{ uri: image }}
              style={tw`w-32 h-32 rounded-full border-2 border-pink-600`}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Search Bar */}
        <View style={tw`px-4 mb-4`}>
          <View style={tw`flex-row items-center bg-gray-100 px-4 py-3 rounded-xl`}>
            <Search size={20} color="#666" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 text-base text-gray-700`}
              placeholder="Search exercises..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={tw`p-1`}>
                <XCircle size={20} color="#666" />
              </TouchableOpacity>
            )}
            <View style={tw`h-6 mx-2 border-r border-gray-300`}></View>
            <TouchableOpacity
              style={tw`p-1`}
              onPress={() => setFilterModalVisible(true)}
            >
              <Filter size={20} color={filtersApplied ? "#db2777" : "#666"} />
            </TouchableOpacity>
          </View>

          {/* Applied Filters */}
          {filtersApplied && (
            <View style={tw`flex-row flex-wrap mt-2 items-center`}>
              <Text style={tw`text-gray-600 mr-2`}>Filters:</Text>
              {selectedEquipment.map(item => (
                <TouchableOpacity
                  key={`eq-${item}`}
                  style={tw`bg-pink-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center`}
                  onPress={() => toggleEquipmentFilter(item)}
                >
                  <Text style={tw`text-pink-700 text-sm mr-1`}>{item}</Text>
                  <XCircle size={14} color="#be185d" />
                </TouchableOpacity>
              ))}
              {selectedTargets.map(item => (
                <TouchableOpacity
                  key={`target-${item}`}
                  style={tw`bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center`}
                  onPress={() => toggleTargetFilter(item)}
                >
                  <Text style={tw`text-blue-700 text-sm mr-1`}>{item}</Text>
                  <XCircle size={14} color="#1e40af" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={clearFilters}
                style={tw`bg-gray-200 rounded-full px-3 py-1 mb-2 flex-row items-center`}
              >
                <Text style={tw`text-gray-700 text-sm`}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={tw`px-4 pb-8`}>
          {/* Results Info */}
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>
              Available Exercises
            </Text>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-gray-500 text-sm`}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={tw`py-20 items-center`}>
              <ActivityIndicator size="large" color="#db2777" />
              <Text style={tw`mt-4 text-gray-600 font-medium`}>Loading exercises...</Text>
            </View>
          ) : (
            <>
              {filteredExercises.length === 0 ? (
                <View style={tw`items-center justify-center py-16 bg-gray-50 rounded-xl`}>
                  <Image
                    source={require('../../assets/male-icon.png')}
                    style={tw`w-16 h-16 opacity-50 mb-4`}
                    resizeMode="contain"
                  />
                  <Text style={tw`text-gray-500 text-lg font-medium mb-2`}>No exercises found</Text>
                  <Text style={tw`text-gray-400 text-center px-6`}>
                    Try adjusting your search or filters to find what you're looking for
                  </Text>
                  {filtersApplied && (
                    <TouchableOpacity
                      onPress={clearFilters}
                      style={tw`mt-4 bg-pink-600 rounded-lg px-4 py-2`}
                    >
                      <Text style={tw`text-white font-semibold`}>Clear Filters</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <>
                  {/* Exercise Grid */}
                  <View style={tw`flex-row flex-wrap justify-between`}>
                    {currentExercises.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('ExerciseDetails', { exercise: item })}
                        style={tw`w-[48%] mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white`}
                      >
                        <View style={tw`relative`}>
                          <Image
                            source={item.gifUrl ? { uri: item.gifUrl } : require('../../assets/male-icon.png')}
                            style={tw`w-full h-44 bg-gray-100`}
                            resizeMode="cover"
                          />
                          {item.equipment && (
                            <View style={tw`absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-full px-2 py-1`}>
                              <Text style={tw`text-white text-xs font-medium`}>{item.equipment}</Text>
                            </View>
                          )}
                        </View>
                        <View style={tw`p-2`}>
                          <Text
                            style={tw`text-gray-800 font-semibold text-center`}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Text>
                          <Text style={tw`text-gray-500 text-xs text-center mt-1`}>{item.target}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Pagination Controls */}
                  <View style={tw`flex-row justify-center items-center mt-6 mb-2 bg-gray-50 py-3 rounded-xl`}>
                    {/* Previous Button */}
                    <TouchableOpacity
                      onPress={() => currentPage > 1 && changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={tw`p-2 ${currentPage === 1 ? 'opacity-50' : ''}`}
                    >
                      <ChevronLeft size={24} color={currentPage === 1 ? "#ccc" : "#db2777"} />
                    </TouchableOpacity>

                    {/* Page Numbers */}
                    <View style={tw`flex-row mx-2`}>
                      {getPageRange().map(number => (
                        <TouchableOpacity
                          key={number}
                          onPress={() => changePage(number)}
                          style={tw`w-9 h-9 rounded-full mx-1 items-center justify-center ${
                            currentPage === number ? 'bg-pink-600' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <Text
                            style={tw`${currentPage === number ? 'text-white font-bold' : 'text-gray-700'}`}
                          >
                            {number}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity
                      onPress={() => currentPage < totalPages && changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={tw`p-2 ${currentPage === totalPages ? 'opacity-50' : ''}`}
                    >
                      <ChevronRight size={24} color={currentPage === totalPages ? "#ccc" : "#db2777"} />
                    </TouchableOpacity>
                  </View>

                  <Text style={tw`text-gray-500 text-center text-xs mt-3`}>
                    Showing {indexOfFirstExercise + 1}-{Math.min(indexOfLastExercise, filteredExercises.length)} of {filteredExercises.length} exercises
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl px-4 pt-6 pb-8 h-[70%]`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold text-gray-800`}>Filter Exercises</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <XCircle size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Equipment Filters */}
              <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Equipment</Text>
                <View style={tw`flex-row flex-wrap`}>
                  {equipmentFilters.map(equipment => (
                    <TouchableOpacity
                      key={equipment}
                      style={tw`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                        selectedEquipment.includes(equipment) ? 'bg-pink-100 border-pink-300' : 'bg-gray-50 border-gray-200'
                      }`}
                      onPress={() => toggleEquipmentFilter(equipment)}
                    >
                      <Text style={tw`${
                        selectedEquipment.includes(equipment) ? 'text-pink-700' : 'text-gray-700'
                      }`}>
                        {equipment}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Target Muscle Filters */}
              <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Target Muscle</Text>
                <View style={tw`flex-row flex-wrap`}>
                  {targetFilters.map(target => (
                    <TouchableOpacity
                      key={target}
                      style={tw`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                        selectedTargets.includes(target) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'
                      }`}
                      onPress={() => toggleTargetFilter(target)}
                    >
                      <Text style={tw`${
                        selectedTargets.includes(target) ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {target}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Filter Actions */}
            <View style={tw`flex-row mt-4 pt-4 border-t border-gray-200`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-200 py-3 rounded-xl mr-2`}
                onPress={clearFilters}
              >
                <Text style={tw`text-gray-800 font-semibold text-center`}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-pink-600 py-3 rounded-xl ml-2`}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={tw`text-white font-semibold text-center`}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AllExercise;