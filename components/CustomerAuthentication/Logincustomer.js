import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Modal,
  Pressable
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Feather } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;


const Logincustomer = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((e) => !e);
  };

  const handleLogin = async () => {
    if (!email) {
      showToast('Please enter your email!');
      return;
    }
    
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address');
      return;
    }
    if (!password) {
      showToast('Please enter your password!');
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
        console.log(JSON.stringify(data));
        setModalVisible(!modalVisible);

        const storedData = await AsyncStorage.setItem(
          "customerdata",
          JSON.stringify(data)
        );
        // const storeddata = await AsyncStorage.getItem("customerdata");

        // // Parse the stored data (since AsyncStorage stores strings)
        // const parsedData = JSON.parse(storeddata);
        // console.log(parsedData);
        // setTimeout(()=>{
        //   setModalVisible(!modalVisible);
        // },2000)
        
        navigation.navigate("Customerhome");
      } else {
        console.log(status);
        Alert.alert("Error", "Invalid login data");
      }
    } catch (error) {
      // console.error(error);
      showToast("Invalid username or password!")
    } finally {
      setLoading(false);
    }
  };
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}> 
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Feather name="check-circle" size={62} color="green" />
            <Text style={styles.modalText}>LogIn Successfull</Text>
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1 }}>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Login Your{"\n"}Account</Text>
        </View>
        <View style={styles.box2}>
          <TextInput
            style={styles.box2input}
            placeholder="Username (email)"
            value={email}
            onChangeText={(text) => setemail(text)}
          />
          <TextInput
            style={styles.box2input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setpassword(text)}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} >
            <Text style={{color:"grey"}} >{isPasswordVisible ?<FontAwesome name="eye-slash" size={13} color="grey" />:<FontAwesome name="eye" size={13} color="grey" />} {isPasswordVisible ? 'Hide Password' : 'Show Password'}</Text>
          </TouchableOpacity>
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
          <View style={{ flexDirection: "row", gap: 3, alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>Not have an account? </Text>
            <TouchableOpacity
              style={{ padding: 4 }}
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
  },centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent:'space-evenly',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    paddingHorizontal:20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  modalText: {
    paddingVertical:15,
    textAlign: 'center',
  },
});
