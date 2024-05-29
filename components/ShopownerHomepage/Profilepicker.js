import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/Theme";

const ProfilePicker = ({ profilepic, setprofilepic, token, shopOwnerId }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [loading, setLoading] = useState(false);


  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.1,
      });

      if (!result.canceled) {
        handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.1,
      });

      if (!result.canceled) {
        handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
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
          onPress: () => uploadImage(shopOwnerId, token, imageUri),
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

  const uploadImage = async (id, token, imageUri) => {
    console.log(imageUri);
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
      console.log(token);
      const queryParams = {
        _id: shopOwnerId,
      };
      const response = await axios.post(
        `https://direckt-copy1.onrender.com/shopowner/editprofileimage?_id=${shopOwnerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setprofilepic(response.data.data)
      console.log(response.data);
      updateShopOwnerProfilePic(response.data.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
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

      console.log(
        "Shop owner profile pic updated successfully:",
        shopOwnerData
      );

      return shopOwnerData; // Return the updated shop owner object if needed
    } catch (error) {
      console.error("Error updating shop owner profile pic:", error);
      throw error;
    }
  };
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
        <Text style={{ paddingVertical: 10 }}>Change Image</Text>
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
