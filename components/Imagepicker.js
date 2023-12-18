import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "./Config";

const Imagepicker = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const uploadMedia = async () => {
    setUploading(true);

    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => reject(new Error("Network request failed"));

        xhr.responseType = "blob";
        xhr.open("get", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);

      setUploading(false);
      Alert.alert("Photo Uploaded");
      setImage(null);
    } catch (error) {
      console.error("Error uploading media:", error);
      setUploading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        <Text>Imagepicker</Text>
      </TouchableOpacity>

      <View>
        {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
      </View>

      <TouchableOpacity onPress={uploadMedia} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Text>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Imagepicker;
