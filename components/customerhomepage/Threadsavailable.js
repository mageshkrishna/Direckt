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
} from "react-native";
import { useState, useEffect } from "react";
import {
  MaterialIcons,
  AntDesign,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import React from "react";
import axios, { Axios } from "axios";
import { Entypo } from '@expo/vector-icons';
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const InsideAccorditon = ({ data }) => {
  console.log(" InsideAccorditon " + data.shopowner_id.businessname);
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
      
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'#5271FF',
        padding:2,
        borderRadius:5
      
      }}
    >
      <View style={{ width: "30%", height: "100%" }}>
        <View style={{ height: 100, width: "100%" }}>
          <Image
            source={{ uri: data.shopowner_id.profilepic }}
            style={{
              height: 90,
              width: "100%",

              borderRadius: 4,
            }}
          ></Image>
        </View>
        <TouchableOpacity>
          <View
            style={{ justifyContent: "space-evenly", alignItems: "center" }}
          >
            <Text>{data.shopowner_id.businessname}</Text>

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
        <Text  style={{color:'#5271FF'}} >Reply message:</Text>
        <View style={{borderRadius:5}}>
          <ScrollView style={{ borderRadius: 2,borderWidth:0.1 }}>
            <Text style={{padding:5}}>
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
              alignItems: "center",
            }}
          >
            {data.deliveryStatus ? (
              <Text>Delivery:<Text style={{color:'green'}}> YES</Text></Text>
            ) : (
              <Text>Delivery:<Text  style={{color:'red'}}> NO</Text></Text>
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
};
const AccordionItem = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [jobreply, setjobreply] = useState([]);

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
            // onPress={() => setShowPopup(true)}
          >
            <Image
              source={{ uri: data.image_url }}
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "white",
              }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="category" size={17} color="black" />
              <Text style={styles.threadcategory} numberOfLines={1}>
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
                onPress={() => Alert.alert("Do you want to delete?")}
              >
                <AntDesign name="delete" size={12} color="red" />
                <Text style={styles.threadowner}> Delete</Text>
              </TouchableOpacity>
              <View style={styles.viewdetails}>
                <Text>View response</Text>
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
            job Responses
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
  const [data, setdata] = useState([]);
  const v = false;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://direckt-copy1.onrender.com/Customerdata/getreplydata?email=magesh@gmail.com"
        );
        console.log(response.data);
        setdata(response.data.result);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [v]);
  if (data.length == 0) {
    return (
      <View>
        <View style={styles.titlecontainer}>
          <MaterialIcons name="live-tv" size={24} color="green" />
          <Text style={styles.pagetitle}>Your Threads</Text>
        </View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ScrollView>
    
      <ScrollView style={styles.threadcontainer}>
        <View>
          {data.map((item, index) => (
            <AccordionItem key={index} data={item} />
          ))}
        </View>
      </ScrollView>
    </ScrollView>
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
  },
  threaddes: {
    fontSize: 13,
    color: "grey",
  },
  threadowner: {
    color: "red",
    textDecorationLine: "underline",
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
  },
});


// import { View, Text, StyleSheet} from 'react-native'
// import React from 'react'
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import { useNavigation } from '@react-navigation/native'
// import { COLORS } from '../../constants/Theme'

// const Threadsavailable = () => {
//   const navigation = useNavigation();
//   const Handlenavigatetocreatethread = () =>{
//     navigation.navigate('Createthread')
//   }
//   return (
//     <View style={{flex:1 ,alignItems:'center',justifyContent:'center'}}>
//       <TouchableOpacity onPress={Handlenavigatetocreatethread} style={styles.nav} >
//         <Text style={{color:'white',fontSize:16,fontWeight:500}}>Create your First Thread</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default Threadsavailable
// const styles= StyleSheet.create({
//   nav:{
//     paddingHorizontal:20,
//     paddingVertical:10,
//     backgroundColor:COLORS.primary,
//     borderRadius:10
//   }
// })