import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "./Config";





 const uploadMedia = async (selectedimage,setonFirebaseImage) => {
    
    
   console.log("uploadmedia"+selectedimage)

  

    try {
      const { uri } = await FileSystem.getInfoAsync(selectedimage);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => reject(new Error("Network request failed"));

        xhr.responseType = "blob";
        xhr.open("get", uri, true);
        xhr.send(null);
      });

      const filename = selectedimage.substring(selectedimage.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      // console.log(downloadURL)
     return downloadURL;
    
    } catch (error) {
      console.error("Error uploading media:", error);
      return false;
    }
  };
  export default uploadMedia;