
import {
    View,
    Text,
    Alert,
    Button,
    SafeAreaView,
    BackHandler,
    Dimensions,
    StyleSheet,
    Image
  } from "react-native";
  import React, { useEffect } from "react";
  import {
    useFocusEffect,
    useNavigation,
    useRoute,
  } from "@react-navigation/native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  
  
  import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
  import { COLORS } from "../../constants/Theme";
  

  import { TextInput } from "react-native-gesture-handler";
import Shopownerprofile from "./Shopownerprofile";
import Shopownerhomepage from "./Shopownerhomepage";
  const Width = Dimensions.get("window").width;
  const Height = Dimensions.get("window").height;
 
const Shopownernav = () => {
    const navigation = useNavigation();
  
    const route = useRoute();
    
  
   
   
    const removeData = async () => {
      try {
        // Remove data
        await AsyncStorage.removeItem("customerdata");
        navigation.navigate("Home");
        console.log("Data removed successfully");
      } catch (error) {
        console.error("Error removing data:", error);
      }
    };
    const handleLogout = () => {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            onPress: () => {
              removeData();
  
              console.log("Logging out...");
            },
          },
        ],
        { cancelable: false }
      );
    };
    const Tab = createBottomTabNavigator();
    return (
      <View style={{ flex: 1 }}>
       
           <View style={{width:'100%',height:'10%',alignItems:'flex-start',justifyContent:'center',backgroundColor: COLORS.primary,}} >
              <Image
                source={
                  require('../../assets/headerlogo.png')
                }
                style={{height:100,width:100,marginHorizontal:20}}
              />
            </View>
   
        <View style={{ flex: 1 }}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
  
                if (route.name === "homeshopowner") {
                  iconName = focused ? "ios-home" : "ios-home-outline";
                } else if (route.name === "Shopownerprofile") {
                  iconName = focused ? "ios-person" : "ios-person-outline";
                }
  
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarLabelStyle: {
                fontSize: 12,
              },
              tabBarActiveTintColor: COLORS.primary,
              tabBarInactiveTintColor: "gray",
              tabBarShowLabel: true,
              tabBarStyle: {
                borderTopWidth: 0,
                borderTopColor: "gray",
                paddingBottom: 8,
                height: 60,
                // Optional: Border color
              },
            })}
          >
            <Tab.Screen
              name="homeshopowner"
              component={Shopownerhomepage}
              options={{ tabBarLabel: "Home", headerShown: false }}
            />
            <Tab.Screen
              name="Shopownerprofile"
              component={Shopownerprofile}
              options={{ tabBarLabel: "Profile", headerShown: false }}
            />
           
          </Tab.Navigator>
        </View>
      </View>
    );
  };
  const styles = StyleSheet.create({
    box1: {
      backgroundColor: COLORS.primary,
      height: 100,
      width: Width,
    },
    searchbar: {
      
      width:'90%',
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      backgroundColor: "white",
      elevation: 5,
      borderRadius: 10,
      shadowOffset: {
        height: 2,
        width: 2,
      },
      shadowColor: "black",
    },
    searchinput: {
      height: "100%",
      width: "80%",
    },
  });
  export default Shopownernav