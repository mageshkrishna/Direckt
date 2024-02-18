import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Image,
  Touchable,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from "react-native";
import image from "../Home/Onboard.png";
import image1 from '../Home/1-removebg-preview.png'
import Svg, { Path } from "react-native-svg";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
export default function Home() {

  const navigation = useNavigation();
  const route = useRoute();
 

  
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (route.name === "Home") {
          BackHandler.exitApp();
          return true; // Prevent going back to the previous page
        }
        return false; // Allow the default back action on other screens
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        backHandler.remove();
      };
    }, [route.name])
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.box1}>
          
          <View style={{flex:10,justifyContent:"flex-start",}}>
          <Image source={image} style={{height:"100%",resizeMode: 'cover',width:Width}}></Image>
          </View>          
        </View>

        <View style={styles.box4}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Text style={{ fontSize: 30, color: "black", fontWeight: "bold" }}>
              Get Started
            </Text>
            <Text style={{ color: "#c1c1c1" }}>Choose one?</Text>
          </View>
          <View style={{ flex: 2 }}>
            <TouchableOpacity
              underlayColor="white"
              onPress={(e) => {
                navigation.navigate("Logincustomer");
              }}
            >
              <View style={styles.cusbutton}>
                <Text style={styles.cusbuttonText}>I am a Customer</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              underlayColor="white"
              onPress={(e) => {
                navigation.navigate("Userlogin");
              }}
            >
              <View style={styles.ownbutton}>
                <Text style={styles.ownbuttonText}>I am a Shop Owner</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: "#E0E5FF",
  },
  box1: {
    flex: 5,
    backgroundColor: "#E0E5FF",
    alignItems:"center",
  },
  box4: {
    flex: 3,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    elevation:2
  },
  cusbutton: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#8A57E4",
    borderRadius: 20,
  },
  ownbutton: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#8A57E4",
  },
  cusbuttonText: {
    textAlign: "center",
    padding: 20,
    color: "white",
  },
  ownbuttonText: {
    textAlign: "center",
    padding: 20,
    color: "#8A57E4",
  },
  box1text: { 
    fontSize: 45, 
    fontWeight: "bold", 
    color: "#8A57E4", 
  },
  box1imag:{
    height:"50%",
    width:"80%",
  },  
});
