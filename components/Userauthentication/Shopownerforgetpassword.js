import {
    View,
    Text,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
  } from "react-native";
  import React, { useState } from "react";
  import { SafeAreaView, StyleSheet } from "react-native";
  import { COLORS } from "../../constants/Theme";
  import { useNavigation } from "@react-navigation/native";
  import axios from "axios";
  
  const Width = Dimensions.get("window").width;
  const Height = Dimensions.get("window").height;
  const ShopownerForgetpassword = () => {
    const navigation = useNavigation();
    const [email, setemail] = useState();
    const [isSendBtnVisible,setisSendBtnVisible]=useState(true);
    const [otp, setotp] = useState(null);
    const sendemail = async () => {
      console.log("started");
      if (!email) {
        showToast("Fill the email feild");
        return;
      }
  
      try {
        const response = await axios.post(
          "https://direckt-copy1.onrender.com/auth/Shopownerforgetpassword",
          { email: email }
        );
        showToast("otp send succesfully to the email");
        setisSendBtnVisible(!isSendBtnVisible);
      } catch (error) {
        showToast("Otp failed or Invalid user");
        console.log(error);
      }
    };
  
    const sendotp = async () => {
      console.log(email)
      console.log("started");
      if (!otp) {
        showToast("Fill the otp feild");
        return;
      }
      if (!email) {
        showToast("Fill the email feild");
        return;
      }
      try {
        const response = await axios.post(
          "https://direckt-copy1.onrender.com/auth/Shopownerverifyotp",
          { otp: otp,email:email }
        );
        showToast("otp verified succesfully");
        console.log(response.data)
        console.log(response.data.token)
        if(response.status===200){
                 return navigation.navigate("Shopownerchangepassword",{email:email,token:response.data.token});
                
        }
       
      } catch (error) {
        console.log(error);
      }
    };
    const showToast = (e) => {
      ToastAndroid.show(e, ToastAndroid.SHORT);
    };
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1}}>
          <View style={styles.box0}>
            <Text style={{ fontSize: 30, fontWeight: "600",}}>Enter Email</Text>
            <TextInput
              style={styles.box2input}
              placeholder="xyz@gmail.com"
              value={email}
              onChangeText={(val) => {
                setemail(val);
              }}
            />
            {isSendBtnVisible ?<TouchableOpacity
              underlayColor="white"
              onPress={() => {
                sendemail();
              }}
            >
              <View style={styles.box1opacity}>
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
                >
                  Send OTP
                </Text>
              </View>
            </TouchableOpacity>: <Text style={{color:'grey'}}>Otp Sent succesfully! check your mail box</Text>}
          </View>
  
          <View style={styles.box1}>
            <Text style={styles.box1text}>
              Enter{" "}Verification{"\n"}OTP Code
            </Text>
          </View>
          <View style={styles.box2}>
            <TextInput
              style={styles.box2input}
              placeholder="4 Digit otp code"
              maxLength={4}
              keyboardType="number-pad"
              onChangeText={(val)=>{setotp(val)}}
            />
          </View>
          <View style={styles.box3}>
            <TouchableOpacity underlayColor="white" onPress={()=>{sendotp()}}>
              <View style={styles.box3opacity}>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Verify
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={{ fontSize: 16 }}>Could not recieved code?</Text>
              <TouchableOpacity
                style={{ paddingTop: 0 }}
                onPress={() => {
                  sendemail()
                }}
              >
                <Text style={{ color: COLORS.primary, fontSize: 16 }}>
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  export default ShopownerForgetpassword;
  const styles = StyleSheet.create({
    box0: {
      flex: 3,
      gap: 20,
      paddingLeft: (Width * 13) / 100,
      justifyContent: "flex-end",
      marginBottom: 20,
    },
    box1: {
      flex: 1,
      paddingLeft: (Width * 13) / 100,
      justifyContent: "flex-end",
    },
    box2: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    box3: {
      flex: 2,
      gap: 30,
      alignItems: "center",
    },
    box1text: {
      fontSize: 30,
      fontWeight: "600",
      lineHeight: 40,
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
    box1opacity: {
      width: (Width * 25) / 100,
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
  