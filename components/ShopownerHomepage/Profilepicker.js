import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/Theme";
import * as SecureStore from "expo-secure-store";
import {createnewauthtokenForShopowner} from '../RefreshSession/RefreshSession'
import { useDispatch, useSelector } from "react-redux";
import { setShopOwnerToken } from "../../redux/shopOwnerAuthActions";
import { strings } from "../../locals/translations";
import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from 'expo-image-manipulator';

const ProfilePicker = ({ profilepic, setprofilepic, shopOwnerId , email }) => {
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
      "Do you want to change the profile picture?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => uploadImage(shopOwnerId, imageUri),
        },
      ],
      { cancelable: false }
    );
  };
  const handleImagedeletion = () => {
    Alert.alert(
      "Confirm",
      "Do you want to remove the profile picture?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => removeImage(),
        },
      ],
      { cancelable: false }
    );
  };
  
  const removeImage = async () => {
    
    await uploadImage();
    setprofilepic(null);
    updateShopOwnerProfilePic(null);
  };

  const showOptions = () => {
    const options = [
      "Take a photo",
      "Pick an image from library",
      "Remove current image",
      "Cancel",
    ];
    const icons = [
      <Icon name="photo-camera" size={24} color="#000" />,
      <Icon name="photo-library" size={24} color="#000" />,
      <Icon name="delete" size={24} color="#000" />,
      <Icon name="cancel" size={24} color="red" />,
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        icons,
        cancelButtonIndex,
        cancelButtonTintColor: "red",
        containerStyle: styles.actionSheetContainer,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          openCamera();
        } else if (buttonIndex === 1) {
          pickImage();
        } else if (buttonIndex === 2) {
          handleImagedeletion();
        }
      }
    );
  };
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  const navigation = useNavigation();
  const uploadImage = async (id, imageUri) => {
  
    setLoading(true);
    try {
      const formData = new FormData();
      const token = await SecureStore.getItemAsync("shopownertoken");
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
      const response = await axios.post(
        `https://server.direckt.site/shopowner/editprofileimage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setprofilepic(response.data.data)
   
      updateShopOwnerProfilePic(response.data.data);
    }  catch (error) {
      if (error.response) {
     
        if (error.response.status === 429) {
            const newtoken = await createnewauthtokenForShopowner(email);
  
            if(newtoken){
              await SecureStore.setItemAsync('shopownertoken',newtoken);
              dispatch(setShopOwnerToken(newtoken))
              await uploadImage(id, imageUri); 
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
  const updateShopOwnerProfilePic = async (imageUrl) => {
    try {
      // Step 1: Retrieve shop owner data from AsyncStorage
      const shopOwnerDataString = await AsyncStorage.getItem("shopownerdata");

      if (!shopOwnerDataString) {
        throw new Error("Shop owner data not found in AsyncStorage");
      }

      // Parse the JSON string to get the shop owner object
      const shopOwnerData = JSON.parse(shopOwnerDataString);

      // Step 2: Update the profilepic field with the current image URL
      shopOwnerData.profilepic = imageUrl;

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
  const lang =useSelector(
    (state) => state.appLanguage.language
  );
  return (
    <View style={styles.container}>
     {loading ? (
  <ActivityIndicator size="large" color={COLORS.primary} />
) : (
  profilepic ? (
    <Image style={styles.image} source={{ uri: profilepic }} />
  ) : (
    <Image style={styles.image} source={require("../../assets/shop.png")} />
  )
)}


      <TouchableOpacity onPress={showOptions}>
        <Text style={{ paddingVertical: 10 }}>{strings[`${lang}`].chooseimage}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionSheetContainer: {
    minHeight: 200, // Customize the height here
    rowGap: 20,
  },
  container: {
    width: "100%",
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
});

export default ProfilePicker;
