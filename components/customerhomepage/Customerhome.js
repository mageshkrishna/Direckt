import {
  View,
  Text,
  Alert,
  Button,
  SafeAreaView,
  BackHandler,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Profile from "./Profile";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/Theme";

import Createthread from "./Createthread/Createthread";
import Threadsavailable from "./Threadsavailable";
import { TextInput } from "react-native-gesture-handler";
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
// cuStomer home checking
const Customerhome = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const handleFocus = () => {
    
    navigation.navigate("Customersearchbar");
   
  };
  const inputRef = React.createRef();
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (route.name === "Customerhome") {
          BackHandler.exitApp();
          return true; // Prevent going back to the previous page
        }
        return false; // Allow the default back action on other screens
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [route.name])
  );
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
      <View
        style={{
          width: "100%",
          height: "10%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.primary,
        }}
      >
        
        
          <TouchableOpacity style={styles.searchbar} onPress={handleFocus}>
         <Text style={styles.searchinput}>search shop nearby</Text>
          <Feather name="search" size={30} color="black" />
          </TouchableOpacity>
        
      </View>

      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "homeCustomer") {
                iconName = focused ? "ios-home" : "ios-home-outline";
              } else if (route.name === "Createthread") {
                iconName = focused
                  ? "ios-add-circle"
                  : "ios-add-circle-outline";
              } else if (route.name === "Customerprofile") {
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
            name="homeCustomer"
            component={Threadsavailable}
            options={{ tabBarLabel: "Home", headerShown: false }}
          />
          <Tab.Screen
            name="Createthread"
            component={Createthread}
            options={{ tabBarLabel: "Create", headerShown: false }}
          />
          <Tab.Screen
            name="Customerprofile"
            component={Profile}
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
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal:20,
    justifyContent: 'space-between',
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
    color:COLORS.gray
  },
});
export default Customerhome;
