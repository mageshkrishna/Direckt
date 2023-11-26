
import { Image,Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../Home/Direcktsvg.png"
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;
const Direcktsvg = () => {
    const navigation = useNavigation(); 
    useEffect(() => {
        // Function to retrieve data from AsyncStorage
        const retrieveData = async () => {
          try {
            const storedData = await AsyncStorage.getItem('customerdata');

            if(!storedData){
              navigation.navigate("Home")
            } else{
                navigation.navigate("Customerhome")
            }
        
          } catch (error) {
            console.error('Error retrieving data from AsyncStorage:', error);
          }
        };
    
        // Call the function to retrieve data when the component mounts
        retrieveData();
      }, []);
    return(
        <SafeAreaView style={{flex:1, alignItems:"center",justifyContent:"center"}}>
            <Image source={logo} style={{height:300,width:300}}/>
        </SafeAreaView>
    )
}


export default Direcktsvg;