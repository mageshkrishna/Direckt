import {
    View,
    Text,
    Dimensions,
    TextInput,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { SafeAreaView, StyleSheet } from "react-native";
  import { COLORS } from "../../constants/Theme";
  import { useNavigation } from "@react-navigation/native";

  const Width = Dimensions.get("window").width;
  const Height = Dimensions.get("window").height;
  const UserLogin = () => {
    const navigation = useNavigation();
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.box1}>
            <Text style={styles.box1text}>Login Your{"\n"}Account</Text>
          </View>
          <View style={styles.box2}>
            <TextInput style={styles.box2input} placeholder="Username" />
            <TextInput style={styles.box2input} placeholder="Password" />
          </View>
          <View style={styles.box3}>
            <TouchableOpacity underlayColor="white">
              <View style={styles.box3opacity}>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Log in
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={{fontSize:16}}>Not have an account? </Text>
              <TouchableOpacity
                style={{ paddingTop: 0 }}
                onPress={(e) => {
                  navigation.navigate("Userregister");
                }}
              >
                <Text style={{ color: COLORS.primary,fontSize:16 }}>sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  export default UserLogin;
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