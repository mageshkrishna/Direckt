// Imagepick.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Imagepick = ({ setSelectedImage }) => {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.1,
      });

      if (!result.canceled) {
        // console.log(result.assets[0].uri)
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        <Text style={{paddingBottom:10}}>Choose Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Imagepick;