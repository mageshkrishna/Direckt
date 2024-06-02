import * as SecureStore from "expo-secure-store";
import axios from 'axios'
import {
    ToastAndroid
} from 'react-native'





async function createnewauthtoken ( email ){
  
    
    try{
        const token = await SecureStore.getItemAsync('refreshToken')
        if(!token){
            showToast('Refresh Token Not found Login again')
            //remove user and logout them - removerUser()
            return null;
        }
        
        const formdata={
            email:email,
            token:token
        }

        const response = await axios.post('https://direckt-copy1.onrender.com/auth/refreshcus',formdata)
        const responseData = response.data
        const newauthtoken = responseData.authtoken
        return newauthtoken
    }
    catch(error){
 
      
     
    }
}



async function createnewauthtokenForShopowner ( email ){
    
    try{
        const token = await SecureStore.getItemAsync('refreshTokenShopowner')
        if(!token){
            showToast('Refresh Token Not found Login again')
            //remove user and logout them - removerUser()
            return null;
        }
        
        const formdata={
            email:email,
            token:token
        }
     
        const response = await axios.post('https://direckt-copy1.onrender.com/auth/refreshshopowner',formdata)
        const responseData = response.data
        const newauthtoken = responseData.authtoken
        return newauthtoken
    }
    catch(error){
        

    }
}




const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };

module.exports ={ createnewauthtoken , createnewauthtokenForShopowner}