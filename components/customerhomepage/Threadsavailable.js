import { View, Text, StyleSheet} from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { COLORS } from '../../constants/Theme'

const Threadsavailable = () => {
  const navigation = useNavigation();
  const Handlenavigatetocreatethread = () =>{
    navigation.navigate('Createthread')
  }
  return (
    <View style={{flex:1 ,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={Handlenavigatetocreatethread} style={styles.nav} >
        <Text style={{color:'white',fontSize:16,fontWeight:500}}>Create your First Thread</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Threadsavailable
const styles= StyleSheet.create({
  nav:{
    paddingHorizontal:20,
    paddingVertical:10,
    backgroundColor:COLORS.primary,
    borderRadius:10
  }
})