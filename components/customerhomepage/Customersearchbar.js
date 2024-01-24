import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Linking,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import { Feather, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { LinearProgress } from "@rneui/base";
import { COLORS } from "../../constants/Theme";
import ImagePopup from "../ShopownerHomepage/Imagepopup";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const Shopcard = ({data ,index}) => {
  const colorScheme  = useColorScheme();
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.resultcard} key={index}>
      <View style={styles.resultcardtop}>
        <View style={styles.storeprofileImage}>
          <TouchableOpacity
            style={{ height: "100%", width: "80%", borderRadius: 5 }}
            onPress={() => setShowPopup(true)}
          >
            {data.profilepic?<Image
              source={{
                uri: data.profilepic,
              }}
              style={{ height: "100%", width: "100%", borderRadius: 5 }}
            />:<Image
            source={require('../../assets/shop.png')}
            style={{ height: "100%", width: "100%", borderRadius: 5 }}
          />
            }
          </TouchableOpacity>
        </View>

        {showPopup && (
          data.profilepic?<ImagePopup
            imageUrl={data.profilepic}
            onClose={() => setShowPopup(false)}
          />:<></>
        )}

        <View style={styles.resultcardtopdetails}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[
                styles.storename,
                
              ]}
              numberOfLines={1}
            >
              {data.businessname}
            </Text>
            {data.availabilitystatus ? (
              <Text style={styles.storeavailable}>Store is Open</Text>
            ) : (
              <Text style={styles.storenotavailable}>Store Closed</Text>
            )}
          </View>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onPress={() => {
              navigation.navigate("storeprofile", { _id: data._id });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 2,
                borderColor: "#5271FF",
                color: "#5271FF",
                borderRadius: 5,
              
              }}
            >
              <Text style={{ color: "#5271FF", fontSize: 12 }}>
                View Profile{" "}
              </Text>
              <Feather name="send" size={14} color="#5271FF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.resultcardmiddle}>
        <Text
          style={{ color: "grey", fontSize: 13, marginVertical: 5 }}
          numberOfLines={2}
        >
          {data.businessabout?data.businessabout:"There is no description available for this shop"}
        </Text>
        <ScrollView
          style={{ flexDirection: "row", marginVertical: 6 }}
          horizontal={true}
        >
          {data.category.map((item, index) => {
            return (
              <View key={index}>
                <Text
                  style={{
                    padding: 4,
                    backgroundColor:
                      colorScheme === "dark" ? "grey" : "#FAF9F9",
                    color: colorScheme === "dark" ? "black" : "black",
                    borderRadius: 5,
                    fontSize: 13,
                    marginHorizontal: 2,
                  }}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.resultcardctc}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            paddingHorizontal: 26,
            paddingVertical: 7,
            borderWidth: 2,
            borderColor: "#5271FF",
            color: "white",
            borderRadius: 5,
            backgroundColor: "#5271FF",
          }}
          onPress={() => { Linking.openURL(`tel:${data.phonenumber}`)}}
        >
          <Text style={{ color: "white" }}>Call Now </Text>
          <MaterialIcons name="phone-in-talk" size={13} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            paddingHorizontal: 26,
            paddingVertical: 7,
            borderWidth: 2,
            borderColor: "#5271FF",
            color: "white",
            borderRadius: 5,
            backgroundColor: "#5271FF",
          }}
          onPress={() => {
            data.gmaplink?Linking.openURL(data.gmaplink):Alert.alert("Google map is not linked")
          }}
        >
          <Text style={{ color: "white" }}>Direction </Text>
          <FontAwesome5 name="directions" size={13} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const CustomerSearchBar = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [businessname, setbusinessname] = useState(null);
  const [category, setcategory] = useState(null);
  const [availabilitystatus, setavailabilitystatus] = useState(false);
  const [shopowner, setshopowner] = useState([]);
  const [progress, setProgress] = useState(0);
  const [linearProgress, setlinearProgress] = useState(false);
  const[resultmessage , setresultmessage] = useState("Find shop and service")
  const categories = [
    { key: "1", value: "grocery" },
    { key: "2", value: "electronic" },
    { key: "3", value: "Computers" },
  ];

  const fetchData = async () => {
    console.log("searching....");
    if (!businessname && !category) {
      Alert.alert("businessname required");
      return;
    }
    try {
      setlinearProgress(true);

      setProgress(0.15);
      let formdata = {
        businessname: businessname,
      };

      if (category) {
       
        formdata.category = category;
      }

      if (availabilitystatus) {
        formdata.availabilitystatus = availabilitystatus;
      }

      const response = await axios.get(
        "https://direckt-copy1.onrender.com/shopowner/getshops",
        {
          params: formdata,
        }
      );
      if(response.data.length === 0){
        setresultmessage('No Shops or service found')
      }
      console.log(response.data);
      setshopowner(response.data);
      setProgress(1);
      setTimeout(() => {
        setlinearProgress(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchcontainer}>
        <View
          style={[
            styles.searchbar,
            { backgroundColor: colorScheme === "dark" ? "#3C4142" : "white" },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#8A57E4" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchinput}
            placeholder={"Search shops near you..."}
            value={businessname}
            onChangeText={(e) => setbusinessname(e)}
            onSubmitEditing={fetchData}
          />
          <TouchableOpacity onPress={fetchData}>
            <Feather name="search" size={30} color="#8A57E4" />
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
            <Text style={{ color: colorScheme === "dark" ? "grey" : "grey" }}>
              Shop open
            </Text>
            <Checkbox
              value={availabilitystatus}
              onValueChange={setavailabilitystatus}
              color={availabilitystatus ? "#3C4142" : undefined}
            />
          </View>
          <View style={{ width: "45%" }}>
            <SelectList
              setSelected={(val) => setcategory(val)}
              data={categories}
              save="value"
              placeholder="category"
              dropdownTextStyles={{ color: "grey" }}
              inputStyles={{ color: "grey" }}
            />
          </View>
        </View>
        {linearProgress && (
          <LinearProgress
            value={progress}
            variant="determinate"
            color={COLORS.primary}
          />
        )}
      </View>
     
      <ScrollView
        style={[
          styles.resultcontainer,
          { backgroundColor: colorScheme === "dark" ? "#3C4142" : "#F7F9FF" },
        ]}
      >
         {shopowner.length ===0&&<View><Text style={{textAlign:'center'}}>
        {resultmessage+"..."}
        </Text>
        </View>
        }
        {shopowner.map((data, index) => {
          return(
            <Shopcard data={data} key ={index}></Shopcard>
          )
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
    backgroundColor: "white",
  },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    elevation: 5,
    borderRadius: 10,
    shadowColor: "grey",
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
  },
  resultcardtop: {
    flexDirection: "row",
    height: 65,
  },
  resultcard: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 1,
    marginVertical: "2%",
    paddingHorizontal: 5,
  },
  storeprofileImage: {
    padding: 5,
    width: "25%",
    alignItems: "center",
  },
  resultcardtopdetails: {
    flexDirection: "row",
    padding: 5,
    width: "70%",
  },
  resultcardmiddle: {
    paddingHorizontal: 20,
    paddingVertical: 3,
    justifyContent: "space-evenly",
    height: 70,
    borderBottomWidth: 0.19,
    borderColor: "gray",
  },
  resultcardctc: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-evenly",
  },
  storename: {
    fontSize: 21,
    fontWeight: "medium",
  },
  storeavailable: {
    padding: 4,
    // backgroundColor: '#FAF9F9',
    borderRadius: 5,
    fontSize: 12,
    color: "#00BF63",
  },
  storenotavailable: {
    padding: 4,
    // backgroundColor: '#FAF9F9',
    borderRadius: 5,
    fontSize: 12,
    color: "red",
  },
  dropdownItemStyles: {
    color: "red",
  },
});
// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import React, { useState } from "react";
// import { FontAwesome5, AntDesign } from "@expo/vector-icons";
// import { MaterialIcons } from "@expo/vector-icons";
// import { ScrollView } from "react-native";
// import { TextInput } from "react-native";
// import { Feather, Entypo, Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// // import axios from "axios";
// import { Alert } from "react-native";
// import { SelectList } from "react-native-dropdown-select-list";
// import Checkbox from "expo-checkbox";
// import axios from "axios";
// const height = Dimensions.get("window").height;
// const width = Dimensions.get("window").width;

// const CustomerSearchBar = () => {
//   const [businessname, setbusinessname] = useState(null);
//   const [category, setcategory] = useState(null);
//   const [availabilitystatus, setavailabilitystatus] = useState(false);
//   const[shopowner,setshopowner]  = useState([])
//   const navigation = useNavigation();
//   const storeresult = [
//     {
//       storename: "Anbu",
//       location: "Vallioor",
//       deliverystatus: true,
//     },
//     {
//       storename: "Ram Stores",
//       location: "Petharangapuram",
//       deliverystatus: false,
//     },
//   ];
//   const categories = [
//     { key: "1", value: "grocery" },
//     { key: "2", value: "electronic" },
//     { key: "3", value: "Computers" },
//   ];

//   const fetchData = async () => {
//     console.log("searching....")
//     if(!businessname && !category){
//       Alert.alert('businessname required')
//       return;
//     }
//     try {
//       let formdata = {
//         businessname: businessname,
//       };

//       if (category) {  // Corrected the typo from catgeory to category
//         formdata.category = category;
//       }

//       if (availabilitystatus) {
//         formdata.availabilitystatus = availabilitystatus;
//       }

//       const response = await axios.get('https://direckt-copy1.onrender.com/shopowner/getshops', {
//         params: formdata,
//       });

//       console.log(response.data);
//       setshopowner(response.data)
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleviewprofile = async () => {
//     console.log("Profile page");
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.searchcontainer}>
//         <View style={styles.searchbar}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//           <TextInput
//             style={styles.searchinput}
//             placeholder={"Search shops near you..."}
//             value={businessname}
//             onChangeText={(e) => setbusinessname(e)}
//             onSubmitEditing={fetchData}
//           />
//           <TouchableOpacity onPress={fetchData}>
//             <Feather name="search" size={30} color="black" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.filtercontainer}>
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "flex-start",
//               columnGap: 10,
//             }}
//           >
//             <Text style={{ color: "grey" }}>Shop open</Text>
//             <Checkbox
//               value={availabilitystatus}
//               onValueChange={setavailabilitystatus}
//               color={availabilitystatus ? "#4630EB" : undefined}
//             />
//           </View>
//           <View style={{ width: "45%" }}>
//             <SelectList
//               setSelected={(val) => setcategory(val)}
//               data={categories}
//               save="value"
//               placeholder="category"
//             />
//           </View>
//         </View>
//       </View>
//       <ScrollView style={styles.resultcontainer}>
//         {shopowner.map((data) => {
//           return (
//             <View
//             style={{
//               flexDirection: "row",
//               width: "100%",
//               height: 150,
//               borderStyle:'solid',
//               borderWidth:1,
//               borderColor:'#5271FF',
//               padding:2,
//               borderRadius:5,
//               marginBottom:20

//             }}
//           >
//             <View style={{ width: "30%", height: "100%" }}>
//               <View style={{ height: 100, width: "100%" }}>
//                 <Image
//                   source={{ uri: data.profilepic }}
//                   style={{
//                     height: 100,
//                     width: "100%",

//                     borderRadius: 4,
//                   }}
//                 ></Image>
//               </View>
//               <TouchableOpacity
//                onPress={()=>{
//                 navigation.navigate('storeprofile', { _id: data._id })
//               }}>
//                 <View
//                   style={{ height:50,justifyContent: "center", alignItems: "center" }}
//                 >
//                   <Text style={{color:'#5271FF'}}>View Profile</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//             <View
//               style={{
//                 paddingHorizontal: 10,
//                 width: "70%",
//                 height: "100%",

//                 rowGap: 5,
//               }}
//             >
//               <Text  style={{color:'#5271FF'}} >{data.businessname}</Text>
//               <View style={{ height: 63,borderRadius:5}}>
//                <Text style={{marginBottom:10}}>{data.businessabout}</Text>
//                <Text >category: {data.category}</Text>
//               </View>
//               <View
//                 style={{
//                   height: 50,

//                   flexDirection: "row",
//                 }}
//               >
//                 <View
//                   style={{

//                     width: "50%",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                 {data.availabilitystatus?<Text style={styles.storeavailable}>Store is Open</Text>:<Text style={styles.storenotavailable}>Store Closed</Text>}
//                 </View>
//                 <View
//                   style={{

//                     width: "50%",
//                     flexDirection: "row",
//                     justifyContent: "space-evenly",
//                     alignItems: "center",
//                     gap: 10,
//                   }}
//                 >
//                   <TouchableOpacity
//                     onPress={() => Alert.alert("Hello")}
//                     style={styles.storedirection}
//                   >
//                     <MaterialIcons name="phone-in-talk" size={33} color="#5271FF" />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => Alert.alert("Hello")}
//                     style={styles.storedirection}
//                   >
//                     <Entypo name="location" size={33} color="#5271FF" />

//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </View>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// };

// export default CustomerSearchBar;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   searchcontainer: {
//     paddingTop: 50,
//     padding: 20,
//     justifyContent: "space-evenly",
//     gap: 20,
//   },
//   searchbar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     height: 50,
//     backgroundColor: "white",
//     elevation: 5,
//     borderRadius: 10,
//     shadowOffset: {
//       height: 2,
//       width: 2,
//     },
//     shadowColor: "black",
//   },
//   searchinput: {
//     height: "100%",
//     width: "75%",
//     paddingHorizontal: 9,
//   },
//   filtercontainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//   },
//   filter: {
//     flexDirection: "row",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "grey",
//     width: "45%",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   resultcontainer: {
//     flex: 1,
//     height: (height * 76) / 100,
//     padding: 20,
//     backgroundColor: "#FAF9F9"

//   },
//   resultcard: {
//     flex: 1,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     height: 100,
//     backgroundColor: "white",
//     borderRadius: 10,
//     elevation: 1,
//     marginVertical: "2%",
//   },
//   storeprofileImage: {
//     flex: 1,
//     width: "10%",
//     height: "100%",
//   },
//   storedetails: {
//     flex: 1,
//     justifyContent: "space-evenly",
//     height: "100%",
//     width: "50%",
//   },
//   storectc: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     height: "100%",
//     width: "40%",
//   },
//   storename: {
//     fontSize: 20,
//     fontWeight: "medium",
//   },
//   storeavailable: {
//     padding: 4,
//     backgroundColor: "#FAF9F9",
//     borderRadius: 5,
//     fontSize: 12,
//     color: "#00BF63",
//   },
//   storenotavailable: {
//     padding: 4,
//     backgroundColor: "#FAF9F9",
//     borderRadius: 5,
//     fontSize: 12,
//     color: "red",
//   },
//   storeprofilelink: {
//     color: "orange",
//     textDecorationLine: "underline",
//   },
//   storelocation: {
//     fontSize: 12,
//   },
//   storedirection: {
//     borderWidth: 2,
//     padding: 4,
//     borderColor: "#5271FF",
//     borderRadius: 150,
//   },
// });
