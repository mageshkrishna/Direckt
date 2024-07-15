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
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { createnewauthtokenForShopowner } from '../RefreshSession/RefreshSession';
import { setShopOwnerToken } from "../../redux/shopOwnerAuthActions";
import { strings } from "../../locals/translations";


const height = Dimensions.get("window").height;

const Shopownerhomepage = () => {
  const route = useRoute();
  const dispatch = useDispatch();

  const shopOwnerToken = useSelector(
    (state) => state.shopOwnerAuth.shopOwnerToken
  );
  const lang = useSelector(
    (state) => state.appLanguage.language
  );

     
  const [refreshing, setRefreshing] = useState(false);
  const [job, setJob] = useState([]);
  const [shopownerdata, setShopOwnerData] = useState(null);
  const [ownerdetail, setOwnerDetail] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (route.name === "homeshopowner") {
          BackHandler.exitApp();
          return true;
        }
        return false;
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

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("shopownerdata");
      if (data) {
        const parsedData = JSON.parse(data);
        setShopOwnerData(parsedData);
        setOwnerDetail(parsedData._id);
        setEmail(parsedData.email);
      }
    } catch (err) {

    }
  };
  const navigation = useNavigation();
  const getJob = async () => {
    if (!shopownerdata || !shopownerdata.location || !shopownerdata.category) {
      setJob([])
      Alert.alert(
        "Provide both location and category to receive tasks",
        "You can change this information in the Edit Profile section.",
        [
          {
            text: "OK",
            onPress: () => {
             
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    
    const { location, category, email } = shopownerdata;
    const token = await SecureStore.getItemAsync("shopownertoken");

    try {
      setLoading(true);
      const response = await axios.get(
        `https://server.direckt.site/shopowner/getjobs?location=${location}&category=${category}&email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (Array.isArray(response.data.result)) {
        setJob(response.data.result);
      } else {
     
        setJob([]);
      }
    } catch (error) {
      if (error.response) {
   
        if (error.response.status === 429) {
          const newToken = await createnewauthtokenForShopowner(email);
          if (newToken) {
            await SecureStore.setItemAsync('shopownertoken', newToken);
            dispatch(setShopOwnerToken(newToken));
            getJob();
          } else {
            navigation.replace('Home')
          }
        } else if (error.response.status === 401) {
          ToastAndroid.show('Invalid Auth Token', ToastAndroid.SHORT);
        } else {
          Alert.alert('Unexpected Error:');
        }
      } else if (axios.isAxiosError(error)) {
        if (error.response) {
          ToastAndroid.show(`Error: ${error.response.data.error}`, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Network error. Please check your internet connection.", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shopOwnerToken]);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (shopownerdata && email) {
      getJob();
    }
  }, [shopownerdata, shopOwnerToken, email]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getJob();
    setRefreshing(false);
  }, [shopownerdata, shopOwnerToken, email ,refreshing]);

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
    <View style={{ flex: 1 }}>
      {job.length > 0 && ownerdetail ? (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
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
                <JobCard item={item} ownerdetail={ownerdetail} email={email} />
              </View>
            ))}
            <View style={{width:"100%" , height:100}}></View>
          </ScrollView>
          <TouchableOpacity
            onPress={onRefresh}
            style={{
              height: 50,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="refresh" size={24} color="black" />
            <Text style={{ fontSize: 16 }}>{strings[`${lang}`].refresh}</Text>
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
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: (height * 75) / 100, width: '100%', backgroundColor: "white" }}>
            <Image
              source={require('../../assets/Loading-rafiki.png')}
              style={{ height: '50%', width: '80%' }}
            />
            <Text>No Tasks available. Refresh the app</Text>
          </View>
          <TouchableOpacity
            onPress={onRefresh}
            style={{
              height: 50,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="refresh" size={24} color="black" />
            <Text style={{ fontSize: 16 }}>{strings[`${lang}`].refresh}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default Shopownerhomepage;
