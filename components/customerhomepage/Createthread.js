import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { SelectList } from "react-native-dropdown-select-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import ImagePickerExample from "./getImage";
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;

const Createthread = () => {
  const [selected, setSelected] = useState("");

  const data = [
    { key: "1", value: "Mobiles" },
    { key: "2", value: "Appliances" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers" },
    { key: "5", value: "Vegetables" },
    { key: "6", value: "Diary Products" },
    { key: "7", value: "Drinks" },
  ];
  const location = [{ key: "1", value: "Vallioor" }];

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={Platform.OS === "ios" ? 50 : 0}
      enableOnAndroid={true}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView style={styles.box}>
        <View style={styles.box1}>
          
            <Text style={styles.box1text}>Job Title</Text>
            <TextInput style={styles.box1input} />
            <Text style={styles.box2text}>Job Descripton</Text>
            <TextInput
              style={styles.box2input}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.box1text}>Choose Category</Text>
            <SelectList
              setSelected={(val) => setSelected(val)}
              data={data}
              save="value"
              boxStyles={{ borderColor: "purple" }}
              inputStyles={{ width: "80%" }}
              dropdownStyles={{
                width: (Width * 80) / 100,
                borderStyle: "solid",
                borderColor: "purple",
              }}
              dropdownItemStyles={{ width: "80%" }}
            />
            <Text style={styles.box1text}>Choose Location</Text>
            <SelectList
              setSelected={(val) => setSelected(val)}
              data={location}
              save="value"
              boxStyles={{ borderColor: "purple" ,}}
              inputStyles={{ width: "80%" }}
              dropdownStyles={{
                width: (Width * 85) / 100,
                borderStyle: "solid",
                borderColor: "purple",
              }}
              dropdownItemStyles={{ width: "80%" }}
            />
         
          <View style={styles.box1send}>
            <View style={{ width:100, height:100}} >
              <ImagePickerExample/>
            </View>
            <TouchableOpacity
                underlayColor="white"
                onPress={() => {
                 Alert.alert('posted successfully')
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
    fontSize: 18,
    borderColor: "purple",
    marginBottom: 10,
    borderRadius: 8,
  },

  box2text: {
    fontSize: 18,
    width: "85%",
  },
  box2input: {
    borderStyle: "solid",
    borderWidth: 1,
    width: "85%",
    borderColor: "purple",
    fontSize: 18,
    borderRadius: 8,
    marginBottom: 10,
  },
  box1send:{
    flex:0.5,
    flexDirection:"row",
   
    width:'85%',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  sendinput:{
    width:'40%',
    borderStyle:"solid",
    borderWidth:2
  },
  box3opacity: {
    width: (Width * 30) / 100,
    backgroundColor:'#8A57E4',
    paddingVertical: 17,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default Createthread;
