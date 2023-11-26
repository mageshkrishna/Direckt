import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet,Alert } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
const Signupcustomer = () => {
  const navigation = useNavigation();
  const[name,setname] = useState('');
  const[email,setemail]= useState('');
  const[password,setpassword] =useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password ) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    try {
      setLoading(true); // Set loading to true when the request starts

      const formData = {
        name,
        email,
        password,
      };

      const response = await axios.post('https://direckt-copy1.onrender.com/auth/registercus', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { status } = response.data;

      if (status) {
        Alert.alert('Success', 'Account created successfully');
      } else {
        Alert.alert('Error', 'Email is already used. Try again');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when the request completes (success or error)
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Create Your{"\n"}Account</Text>
        </View>
        <View style={styles.box2}>
          <TextInput style={styles.box2input} placeholder="Name"   value={name}
  onChangeText={(text) => setname(text)}/>
          <TextInput style={styles.box2input} placeholder="Username"   value={email}
  onChangeText={(text) => setemail(text)} />
          <TextInput style={styles.box2input} placeholder="Password"   value={password}
  onChangeText={(text) => setpassword(text)}/>
        </View>
        <View style={styles.box3}>
          <TouchableOpacity underlayColor="white" onPress={handleRegister}>
          {loading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
            <View style={styles.box3opacity}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Sign up
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{fontSize:16}}>Already have an account? </Text>
            <TouchableOpacity
              style={{ padding: 20 }}
              onPress={(e) => {
                navigation.navigate("Logincustomer");
              }}
            >
              <Text style={{ color: COLORS.primary,fontSize:16 }}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signupcustomer;
const styles = StyleSheet.create({
  box1: {
    flex: 3,

    paddingLeft: (Width * 13) / 100,
    justifyContent: "flex-end",
  },
  box2: {
    flex: 3,

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
