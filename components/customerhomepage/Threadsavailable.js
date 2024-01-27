import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Image,
  ImageBackground,
  Pressable,
  Linking,
  Alert,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import axios, { Axios } from "axios";
import { Entypo } from "@expo/vector-icons";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import { COLORS } from "../../constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ImagePopup from "../ShopownerHomepage/Imagepopup";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const InsideAccorditon = ({ data }) => {
  console.log(" InsideAccorditon " + data.shopowner_id.phonenumber);
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        borderBottomWidth: 1,
        borderColor: COLORS.gray,
        padding: 2,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: "white",
        elevation: 2.5,
      }}
    >
      <View style={{ width: "30%", height: "100%" }}>
        <TouchableOpacity
          style={{ height: 100, width: "100%" }}
          onPress={() => setShowPopup(true)}
        >
          <Image
            source={{ uri: data.shopowner_id.profilepic }}
            style={{
              height: 95,
              width: "100%",

              borderRadius: 4,
            }}
          ></Image>
        </TouchableOpacity>
        {showPopup && (
          <ImagePopup
            imageUrl={data.shopowner_id.profilepic}
            onClose={() => setShowPopup(false)}
          />
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("storeprofile", { _id: data.shopowner_id._id });
          }}
        >
          <View
            style={{ justifyContent: "space-evenly", alignItems: "center" }}
          >
            <Text style={{ fontSize: 14 }}>
              {data.shopowner_id.businessname}
            </Text>
            <Text style={{ color: COLORS.primary, fontSize: 12 }}>
              View Profile
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 5,
          width: "70%",
          height: "100%",
          rowGap: 5,
        }}
      >
        <Text style={{ color: COLORS.primary, marginTop: 3, fontSize: 14 }}>
          Reply message:
        </Text>
        <View style={{}}>
          <ScrollView style={{ borderRadius: 0.5, borderWidth: 0.05 }}>
            <Text style={{ padding: 5, color: "#3C4142" }}>
              {data.replymessage}
            </Text>
          </ScrollView>
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
              alignItems: "flex-start",
            }}
          >
            {data.deliveryStatus ? (
              <Text>
                Delivery:<Text style={{ color: "green" }}> YES</Text>
              </Text>
            ) : (
              <Text>
                Delivery:<Text style={{ color: "red" }}> NO</Text>
              </Text>
            )}
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
              onPress={() => {
                Linking.openURL(`tel:${data.shopowner_id.phonenumber}`);
              }}
              style={styles.storecall}
            >
              <MaterialIcons name="phone-in-talk" size={33} color="#5271FF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(data.shopowner_id.gmaplink);
              }}
              style={styles.storedirection}
            >
              <Entypo name="location" size={30} color="#5271FF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
const AccordionItem = ({ data,token }) => {
  const [expanded, setExpanded] = useState(false);
  const [jobreply, setjobreply] = useState([]);
  const [jobIdToDelete, setjobIdToDelete] = useState(data._id);
  const [showPopup, setShowPopup] = useState(false);
  const handleDeleteJob = async () => {
    console.log(jobIdToDelete);
    try {
      // Make a DELETE request using Axios
      const response = await axios.delete(
        "https://direckt-copy1.onrender.com/Customerdata/deletejob",
        {
          params: { _id: jobIdToDelete },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Job deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete job");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  useEffect(() => {
    setjobreply(data.jobreply);
    console.log(jobreply);
  }, [data]);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View>
      <Pressable onPress={toggleExpand}>
        <View style={styles.thread}>
          <TouchableOpacity
            style={styles.threadImage}
            onPress={() => setShowPopup(true)}
          >
            <Image
              source={{ uri: data.image_url }}
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "white",
              }}
            />
            {showPopup && (
              <ImagePopup
                imageUrl={data.image_url}
                onClose={() => setShowPopup(false)}
              />
            )}
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.threadcategory} numberOfLines={1}>
                {" "}
                {data.category}
              </Text>
            </View>
          </TouchableOpacity>
          <Pressable style={styles.threaddetails} onPress={toggleExpand}>
            <Text style={styles.threadtitle} numberOfLines={2}>
              {data.jobtitle}
            </Text>
            <Text style={styles.threaddes} numberOfLines={3}>
              {data.jobdescription}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 3,
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
                onPress={() =>
                  Alert.alert(
                    "Confirm Deletion",
                    "Do you want to delete?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "delete",
                        onPress: () => {
                          handleDeleteJob();
                        },
                      },
                    ],
                    { cancelable: true }
                  )
                }
              >
                <AntDesign name="delete" size={12} color="red" />
                <Text style={styles.threadowner}> Delete</Text>
              </TouchableOpacity>
              <View style={styles.viewdetails}>
                {jobreply.length > 0 ? (
                  <>
                    <Text style={{ color: "green" }}>
                      {jobreply.length} response
                    </Text>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "No responses come back after some minutes",
                        "",
                        [{ text: "OK", onPress: () => {} }],
                        { cancelable: true }
                      );
                    }}
                  >
                    <Text>no response</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
      {expanded && jobreply && jobreply.length > 0 && (
        <View style={styles.responsecontainer}>
          <Text
            style={{ textAlign: "center", paddingVertical: 10, fontSize: 18 }}
          >
            Job Responses
          </Text>
          {jobreply.map((item, index) => (
            <InsideAccorditon key={index} data={item} />
          ))}
        </View>
      )}
    </View>
  );
};

const Threadsavailable = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [data, setdata] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setemail] = useState();
  const [indicator, setindicator] = useState(false);
  const [token, settoken] = useState(null);

  const v = false;

  useEffect(() => {
    setindicator(true);
    const fetchData = async () => {
      try {
        SecureStore.getItemAsync("customertoken")
          .then((value) => {
            console.log("Retrieved value available:", value);
            settoken(value);
          })
          .catch((error) => console.error("Error retrieving value:", error));
        const data = await AsyncStorage.getItem("customerdata");
        if (data) {
          const parsedData = JSON.parse(data);
          setemail(parsedData.email);
          console.log("email+" + email);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (refreshing || !email|| !token) {
      return;
    }
    const fetchData = async () => {
      console.log(email);
      try {
        const response = await axios.get(
          `https://direckt-copy1.onrender.com/Customerdata/getreplydata?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response.data);
        setdata(response.data.result);
        setindicator(false);
      } catch (error) {
        setindicator(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    console.log("Current color scheme:", colorScheme);
  }, [email, refreshing,token]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true); // Set refreshing to true before fetching data

    setTimeout(() => {
      setRefreshing(false); // Set refreshing back to false after data is fetched
    }, 2000);
  }, []);

  if (indicator) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={80} color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }
  if (data.length == 0) {
    return (
      <ScrollView
      style={{
        flex: 1,
        flexDirection: "column",
     
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
      
          height:height
        }}
      
      >
        
        <Image
          source={require("../../assets/Location-review-pana.png")}
          style={{ height: "50%", width: "80%" }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Createthread")}
          style={{
            padding: 10,
            paddingHorizontal: 20,
            backgroundColor: COLORS.primary,
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="add" size={14} color="white" />
          <Text style={{ color: "white" }}> Create Job</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <ScrollView
        style={styles.threadcontainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          You can only create 5 job at same time.
        </Text>
        <View>
          {data.map((item, index) => (
            <AccordionItem key={index} data={item} token={token}/>
          ))}
        </View>
        <Text style={{ textAlign: "center" }}>
          Delete the jobs you don't need.
        </Text>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          onRefresh();
        }}
        style={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="refresh" size={24} color="black" />
        <Text style={{ fontSize: 16 }}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Threadsavailable;

const styles = StyleSheet.create({
  titlecontainer: {
    flex: 1,
    flexDirection: "row",
    height: (height * 5) / 100,
    alignItems: "center",
    justifyContent: "center",
  },

  threadcontainer: {
    flex: 1,
    height: (height * 85) / 100,
    paddingHorizontal: 10,
    backgroundColor: "#E0E5FF",
  },
  thread: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    height: (height * 18) / 100,
    backgroundColor: "white",
    elevation: 1,
    marginVertical: "3%",
    marginHorizontal: "3%",
    borderRadius: 5,
    borderWidth: 0.3,
  },
  threadImage: {
    width: (width * 35) / 100,
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  threadcategory: {
    paddingVertical: 5,
  },
  threaddetails: {
    flex: 1,
    height: "100%",
    justifyContent: "space-evenly",
    width: (width * 65) / 100,
    padding: 7,
  },
  threadsection: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    marginRight: 5,
    height: "100%",
    width: "40%",
  },
  threadtitle: {
    fontSize: 18,
    fontWeight: "medium",
    color: COLORS.primary,
  },
  threaddes: {
    fontSize: 13,
    color: "grey",
  },
  threadowner: {
    color: "red",
  },
  viewdetails: {
    padding: 4,
    backgroundColor: "#f4f5fb",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  responsecontainer: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
});
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   TouchableOpacity,
//   LayoutAnimation,
//   UIManager,
//   Image,
//   ImageBackground,
//   Pressable,
//   Linking,
//   Alert,
// } from "react-native";
// import { useState, useEffect } from "react";
// import {
//   MaterialIcons,
//   AntDesign,
//   Ionicons,
//   FontAwesome5,
// } from "@expo/vector-icons";
// import React from "react";
// import axios, { Axios } from "axios";
// import { Entypo } from '@expo/vector-icons';
// const height = Dimensions.get("window").height;
// const width = Dimensions.get("window").width;

// UIManager.setLayoutAnimationEnabledExperimental &&
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// const InsideAccorditon = ({ data }) => {
//   console.log(" InsideAccorditon " + data.shopowner_id.businessname);
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         width: "100%",

//         borderStyle:'solid',
//         borderWidth:1,
//         borderColor:'#5271FF',
//         padding:2,
//         borderRadius:5

//       }}
//     >
//       <View style={{ width: "30%", height: "100%" }}>
//         <View style={{ height: 100, width: "100%" }}>
//           <Image
//             source={{ uri: data.shopowner_id.profilepic }}
//             style={{
//               height: 90,
//               width: "100%",

//               borderRadius: 4,
//             }}
//           ></Image>
//         </View>
//         <TouchableOpacity>
//           <View
//             style={{ justifyContent: "space-evenly", alignItems: "center" }}
//           >
//             <Text>{data.shopowner_id.businessname}</Text>

//             <Text style={{color:'#5271FF'}}>View Profile</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//       <View
//         style={{
//           paddingHorizontal: 10,
//           width: "70%",
//           height: "100%",

//           rowGap: 5,
//         }}
//       >
//         <Text  style={{color:'#5271FF'}} >Reply message:</Text>
//         <View style={{borderRadius:5}}>
//           <ScrollView style={{ borderRadius: 2,borderWidth:0.1 }}>
//             <Text style={{padding:5}}>
//               {data.replymessage}
//             </Text>
//           </ScrollView>
//         </View>
//         <View
//           style={{
//             height: 50,

//             flexDirection: "row",
//           }}
//         >
//           <View
//             style={{

//               width: "50%",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {data.deliveryStatus ? (
//               <Text>Delivery:<Text style={{color:'green'}}> YES</Text></Text>
//             ) : (
//               <Text>Delivery:<Text  style={{color:'red'}}> NO</Text></Text>
//             )}
//           </View>
//           <View
//             style={{

//               width: "50%",
//               flexDirection: "row",
//               justifyContent: "space-evenly",
//               alignItems: "center",
//               gap: 10,
//             }}
//           >
//             <TouchableOpacity
//               onPress={() => Alert.alert("Hello")}
//               style={styles.storedirection}
//             >
//               <MaterialIcons name="phone-in-talk" size={33} color="#5271FF" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => Alert.alert("Hello")}
//               style={styles.storedirection}
//             >
//               <Entypo name="location" size={33} color="#5271FF" />

//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };
// const AccordionItem = ({ data }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [jobreply, setjobreply] = useState([]);

//   useEffect(() => {
//     setjobreply(data.jobreply);
//     console.log(jobreply);
//   }, [data]);
//   const toggleExpand = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setExpanded(!expanded);
//   };

//   return (
//     <View>
//       <Pressable onPress={toggleExpand}>

//         <View style={styles.thread}>
//           <TouchableOpacity
//             style={styles.threadImage}
//             // onPress={() => setShowPopup(true)}
//           >
//             <Image
//               source={{ uri: data.image_url }}
//               style={{
//                 height: "100%",
//                 width: "100%",
//                 backgroundColor: "white",
//               }}
//             />
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <MaterialIcons name="category" size={17} color="black" />
//               <Text style={styles.threadcategory} numberOfLines={1}>
//                 {data.category}
//               </Text>
//             </View>
//           </TouchableOpacity>
//           <Pressable style={styles.threaddetails} onPress={toggleExpand}>
//             <Text style={styles.threadtitle} numberOfLines={2}>
//               {data.jobtitle}
//             </Text>
//             <Text style={styles.threaddes} numberOfLines={3}>
//               {data.jobdescription}
//             </Text>
//             <View
//               style={{
//                 flexDirection: "row",
//                 marginTop: 3,
//                 alignItems: "center",
//                 justifyContent: "space-evenly",
//               }}
//             >
//               <TouchableOpacity
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "space-evenly",
//                 }}
//                 onPress={() => Alert.alert("Do you want to delete?")}
//               >
//                 <AntDesign name="delete" size={12} color="red" />
//                 <Text style={styles.threadowner}> Delete</Text>
//               </TouchableOpacity>
//               <View style={styles.viewdetails}>
//                 <Text>View response</Text>
//               </View>
//             </View>
//           </Pressable>
//         </View>
//       </Pressable>
//       {expanded && jobreply && jobreply.length > 0 && (
//         <View style={styles.responsecontainer}>
//           <Text
//             style={{ textAlign: "center", paddingVertical: 10, fontSize: 18 }}
//           >
//             job Responses
//           </Text>
//           {jobreply.map((item, index) => (
//             <InsideAccorditon key={index} data={item} />
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const Threadsavailable = () => {
//   const [data, setdata] = useState([]);
//   const v = false;
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://direckt-copy1.onrender.com/Customerdata/getreplydata?email=magesh@gmail.com"
//         );
//         console.log(response.data);
//         setdata(response.data.result);
//         console.log(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [v]);
//   if (data.length == 0) {
//     return (
//       <View>
//         <View style={styles.titlecontainer}>
//           <MaterialIcons name="live-tv" size={24} color="green" />
//           <Text style={styles.pagetitle}>Your Threads</Text>
//         </View>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }
//   return (
//     <ScrollView>

//       <ScrollView style={styles.threadcontainer}>
//         <View>
//           {data.map((item, index) => (
//             <AccordionItem key={index} data={item} />
//           ))}
//         </View>
//       </ScrollView>
//     </ScrollView>
//   );
// };

// export default Threadsavailable;

// const styles = StyleSheet.create({
//   titlecontainer: {
//     flex: 1,
//     flexDirection: "row",
//     height: (height * 5) / 100,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   threadcontainer: {
//     flex: 1,
//     height: (height * 85) / 100,
//     paddingHorizontal: 10,
//     backgroundColor: "#E0E5FF",
//   },
//   thread: {
//     flex: 1,
//     alignItems: "center",
//     flexDirection: "row",
//     height: (height * 18) / 100,
//     backgroundColor: "white",
//     elevation: 1,
//     marginVertical: "3%",
//     marginHorizontal: "3%",
//     borderRadius: 5,
//   },
//   threadImage: {
//     width: (width * 35) / 100,
//     height: "70%",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 5,
//   },
//   threadcategory: {
//     paddingVertical: 5,
//   },
//   threaddetails: {
//     flex: 1,
//     height: "100%",
//     justifyContent: "space-evenly",
//     width: (width * 65) / 100,
//     padding: 7,
//   },
//   threadsection: {
//     flex: 1,
//     justifyContent: "space-evenly",
//     alignItems: "flex-start",
//     marginRight: 5,
//     height: "100%",
//     width: "40%",
//   },
//   threadtitle: {
//     fontSize: 18,
//     fontWeight: "medium",
//   },
//   threaddes: {
//     fontSize: 13,
//     color: "grey",
//   },
//   threadowner: {
//     color: "red",
//     textDecorationLine: "underline",
//   },
//   viewdetails: {
//     padding: 4,
//     backgroundColor: "#f4f5fb",
//     borderRadius: 5,
//     marginHorizontal: 5,
//   },
//   responsecontainer: {
//     backgroundColor: "white",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
// });

// // import { View, Text, StyleSheet} from 'react-native'
// // import React from 'react'
// // import { TouchableOpacity } from 'react-native-gesture-handler'
// // import { useNavigation } from '@react-navigation/native'
// // import { COLORS } from '../../constants/Theme'

// // const Threadsavailable = () => {
// //   const navigation = useNavigation();
// //   const Handlenavigatetocreatethread = () =>{
// //     navigation.navigate('Createthread')
// //   }
// //   return (
// //     <View style={{flex:1 ,alignItems:'center',justifyContent:'center'}}>
// //       <TouchableOpacity onPress={Handlenavigatetocreatethread} style={styles.nav} >
// //         <Text style={{color:'white',fontSize:16,fontWeight:500}}>Create your First Thread</Text>
// //       </TouchableOpacity>
// //     </View>
// //   )
// // }

// // export default Threadsavailable
// // const styles= StyleSheet.create({
// //   nav:{
// //     paddingHorizontal:20,
// //     paddingVertical:10,
// //     backgroundColor:COLORS.primary,
// //     borderRadius:10
// //   }
// // })
