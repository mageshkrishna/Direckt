import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native'
import { TextInput } from 'react-native'
import { Feather, Entypo, Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const height = Dimensions.get("window").height
const width = Dimensions.get("window").width

const CustomerSearchBar = () => {
  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView
      style={styles.container}
    >
      <View
        style={styles.searchcontainer}
      >
        <View
          style={styles.searchbar}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <TextInput
            style={styles.searchinput}
            placeholder={'Search shops near you...'} />
          <Feather name="search" size={30} color="black" />
        </View>
        <View
          style={styles.filtercontainer}
        >
          <View style={styles.filter}>
            <Ionicons name="filter" size={16} color="black" style={{ paddingHorizontal: 3 }} />
            <Text>filter</Text>
          </View>
          <View style={styles.location}>
            <Entypo name="location" size={16} color="black" style={{ paddingHorizontal: 7 }} />
            <Text>Select Location</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.resultcontainer}>
        {<View style={styles.resultcard}>
          <View style={styles.storeprofileImage}>
            <Image
              source={require('../../assets/splash.png')}
              style={{ height: '100%', width: '80%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
            ></Image>
          </View>
          <View style={styles.storedetails}>
            <Text style={styles.storename} numberOfLines={1}>Anbu Stores</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="location-sharp" size={17} color="black" />
              <Text style={styles.storelocation} numberOfLines={1}> Vallior</Text>
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Profile')}
            >
              <Text style={styles.storeprofilelink}>View Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.storectc}>
            <TouchableOpacity
              onPress={() => Alert.alert('calling...')}
              style={styles.storedirection}>
              <MaterialIcons name="phone-in-talk" size={35} color="#5271FF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert('you have reached your destination')}
              style={styles.storedirection}>
              <FontAwesome5 name="directions" size={35} color="#5271FF" />
            </TouchableOpacity>
          </View>
        </View>}
      </ScrollView>
    </ScrollView>
    </SafeAreaView>
  )
}

export default CustomerSearchBar

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  searchcontainer: {
    flex: 1,
    margin: 0,
    height: (height * 24) / 100,
    padding: 20,
    justifyContent: 'space-evenly',
    elevation: 0.5,
  },
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    shadowOffset: {
      height: 2,
      width: 2
    },
    shadowColor: "black",
  },
  searchinput: {
    height: '100%',
    width: '75%',
    paddingHorizontal:9,
  },
  filtercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  filter: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  location: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  resultcontainer: {
    flex: 1,
    height: (height * 76) / 100,
    padding: 20,
    backgroundColor: '#FAF9F9',
  },
  resultcard: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: (height * 13) / 100,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 1,
    marginVertical: '2%',
  },
  storeprofileImage: {
    flex: 1,
    width: '10%',
    height: '100%',
  },
  storedetails: {
    flex: 1,
    justifyContent: 'space-evenly',
    height: '100%',
    width: '50%',
  },
  storectc: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '100%',
    width: '40%',
  },
  storename: {
    fontSize: 20,
    fontWeight: 'medium',
  },
  storeprofilelink: {
    color: '#46CC6B',
  },
  storedirection: {
    borderWidth: 2,
    padding: 4,
    borderColor: '#5271FF',
    borderRadius: 150,
  }
})