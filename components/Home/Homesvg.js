
import { Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../Home/Direcktsvg.png"
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { changeLanguage } from '../../redux/LanguageAction';

const Direcktsvg = () => {
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const handlelanguage = async () => {
   
      let currentlang = await SecureStore.getItemAsync('language'); 
      if(currentlang){
        dispatch(changeLanguage(currentlang))
      }
    }
       
    useEffect(() => {
       



        const retrieveData = async () => {
          try {
            const storedData = await AsyncStorage.getItem('customerdata');
            const storedData2 = await AsyncStorage.getItem('shopownerdata');
            if(storedData){
              navigation.navigate("Customerhome")
            } else if(storedData2){
                 navigation.navigate("Shopownernav")

            }
            else{
                navigation.navigate("Home")
            }
        
          } catch (error) {
           
          }
        };
    
        handlelanguage()
        retrieveData();
      }, []);
  

 
    return(
        <SafeAreaView style={{flex:1, alignItems:"center",justifyContent:"center"}}>
            <Image source={logo} style={{height:300,width:300}}/>
        </SafeAreaView>
    )
}


export default Direcktsvg;