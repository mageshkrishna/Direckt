import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import { Feather, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
import { Alert } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Checkbox from "expo-checkbox";
import axios from "axios";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const CustomerSearchBar = () => {
  const [businessname, setbusinessname] = useState(null);
  const [category, setcategory] = useState(null);
  const [availabilitystatus, setavailabilitystatus] = useState(false);
  const[shopowner,setshopowner]  = useState([])
  const storeresult = [
    {
      storename: "Anbu",
      location: "Vallioor",
      deliverystatus: true,
    },
    {
      storename: "Ram Stores",
      location: "Petharangapuram",
      deliverystatus: false,
    },
  ];
  const categories = [
    { key: "1", value: "grocery" },
    { key: "2", value: "electronic" },
    { key: "3", value: "Computers" },
  ];

  const fetchData = async () => {
    console.log("searching....")
    if(!businessname && !category){
      Alert.alert('businessname required')
      return;
    }
    try {
      let formdata = {
        businessname: businessname,
      };
  
      if (category) {  // Corrected the typo from catgeory to category
        formdata.category = category;
      }
  
      if (availabilitystatus) {
        formdata.availabilitystatus = availabilitystatus;
      }
  
      const response = await axios.get('https://direckt-copy1.onrender.com/shopowner/getshops', {
        params: formdata,
      });
  
      console.log(response.data);
      setshopowner(response.data)
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleviewprofile = async () => {
    console.log("Profile page");
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchcontainer}>
        <View style={styles.searchbar}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <TextInput
            style={styles.searchinput}
            placeholder={"Search shops near you..."}
            value={businessname}
            onChangeText={(e) => setbusinessname(e)}
            onSubmitEditing={fetchData}
          />
          <TouchableOpacity onPress={fetchData}>
            <Feather name="search" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.filtercontainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              columnGap: 10,
            }}
          >
            <Text style={{ color: "grey" }}>Shop open</Text>
            <Checkbox
              value={availabilitystatus}
              onValueChange={setavailabilitystatus}
              color={availabilitystatus ? "#4630EB" : undefined}
            />
          </View>
          <View style={{ width: "45%" }}>
            <SelectList
              setSelected={(val) => setcategory(val)}
              data={categories}
              save="value"
              placeholder="category"
            />
          </View>
        </View>
      </View>
      <ScrollView style={styles.resultcontainer}>
        {shopowner.map((data) => {
          return (
            <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 150,
              borderStyle:'solid',
              borderWidth:1,
              borderColor:'#5271FF',
              padding:2,
              borderRadius:5,
              marginBottom:20
            
            }}
          >
            <View style={{ width: "30%", height: "100%" }}>
              <View style={{ height: 100, width: "100%" }}>
                <Image
                  source={{ uri: data.profilepic }}
                  style={{
                    height: 100,
                    width: "100%",
      
                    borderRadius: 4,
                  }}
                ></Image>
              </View>
              <TouchableOpacity>
                <View
                  style={{ height:50,justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{color:'#5271FF'}}>View Profile</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                width: "70%",
                height: "100%",
                
                rowGap: 5,
              }}
            >
              <Text  style={{color:'#5271FF'}} >{data.businessname}</Text>
              <View style={{ height: 63,borderRadius:5}}>
               <Text style={{marginBottom:10}}>{data.businessabout}</Text>
               <Text >category: {data.category}</Text>
              </View>
              <View
                style={{
                  height: 50,
                
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                 
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                {data.availabilitystatus?<Text style={styles.storeavailable}>Store is Open</Text>:<Text style={styles.storenotavailable}>Store Closed</Text>}
                </View>
                <View
                  style={{
                  
                    width: "50%",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => Alert.alert("Hello")}
                    style={styles.storedirection}
                  >
                    <MaterialIcons name="phone-in-talk" size={33} color="#5271FF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Hello")}
                    style={styles.storedirection}
                  >
                    <Entypo name="location" size={33} color="#5271FF" />
                   
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CustomerSearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchcontainer: {
    paddingTop: 50,
    padding: 20,
    justifyContent: "space-evenly",
    gap: 20,
  },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowColor: "black",
  },
  searchinput: {
    height: "100%",
    width: "75%",
    paddingHorizontal: 9,
  },
  filtercontainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  filter: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },

  resultcontainer: {
    flex: 1,
    height: (height * 76) / 100,
    padding: 20,
    backgroundColor: "#FAF9F9"
    
  },
  resultcard: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 1,
    marginVertical: "2%",
  },
  storeprofileImage: {
    flex: 1,
    width: "10%",
    height: "100%",
  },
  storedetails: {
    flex: 1,
    justifyContent: "space-evenly",
    height: "100%",
    width: "50%",
  },
  storectc: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    width: "40%",
  },
  storename: {
    fontSize: 20,
    fontWeight: "medium",
  },
  storeavailable: {
    padding: 4,
    backgroundColor: "#FAF9F9",
    borderRadius: 5,
    fontSize: 12,
    color: "#00BF63",
  },
  storenotavailable: {
    padding: 4,
    backgroundColor: "#FAF9F9",
    borderRadius: 5,
    fontSize: 12,
    color: "red",
  },
  storeprofilelink: {
    color: "orange",
    textDecorationLine: "underline",
  },
  storelocation: {
    fontSize: 12,
  },
  storedirection: {
    borderWidth: 2,
    padding: 4,
    borderColor: "#5271FF",
    borderRadius: 150,
  },
});
