import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {

  apiKey: "AIzaSyATJ2VufGhk3e6Mi89FGxoiTtL1KdvkBSs",
  authDomain: "uploadingfile-af46b.firebaseapp.com",
  projectId: "uploadingfile-af46b",
  storageBucket: "uploadingfile-af46b.appspot.com",
  messagingSenderId: "671660554926",
  appId: "1:671660554926:web:952a513097e18f6f588b3f"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const generateUniqueID = () => {
  return new Date().getTime().toString(); // Using timestamp as a unique identifier
};

const ImagePickerExample = () => {
  const [image, setImage] = useState(null); // Stores the original image URI
  const [uploading, setUploading] = useState(false); // Uploading state
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Stores the downloaded URL

  useEffect(() => {
    // Upload image when it changes (picked or updated)
    if (image) uploadImage(image);
  }, [image]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaTypeOptions.Images,
        quality: 0.1, // adjust quality as needed
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Update image with picked URI
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadImage = async (imageUri) => {
    if (!imageUri) return;

    setUploading(true); // Set uploading state

    try {
      const blob = await uriToBlob(imageUri); // Convert URI to blob
      const imageRef = ref(storage, `images/${generateUniqueID()}`); // Create image ref

      await uploadBytes(imageRef, blob); // Upload blob to Firebase Storage
      const url = await getDownloadURL(imageRef); // Get the download URL

      // Update states with downloaded URL
      setUploadedImageUrl(url);
      setImage(url); // Use downloaded URL for preview

      console.log('Image uploaded:', url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    return new Blob([new Uint8Array(arrayBuffer)], { type: response.headers.get('Content-Type') || 'image/*' });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={pickImage}>
        {uploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{ alignItems: 'center' }}>
            {uploadedImageUrl && image ? ( // Show preview only if both states are set
              <Image
                source={{ uri: image }} // Use downloaded URL for final preview
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                {image && !uploadedImageUrl && ( // Show picked image before upload
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                  />
                )}
                <Text>Choose Image</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerExample;

