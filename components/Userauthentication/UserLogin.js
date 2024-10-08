import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,

  ToastAndroid,
  Modal,

} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Feather } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { setShopOwnerToken } from "../../redux/shopOwnerAuthActions";
const Width = Dimensions.get("window").width;



const UserLogin = ({route,setShopOwnerToken}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
   const[devicetoken,setdeviceToken]= useState(null)
  useEffect(() => {
    if (route && route.params) {
      setemail(route.params.email || '');
      setpassword(route.params.password || '');
    }
  }, [route]);
  useEffect(()=>{
    const fecthdevicetoken = async()=>{
    const value = await SecureStore.getItemAsync("devicetoken");

    setdeviceToken(value);
    }
    fecthdevicetoken();
  },[])
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
  
    const formDataLogin = { email, password,devicetoken};
  
    try {
      const response = await axios.post(
        "https://server.direckt.site/auth/login",
        formDataLogin,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
   
      const { status, data, token, refreshToken } = response.data;
    
     
      if (status) {
      
        // Store user data in AsyncStorage
        try {
          await AsyncStorage.setItem('shopownerdata', JSON.stringify(data));
        } catch (error) {
        
        }
        // Store the token securely using react-native-keychain
        SecureStore.setItemAsync('shopownertoken',token)
        SecureStore.setItemAsync('refreshTokenShopowner',refreshToken)
        setShopOwnerToken(token)
        showToast("Login Successful!");
  
        // Navigate to the next screen or perform other actions
        navigation.navigate("Shopownernav");
  
      } else {
       
        showToast("Error", "Invalid login data");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
          // Response received with an error status code
          showToast('Error: Invalid User');
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {
        
        showToast("An error occurred. Please try again.");
      }
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
            placeholder="Email"
            value={email}
            onChangeText={(text) => setemail(text)}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.box2input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setpassword(text)}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} >
            <Text style={{color:"grey"}} >{isPasswordVisible ?<FontAwesome name="eye-slash" size={13} color="grey" />:<FontAwesome name="eye" size={13} color="grey" />} {isPasswordVisible ? 'Hide Password' : 'Show Password'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box3}>
          {loading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
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
                navigation.navigate("Userregister",{email,password});
              }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 16 }}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
              style={{ padding: 4 }}
              onPress={(e) => {
                navigation.navigate("Shopownerforgotpassword",{email});
              }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 16 }}>
               Forget password
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default connect(null, { setShopOwnerToken })(UserLogin);
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



