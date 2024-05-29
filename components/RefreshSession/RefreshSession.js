import * as SecureStore from "expo-secure-store";
import axios from 'axios'
import {
    ToastAndroid
} from 'react-native'

async function removeUser(){

}


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
        console.log(formdata)
        const response = await axios.post('https://direckt-copy1.onrender.com/auth/refreshcus',formdata)
        const responseData = response.data
        const newauthtoken = responseData.authtoken
        showToast("new token created!")
        return newauthtoken
    }
    catch(error){
        alert(error)
        if(error.response){
            if(error.response.status === 400){
                showToast(error.response.data.message)
            }
            else{
                console.log(error.response.data.message)
            }
        }
        console.log(error)
    }
}

const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };

module.exports = createnewauthtoken