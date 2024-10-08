import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { strings } from '../../../locals/translations';
import * as ImageManipulator from 'expo-image-manipulator';
const Imagepick = ({ setSelectedImage }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const lang = useSelector(
    (state) => state.appLanguage.language
  );
  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.4,
      });

      if (!result.canceled) {
        const file = await ImageManipulator.manipulateAsync(result.assets[0].uri, [], { compress: 0.4 });
        setSelectedImage(file.uri);
      }
    } catch (error) {
    
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.4,
      });

      if (!result.canceled) {
        const file = await ImageManipulator.manipulateAsync(result.assets[0].uri, [], { compress: 0.4 });
        setSelectedImage(file.uri);
      }
    } catch (error) {

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
        <Text style={{ paddingBottom: 10 }}>{strings[`${lang}`].chooseimage}</Text>
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
