import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
const Logincustomer = () => {
  const navigation = useNavigation();


  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Validation Error", "Please enter email");
      return;
    }

    if (!password) {
      Alert.alert("Validation Error", "Please enter password");
      return;
    }

    setLoading(true);

    const formDataLogin = { email, password };

    try {
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/logincus",
        formDataLogin,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { status, data } = response.data;

      if (status) {
        console.log(status);
        Alert.alert("Success", "Successfully signed in");

        
     const storedData= await AsyncStorage.setItem('customerdata',JSON.stringify(data))
       
        const storeddata = await AsyncStorage.getItem('customerdata');
        
        // Parse the stored data (since AsyncStorage stores strings)
        const parsedData = JSON.parse(storeddata);
        console.log(parsedData);
        navigation.navigate('Customerhome')
      } else {
        console.log(status);
        Alert.alert("Error", "Invalid login data");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Login Your{"\n"}Account</Text>
        </View>
        <View style={styles.box2}>
          <TextInput
            style={styles.box2input}
            placeholder="Username"
            value={email}
            onChangeText={(text) => setemail(text)}
          />
          <TextInput
            style={styles.box2input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setpassword(text)}
          />
        </View>
        <View style={styles.box3}>
          {loading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <TouchableOpacity underlayColor="white" onPress={handleLogin}>
            <View style={styles.box3opacity}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Log in
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ fontSize: 16 }}>Not have an account? </Text>
            <TouchableOpacity
              style={{ padding: 20 }}
              onPress={(e) => {
                navigation.navigate("Signupcustomer");
              }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 16 }}>
                sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Logincustomer;
const styles = StyleSheet.create({
  box1: {
    flex: 3,

    paddingLeft: (Width * 13) / 100,
    justifyContent: "flex-end",
  },
  box2: {
    flex: 2,

    alignItems: "center",
    justifyContent: "space-evenly",
  },
  box3: {
    flex: 3,

    gap: 30,
    alignItems: "center",
  },
  box1text: {
    fontSize: 50,
    fontWeight: "600",
    lineHeight: 50,
  },
  box2input: {
    borderColor: "grey",
    borderWidth: 1,
    width: (Width * 75) / 100,
    height: 50,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 18,
  },
  box3opacity: {
    width: (Width * 75) / 100,
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 5,
    alignItems: "center",
  },
  box3signin: {
    color: "white",
    fontSize: 23,
  },
});
