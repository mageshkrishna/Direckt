import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  BackHandler,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import JobCard from "./Jobcard";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { COLORS } from "../../constants/Theme";
import { useFocusEffect,useRoute } from "@react-navigation/native";

const Shopownerhomepage = () => {
  const route = useRoute();
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
  const [token, setToken] = useState(null);
  const [job, setJob] = useState([]);
  const [shopownerdata, setShopOwnerData] = useState(null);
  const [ownerdetail, setOwnerDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const value = await SecureStore.getItemAsync("shopownertoken");
      setToken(value);

      const data = await AsyncStorage.getItem("shopownerdata");
      if (data) {
        const parsedData = JSON.parse(data);
        setShopOwnerData(parsedData);
        setOwnerDetail(parsedData._id);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [shopOwnerToken,refreshing]);

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
      if (!shopownerdata || !shopownerdata.location || !shopownerdata.category || !token) {
        return;
      }

      const location = shopownerdata.location;
      const category = shopownerdata.category;
      const email = shopownerdata.email;

      try {
        const response1 = await axios.get(
          `https://direckt-copy1.onrender.com/shopowner/getjobs?location=${location}&category=${category}&email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setJob(response1.data);
        console.log(response1.data)
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          // Axios-related error
          if (error.response) {
            // Response received with an error status code
            showToast(`Error: ${error.response.data.error}`);
          } else {
            // Network error (no response received)
            showToast("Network error. Please check your internet connection.");
          }
        } else {
          // Non-Axios error
          console.log(error);
          showToast("An error occurred. Please try again.");
        }
      }
    };

    if (refreshing) {
      return; // Avoid calling getJob if refreshing
    }

    getJob();
  }, [shopownerdata, token]);

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
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!job && <ActivityIndicator size="medium" color="#0000ff" />}
      {job.length > 0 && ownerdetail ? (
        job.map((item, index) => (
          <View key={index}>
            <JobCard item={item} ownerdetail={ownerdetail} token={token} />
          </View>
        ))
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 550, width: '100%' }}>
          <Image
            source={
              require('../../assets/Loading-rafiki.png')
            }
            style={{ height: '50%', width: '80%' }}
          />
          <Text>No jobs available. Refresh the app</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Shopownerhomepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
});
