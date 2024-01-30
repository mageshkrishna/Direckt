import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./components/Home/Home";
import Logincustomer from "./components/CustomerAuthentication/Logincustomer";
import Signupcustomer from "./components/CustomerAuthentication/Signupcustomer";
import UserLogin from "./components/Userauthentication/UserLogin";
import Userregister from "./components/Userauthentication/Userregister";

import Customerhome from "./components/customerhomepage/Customerhome";
import Direcktsvg from "./components/Home/Homesvg";
import { StatusBar } from "react-native";
import { COLORS } from "./constants/Theme";
import CustomerSearchBar from "./components/customerhomepage/Customersearchbar";
import Shopownerhomepage from "./components/ShopownerHomepage/Shopownerhomepage";
import Shopownernav from "./components/ShopownerHomepage/Shopownernavigation";
import EditOwnerProfile from "./components/ShopownerHomepage/Editshopownerprofile";
import StoreProfile from "./components/customerhomepage/Storeprofile";
import CustomerForgetpassword from "./components/CustomerAuthentication/CustomerForgetpassword";
import Customerpassword from "./components/CustomerAuthentication/Customerpassword";
import Shopownerpassword from "./components/Userauthentication/Shopownerchangepassword";
import ShopownerForgetpassword from "./components/Userauthentication/Shopownerforgetpassword";



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar hidden={false} backgroundColor={COLORS.primary}/>
      <Stack.Navigator initialRouteName="Direcktsvg">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Logincustomer"
          component={Logincustomer}
          options={{ headerTransparent: true, title: "" }}
        />
        <Stack.Screen
          name="Signupcustomer"
          component={Signupcustomer}
          options={{ headerTransparent: true, title: "" }}
        />
        <Stack.Screen
          name="Userlogin"
          component={UserLogin}
          options={{ headerTransparent: true, title: "" }}
        />
         <Stack.Screen
          name="Userregister"
          component={Userregister}
          options={{ headerTransparent: true, title: "" }}
        />
         <Stack.Screen
          name="CustomerForgetpassword"
          component={CustomerForgetpassword}
          options={{ headerTransparent: true, title: "" }}
        />
         <Stack.Screen
          name="Customerhome"
          component={Customerhome}
          options={{ headerShown:false }}
        />
          <Stack.Screen
          name="Shopownerhomepage"
          component={Shopownerhomepage}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Direcktsvg"
          component={Direcktsvg}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Customersearchbar"
          component={CustomerSearchBar}
          options={{ headerShown:false }}
        />
         <Stack.Screen
          name="Shopownernav"
          component={Shopownernav}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="EditOwnerProfile"
          component={EditOwnerProfile}
          options={{ headerShown:false }}
        />
         <Stack.Screen
          name="storeprofile"
          component={StoreProfile}
          options={{ headerShown:false }}
        />
          <Stack.Screen
          name="Customerpassword"
          component={Customerpassword}
          options={{ headerShown:false }}
        />
         <Stack.Screen
          name="Shopownerchangepassword"
          component={Shopownerpassword}
          options={{ headerShown:false }}
        />
         <Stack.Screen
          name="Shopownerforgotpassword"
          component={ShopownerForgetpassword}
          options={{ headerShown:false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import Home from "./components/Home/Home";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import Logincustomer from "./components/CustomerAuthentication/Logincustomer";

// import Signupcustomer from "./components/CustomerAuthentication/Signupcustomer";
// const stack = createStackNavigator();
// const App = () => {
//   return (
//     <NavigationContainer>
//       <stack.Navigator
//         screenOptions={{ headerShown: false }}
//         initialRouteName="Home"
//       >
//         <stack.Screen name="Home" component={Home} />
//         <stack.Screen name="Logincustomer" component={Logincustomer} />
//         <stack.Screen name="Signupcustomer" component={Signupcustomer} />
//       </stack.Navigator>
//     </NavigationContainer>
//   );
// };
// export default App;
