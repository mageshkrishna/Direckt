import { View, Text,Alert,Button, SafeAreaView, BackHandler, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Createthread from './Createthread';
import Profile from './Profile';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Theme';

import ImagePickerExample from './getImage';
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
const Customerhome = () => {
    const navigation = useNavigation();
  
  const route = useRoute();
 
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (route.name === "Customerhome") {
          BackHandler.exitApp();
          return true; // Prevent going back to the previous page
        }
        return false; // Allow the default back action on other screens
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        backHandler.remove();
      };
    }, [route.name])
  );
  const removeData = async () => {
    try {
      // Remove data
      await AsyncStorage.removeItem('customerdata');
      navigation.navigate('Home')
      console.log('Data removed successfully');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
           removeData()
            
            console.log('Logging out...');
          },
        },
      ],
      { cancelable: false }
    );
  };
const Tab = createBottomTabNavigator()
return (
  <View style={{flex:1}}>
    <View style={{height:50}}>
       <View style={styles.box1}>
        <Text>hello</Text>
       </View>
    </View>
  <View style={{ flex: 1 }}>
    <Tab.Navigator
     screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'home') {
          iconName = focused ? 'ios-home' : 'ios-home-outline';
        } else if (route.name === 'Page1') {
          iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
        } else if (route.name === 'Page2') {
          iconName = focused ? 'ios-person' : 'ios-person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarLabelStyle:{
        fontSize:12
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: true,
      tabBarStyle: {
         borderTopWidth:0,
        borderTopColor: 'gray',
        paddingBottom:8,
        height:60,
        // Optional: Border color
      },
    })}
    >
      <Tab.Screen name="home" component={ImagePickerExample} options={{ tabBarLabel: 'Home' ,headerShown:false}} />
      <Tab.Screen name="Page1" component={Createthread} options={{ tabBarLabel: 'Create',headerShown:false }} />
      <Tab.Screen name="Page2" component={Profile} options={{ tabBarLabel: 'Profile' ,headerShown:false}} />
    </Tab.Navigator>
  </View>
  </View>
);
};
const styles = StyleSheet.create({
  box1:{
    backgroundColor:COLORS.primary,height:100,width:Width
  }
})
export default Customerhome