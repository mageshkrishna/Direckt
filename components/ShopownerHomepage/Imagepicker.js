import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { MaterialIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setShopOwnerToken } from "../../redux/shopOwnerAuthActions";
import * as SecureStore from "expo-secure-store";
import {createnewauthtokenForShopowner} from '../RefreshSession/RefreshSession'
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from 'expo-image-manipulator';
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Imagepicker = ({ setphotos, email, shopOwnerId }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.4,
      });

      if (!result.canceled) {
        const file = await ImageManipulator.manipulateAsync(result.assets[0].uri, [], { compress: 0.4 });
        handleImageSelection(file.uri);
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
        handleImageSelection(file.uri);
      }
    } catch (error) {

    }
  };

  const handleImageSelection = (imageUri) => {
    Alert.alert(
      "Confirm",
      "Do you want to add this image to your photos?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => uploadImage( imageUri),
        },
      ],
      { cancelable: false }
    );
  };
  const navigation = useNavigation();
  const uploadImage = async ( imageUri) => {
  
    setLoading(true);
    try {
      const formData = new FormData();

      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = imageUri.split("/").pop();
        formData.append("image", {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`,
        });
      }
      formData.append("_id",shopOwnerId)
      const token = await SecureStore.getItemAsync("shopownertoken");
      const response = await axios.post(
        `https://server.direckt.site/shopowner/changephotoimage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newImageUrl = response.data.data;
      await updateShopOwnerPhotos(newImageUrl);

      setphotos((prevPhotos) => {
        if (prevPhotos.length < 5) {
          return [...prevPhotos, newImageUrl]; // Add new photo if there are less than 5 photos
        }
        return prevPhotos; // Return the same array if there are already 5 photos
      });
    }  catch (error) {
      if (error.response) {

        if (error.response.status === 429) {
            const newtoken = await createnewauthtokenForShopowner(email);
   
            if(newtoken){
              await SecureStore.setItemAsync('shopownertoken',newtoken);
              dispatch(setShopOwnerToken(newtoken))
              await uploadImage(imageUri); 
            }
            else{
              navigation.replace('Home')
            }
        } else if (error.response.status === 401) {
            showToast('Invalid Auth Token');
        } else {
            // Handle other status codes or errors
            alert('Unexpected Error:', error.response.data);
        }
    }
    else if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
          showToast(`Error: ${error.response.data.error}`);
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {
        showToast("An error occurred. Please try again.");
      }
    }
    finally{
      setLoading(false);
    }
  };

  const updateShopOwnerPhotos = async (newImageUrl) => {
    try {
      // Step 1: Retrieve shop owner data from AsyncStorage
      const shopOwnerDataString = await AsyncStorage.getItem("shopownerdata");

      if (!shopOwnerDataString) {
        throw new Error("Shop owner data not found in AsyncStorage");
      }

      // Parse the JSON string to get the shop owner object
      const shopOwnerData = JSON.parse(shopOwnerDataString);

      // Step 2: Update the photos array with the new image URL if less than 5
      if (!shopOwnerData.photos) {
        shopOwnerData.photos = [];
      }
      if (shopOwnerData.photos.length < 5) {
        shopOwnerData.photos.push(newImageUrl);
      }

      // Step 3: Save the updated shop owner object back to AsyncStorage
      await AsyncStorage.setItem(
        "shopownerdata",
        JSON.stringify(shopOwnerData)
      );

 

      return shopOwnerData; // Return the updated shop owner object if needed
    } catch (error) {

      throw error;
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
        cancelButtonTintColor: "red",
        containerStyle: styles.actionSheetContainer
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
    <TouchableOpacity onPress={showOptions}>
  <View style={styles.addimagecard}>
    {loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : (
      shopOwnerId && <MaterialIcons name="add-photo-alternate" size={24} color="grey" />
    )}
  </View>
</TouchableOpacity>

  );
};

export default Imagepicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  addimagecard: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dotted",
    margin: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "grey",
  },
  editprofileImage: {
    height: (height * 15) / 100,
    width: (width * 32) / 100,
    borderRadius: (width * 30) / 100,
    borderWidth: 2,
  },
  editprofileImagetitle: {
    color: "blue",
    paddingVertical: 15,
  },
});
