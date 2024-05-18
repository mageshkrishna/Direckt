import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
const Imagepick = ({ setSelectedImage }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera: ', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const showOptions = () => {
    const options = ['Take a photo', 'Pick an image from library', 'Cancel'];
    const icons = [
      <Icon name="photo-camera" size={24} color="#000" />,
      <Icon name="photo-library" size={24} color="#000" />,
      <Icon name="cancel" size={24} color="red" />
    ];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        icons,
        cancelButtonIndex,
        cancelButtonTintColor:"red",
        containerStyle:styles.actionSheetContainer
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          openCamera();
        } else if (buttonIndex === 1) {
          pickImage();
        }
      }
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={showOptions}>
        <Text style={{ paddingBottom: 10 }}>Choose Image</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  actionSheetContainer: {
    minHeight: 200, // Customize the height here
    rowGap:20
  },
});
export default Imagepick;
