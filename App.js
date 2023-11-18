import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './components/Home/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const stack = createStackNavigator();
const App=()=> {
  return (
    <NavigationContainer>
       <stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Home'>
        <stack.Screen name ="Home" component={Home}/>
      </stack.Navigator>
    </NavigationContainer>

  );
}
export default App; 

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
