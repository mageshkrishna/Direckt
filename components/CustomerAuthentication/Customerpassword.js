import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS } from '../../constants/Theme';
import { TextInput } from 'react-native-gesture-handler';
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
const Customerpassword = ({route}) => {
    const email = route.params?.email;
    const token = route.params?.token;
    const navigation = useNavigation();
  const [newPassword, setnewPassword] = useState();

  const sendnewPassword =async()=>{
  
    if (!newPassword) {
      showToast('Password must be at least 6 characters long and contain both letters and numbers');
      return;
    } 
   else{
    try{
        console.log(email,token)
      const response = await axios.post('https://direckt-copy1.onrender.com/auth/customerupdatepassword'
      ,{email:email,newPassword:newPassword,token:token}
      )
      if(response.status===200){
        showToast('passwordchanged successfully')
       
        console.log('passwordchanged successfully')
      }

      return navigation.navigate('Logincustomer')
    }
    catch{
      showToast('retry and generate new otp')
    }
   }
  }
   const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  return (
  
     <View style={styles.box0}>
          <Text style={{ fontSize: 30, fontWeight: "600" }}>Enter New password</Text>
          <TextInput
            style={styles.box2input}
            placeholder="password"
            value={newPassword}
            onChangeText={(val) => {
              setnewPassword(val);
            }}
          />
          <TouchableOpacity
            underlayColor="white"
            onPress={() => {
              sendnewPassword()
            }}
          >
            <View style={styles.box1opacity}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
               Submit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
    
  )
}

export default Customerpassword
const styles = StyleSheet.create({
    box0: {
      flex: 1,
      gap: 20,
      paddingLeft: (Width * 13) / 100,
      justifyContent: "center",
      marginBottom: 20,
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

    box1opacity: {
      width: (Width * 25) / 100,
      backgroundColor: COLORS.primary,
      paddingVertical: 17,
      borderRadius: 5,
      alignItems: "center",
    },
   
  });
  