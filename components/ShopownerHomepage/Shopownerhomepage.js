import React, { useEffect, useState } from "react";
import {
  View,
  Text,

  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Image,
  BackHandler,
  Dimensions,
  ToastAndroid,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import JobCard from "./Jobcard";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants/Theme";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {createnewauthtokenForShopowner} from '../RefreshSession/RefreshSession'
import { setShopOwnerToken } from "../../redux/shopOwnerAuthActions";
const height = Dimensions.get("window").height;

const Shopownerhomepage = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (route.name === "homeshopowner") {
          BackHandler.exitApp();
          return true; // Prevent going back to the previous page
        }
        return false; // Allow the default back action on other screens
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [route.name])
  );
  const shopOwnerToken = useSelector(
    (state) => state.shopOwnerAuth.shopOwnerToken
  );


  const [refreshing, setRefreshing] = useState(false);
  
  const [job, setJob] = useState([]);
  const [shopownerdata, setShopOwnerData] = useState(null);
  const [ownerdetail, setOwnerDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("shopownerdata");
      if (data) {
        const parsedData = JSON.parse(data);
        setShopOwnerData(parsedData);
        setOwnerDetail(parsedData._id);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();     
    setLoading(false);
  }, [shopOwnerToken, refreshing]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  useEffect(() => {
    const getJob = async () => {
      console.log("stared")
      if (!shopownerdata || !shopownerdata.location || !shopownerdata.category ) {
        return;
      }

      const location = shopownerdata.location;
      const category = shopownerdata.category;
      const email = shopownerdata.email;
      console.log(category)
      const token = await SecureStore.getItemAsync("shopownertoken");
      try {
        setLoading(true);
        const response1 = await axios.get(
          `https://direckt-copy1.onrender.com/shopowner/getjobs?location=${location}&category=${category}&email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      console.log(response1.data)
        setJob(response1.data);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          console.log(error.response.status); 
          if (error.response.status === 429) {
              const newtoken = await createnewauthtokenForShopowner(email);
              console.log("new token : " + newtoken)
              if(newtoken){
                await SecureStore.setItemAsync('shopownertoken',newtoken);
                dispatch(setShopOwnerToken(newtoken))
                await getJob(); 
              }
              else{
                alert("No received")
              }
          } else if (error.response.status === 401) {
              showToast('Invalid Auth Token');
          } else {
              // Handle other status codes or errors
              alert('Unexpected Error:', error.response.data);
          }
      }
      else if (axios.isAxiosError(error)) {
          // Axios-related error
          if (error.response) {
            showToast(`Error: ${error.response.data.error}`);
          } else {
            // Network error (no response received)
            showToast("Network error. Please check your internet connection.");
          }
        } else {
          showToast("An error occurred. Please try again.");
        }
      }
      finally{
        setLoading(false);
      }
    
    };

    if (refreshing) {
      return;
    }

    getJob();
  }, [shopownerdata,shopOwnerToken]);

  if (loading) {
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

  return (
    <View style={{flex:1,}}>
      {!job && <ActivityIndicator size="medium" color="#0000ff" />}
      {job.length > 0 && ownerdetail ? (
       <View
       style={{
         flex: 1,
         flexDirection: "column",
         justifyContent: "space-between",
       }}>
       <ScrollView
         style={{
           flex: 1,
           height: (height * 85) / 100,
           paddingHorizontal: 10,
           backgroundColor: "#E0E5FF",
         }}
         refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
         }
       >
         {job.slice().reverse().map((item, index) => (
           <View key={index}>
             <JobCard item={item} ownerdetail={ownerdetail} token={token} />
           </View>
         ))}
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
         <Text style={{ fontSize: 16 }}>Click to Refresh</Text>
       </TouchableOpacity>
     </View>
      ) : (
        <ScrollView
        style={{
          flex: 1,
          height: (height * 80) / 100,
          paddingHorizontal: 10,
          backgroundColor: "white",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: (height * 75) / 100, width: '100%' , backgroundColor: "white", }}>
          <Image
            source={
              require('../../assets/Loading-rafiki.png')
            }
            style={{ height: '50%', width: '80%' }}
          />
          <Text>No jobs available. Refresh the app</Text>
        </View>
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
            <Text style={{ fontSize: 16 }}>Refresh for new jobs</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default Shopownerhomepage;

