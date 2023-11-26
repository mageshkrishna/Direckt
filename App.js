import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./components/Home/Home";
import Logincustomer from "./components/CustomerAuthentication/Logincustomer";
import Signupcustomer from "./components/CustomerAuthentication/Signupcustomer";
import UserLogin from "./components/Userauthentication/UserLogin";
import Userregister from "./components/Userauthentication/Userregister";
import Finalverification from "./components/Userauthentication/Finalverification";
import Customerhome from "./components/customerhomepage/Customerhome";
import Direcktsvg from "./components/Home/Homesvg";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
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
          name="Optverification"
          component={Finalverification}
          options={{ headerTransparent: true, title: "" }}
        />
         <Stack.Screen
          name="Customerhome"
          component={Customerhome}
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="Direcktsvg"
          component={Direcktsvg}
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
