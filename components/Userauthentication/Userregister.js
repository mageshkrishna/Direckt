import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import { State } from "react-native-gesture-handler";
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
const Userregister = () => {
  const navigation = useNavigation();
  const [state, setstate] = useState(0);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Create Your{"\n"}Account</Text>
        </View>
        <View style={styles.box2}>
          {state === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <TextInput style={styles.box2input} placeholder="Name" />
              <TextInput style={styles.box2input} placeholder="BusinessName" />
              <TextInput style={styles.box2input} placeholder="Location" />
              <TextInput style={styles.box2input} placeholder="category" />
              <TouchableOpacity
                underlayColor="white"
                onPress={() => {
                  setstate(1);
                }}
              >
                <View style={styles.box3opacity}>
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                  >
                    Next
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <TextInput style={styles.box2input} placeholder="Phonenumber" />
              <TextInput style={styles.box2input} placeholder="Username" />
              <TextInput style={styles.box2input} placeholder="Password" />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  gap: 30,
                }}
              >
                <TouchableOpacity
                  underlayColor="white"
                  onPress={() => {
                    setstate(0);
                  }}
                >
                  <View style={styles.box3opacity2}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Back
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  underlayColor="white"
                  onPress={() => {
                    setstate(0);
                  }}
                >
                  <View style={styles.box3opacity2}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Sign up
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
