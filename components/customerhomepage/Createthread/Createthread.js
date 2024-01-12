import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Button,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { SelectList } from "react-native-dropdown-select-list";
import { TouchableOpacity } from "react-native-gesture-handler";

import Imagepick from "./Imagepick";
import { COLORS } from "../../../constants/Theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadMedia from "./UploadImage";
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;

const Createthread = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [jobtitle, setjobtitle] = useState(null);
  const [jobdescription, setjobdescription] = useState(null);
  const [location, setjoblocation] = useState(null);
  const [category, setjobcategory] = useState(null);
  const [email, setemail] = useState(null);
  const [onFirebaseImage, setonFirebaseImage] = useState(null);
  const [image, setimage] = useState(null);

  const handleSubmit = async (firebaseImageUrl) => {
    try {
      console.log("Data:", firebaseImageUrl);
      
      const data = {
        location: location,
        email: email,
        jobtitle: jobtitle,
        jobdescription: jobdescription,
        category: category,
        image_url: firebaseImageUrl,
      };
      
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/Customerdata/createjob",
        data
      );

      console.log("Response:", response.data);

      setjobtitle("");
      setjobdescription("");
      setSelectedImage(null);

      Alert.alert("Job Created Successfully");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to create job");
    }
  };
  const handlesubmitimage = async () => {
    try {
      if (selectedImage) {
        console.log("Selected Image:", selectedImage);

        // Use await to wait for uploadMedia promise to resolve
        const firebaseImageUrl = await uploadMedia(selectedImage);

        if (firebaseImageUrl) {
          await handleSubmit(firebaseImageUrl);
        }
      }
    } catch (error) {
      console.error("Error in handlesubmit:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("customerdata");
        const parsedData = JSON.parse(data);
        setemail(parsedData.email);
        console.log(email);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  const choosedata = [
    { key: "1", value: "Mobiles" },
    { key: "2", value: "Appliances" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers" },
    { key: "5", value: "Vegetables" },
    { key: "6", value: "Diary Products" },
    { key: "7", value: "Drinks" },
  ];
  const chooselocation = [{ key: "1", value: "Vallioor" }];

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={Platform.OS === "ios" ? 50 : 0}
      enableOnAndroid={true}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView style={styles.box}>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Job Title</Text>
          <TextInput
            style={styles.box1input}
            onChangeText={(text) => setjobtitle(text)}
            value={jobtitle}
          />
          <Text style={styles.box2text}>Job Descripton</Text>
          <TextInput
            style={styles.box2input}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            onChangeText={(text) => setjobdescription(text)}
            value={jobdescription}
          />
          <Text style={styles.box1text}>Choose Category</Text>
          <SelectList
            setSelected={(val) => setjobcategory(val)}
            data={choosedata}
            save="value"
            boxStyles={{ borderColor: COLORS.primary }}
            inputStyles={{ width: "80%" }}
            dropdownStyles={{
              width: (Width * 80) / 100,
              borderStyle: "solid",
              borderColor: "white",
            }}
            dropdownItemStyles={{ width: "80%" }}
          />
          <Text style={styles.box1text}>Choose Location</Text>
          <SelectList
            setSelected={(val) => setjoblocation(val)}
            data={chooselocation}
            save="value"
            boxStyles={{ borderColor: COLORS.primary }}
            inputStyles={{ width: "80%" }}
            dropdownStyles={{
              width: (Width * 85) / 100,
              borderStyle: "solid",
              borderColor: "white",
            }}
            dropdownItemStyles={{ width: "80%" }}
          />

          <View style={styles.box1send}>
            <View>
              <Imagepick setSelectedImage={setSelectedImage} />
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 80, height: 80, borderRadius: 50 }}
                />
              ) : null}
            </View>

            {!selectedImage ? (
              <TouchableOpacity
                underlayColor="white"
                onPress={() => {
                  handleSubmit();
                }}
              >
                <View style={styles.box3opacity}>
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                  >
                    Post
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                underlayColor="white"
                onPress={() => {
                  handlesubmitimage();
                }}
              >
                <View style={styles.box3opacity}>
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                  >
                    Image Post
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Width,
    // Added paddingBottom to create space for keyboard
  },
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    width: Width,
  },
  box1: {
    width: "100%",
    width: Width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
  },
  box1text: {
    fontSize: 18,
    width: "85%",
  },
  box1input: {
    borderStyle: "solid",
    borderWidth: 1,
    width: "85%",
    height: 40,
    fontSize: 16,
    borderColor: COLORS.primary,
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },

  box2text: {
    fontSize: 18,
    width: "85%",
  },
  box2input: {
    borderStyle: "solid",
    borderWidth: 1,
    width: "85%",
    borderColor: COLORS.primary,
    fontSize: 15,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  box1send: {
    flex: 0.5,
    flexDirection: "row",

    width: "85%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  sendinput: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 2,
  },
  box3opacity: {
    width: (Width * 30) / 100,
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default Createthread;
