import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import { State } from "react-native-gesture-handler";
import axios from "axios";
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
const Userregister = () => {
  const navigation = useNavigation();
  const[businessname,setbuinessname] = useState(null);
  const[phonenumber,setphonenumber] = useState(null);
  const[email,setemail] = useState(null);
  const[password,setpassword] = useState(null)
  const [loading, setLoading] = useState(false);
  const handleRegister= async()=>{
    if(!businessname||!phonenumber||!email||!password){
      Alert.alert("please fill all the feilds")
      return;
    }
     
      try {
        setLoading(true); // Set loading to true when the request starts
  
        const formdata ={
          businessname:businessname,
          phonenumber:phonenumber,
          email:email,
          password:password
        }
        const response = await axios.post('https://direckt-copy1.onrender.com/auth/register', formdata, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const { status } = response.data;
  
        if (status) {
          Alert.alert('Success', 'Account created successfully');
          setbuinessname(null)
          setemail(null)
          setphonenumber(null)
          setpassword(null)
        } else {
          Alert.alert('Error', 'Email is already used. Try again');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      } finally {
        setLoading(false); 
      }


  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Create Your{"\n"}Account</Text>
        </View>
        <View style={styles.box2}>
          
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <TextInput style={styles.box2input} placeholder="BusinessName" value={businessname} onChangeText={(val)=>setbuinessname(val)}/>
              <TextInput style={styles.box2input} placeholder="Phonenumber"  value={phonenumber} onChangeText={(val)=>setphonenumber(val)} keyboardType="numeric" />
              <TextInput style={styles.box2input} placeholder="email"  value={email} onChangeText={(val)=>setemail(val)} />
              <TextInput style={styles.box2input} placeholder="password"  value={password} onChangeText={(val)=>setpassword(val)} />
              <TouchableOpacity
                underlayColor="white"
                onPress={handleRegister}
              >
                 {loading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
                <View style={styles.box3opacity}>
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                  >
                    Register
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
      
        </View>
        <View style={styles.box3}>
    
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{fontSize:16}}>Already have an account? </Text>
            <TouchableOpacity
              style={{ paddingTop: 0 }}
              onPress={(e) => {
                navigation.navigate("Userlogin");
              }}
            >
              <Text style={{ color: COLORS.primary ,fontSize:16}}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Userregister;
const styles = StyleSheet.create({
  box1: {
    flex: 2,

    paddingLeft: (Width * 13) / 100,
    justifyContent: "flex-end",
  },
  box2: {
    flex: 4,

    alignItems: "center",
    justifyContent: "space-evenly",
  },
  box3: {
    flex: 1,

    gap: 10,
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
  box3opacity2: {
    width: (Width * 30) / 100,
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
//   <View style={styles.box2}>
//   <TextInput style={styles.box2input} placeholder="Username" />
//   <TextInput style={styles.box2input} placeholder="Password" />
// </View>
// <View style={styles.box3}>
//   <TouchableOpacity underlayColor="white">
//     <View style={styles.box3opacity}>
//       <Text
//         style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
//       >
//         Sign up
//       </Text>
//     </View>
//   </TouchableOpacity>
//   <View style={{ flexDirection: "row", gap: 10 }}>
//     <Text>Already have an account? </Text>
//     <TouchableOpacity
//       style={{ paddingTop: 0 }}
//       onPress={(e) => {
//         navigation.navigate("Logincustomer");
//       }}
//     >
//       <Text style={{ color: COLORS.primary }}>Log in</Text>
//     </TouchableOpacity>
//   </View>
// </View>
