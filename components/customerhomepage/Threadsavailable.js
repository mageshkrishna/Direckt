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
  ToastAndroid,
  Modal,
  BackHandler,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import axios, { Axios } from "axios";
import { Entypo, Feather } from "@expo/vector-icons";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import { COLORS } from "../../constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import ImagePopup from "../ShopownerHomepage/Imagepopup";
import moment from "moment";
import { useSelector } from "react-redux";
const showToast = (e) => {
  ToastAndroid.show(e, ToastAndroid.SHORT);
};
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const InsideAccorditon = ({ data }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();
  console.log(data.deliverystatus);
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
      <View style={{ width: "30%", height: "100%", }}>
        <TouchableOpacity
          style={{ height: 100, width: "100%" }}
          onPress={() => setShowPopup(true)}
        >
          {data.shopowner_id.profilepic ? <Image
            source={{
              uri: data.shopowner_id.profilepic,
            }}
            style={{
              height: 95,
              width: "100%",
              borderRadius: 4,
            }}
          /> : <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3u_DGIWouUwuaqQE88-nun_n2h-Pb2yRQXQ&usqp=CAU', }}
            style={{
              height: 95,
              width: "100%",
              borderRadius: 4,
            }}
          />
          }
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
          style={{ height: 50, justifyContent: 'space-evenly', }}
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
            {data.deliverystatus ? (
              <Text>
                Delivery:<Text style={{ color: "green" }}> Yes</Text>
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
                data.shopowner_id.gmaplink ? Linking.openURL(data.shopowner_id.gmaplink) : showToast('Google map is not linked')
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
const AccordionItem = ({ data, token, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [jobreply, setjobreply] = useState([]);
  const [jobIdToDelete, setjobIdToDelete] = useState(data._id);
  const [showPopup, setShowPopup] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteindicator, setdeleteindicator] = useState(false)
  const [deactivateindicator, setdeactivateindicator] = useState(false)

  const timestamp = data.expiryAt;
  const localDateTime = moment(timestamp).utcOffset('+00:00').format('DD-MM-YYYY h:mm:ss A');

  // console.log("moment" + localDateTime);

  const deactivatejob = async () => {
    try {
      setdeactivateindicator(true)
      const response = await axios.post('https://direckt-copy1.onrender.com/Customerdata/changeactivestate', { _id: jobIdToDelete }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setdeactivateindicator(false)
      ToastAndroid.show('Job Deactivated', ToastAndroid.SHORT);
    }
    catch (error) {
      setdeactivateindicator(false)
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
  }
  const handleDeleteJob = async () => {
    console.log(jobIdToDelete);
    try {
      setdeleteindicator(true)
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
        setModalVisible(!modalVisible);
      }
      setdeleteindicator(false)
    } catch (error) {
      setdeleteindicator(false);

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

  useEffect(() => {
    setjobreply(data.jobreply);
  }, [data]);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View>
      <Pressable onPress={toggleExpand}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Feather name="check-circle" size={62} color="green" />
              <Text style={styles.modalText}>Job Deleted Successfully</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  onRefresh();
                }}>
                <Text style={styles.textStyle}>Okay</Text>
              </Pressable>
            </View>
          </View>
        </Modal>


        <View style={styles.thread}>
          {data.status ? <View style={styles.expirationtitle}>
            <Text style={styles.expireText}>Job expire at {localDateTime}</Text>
          </View> : <></>}
          <View style={styles.threadcardsection}>
            <TouchableOpacity
              style={styles.threadImage}
              onPress={() => setShowPopup(true)}
            >
              {data.image_url ? <Image
                source={{
                  uri: data.image_url,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "white",
                }}
              /> : <Image
                source={{ uri: 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg', }}
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "white",
                }}
              />
              }
              {showPopup && data.image_url ? (
                <ImagePopup
                  imageUrl={data.image_url}
                  onClose={() => setShowPopup(false)}
                />
              ) : <></>}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="category" size={17} color="black" />
                <Text style={styles.threadcategory} numberOfLines={1}>
                  {data.category}
                </Text>
              </View>
            </TouchableOpacity>
            <Pressable style={styles.threaddetails} onPress={toggleExpand}>
              {data.status ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                    onPress={() =>
                      Alert.alert(
                        "Confirm Deactivation",
                        "You can Deactivate the Job only once. Do you want to deactivate?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Deactivate", // Corrected from "deactivated" to "Deactivate"
                            onPress: async () => {
                              await deactivatejob();
                              onRefresh()
                            },
                          },
                        ],
                        { cancelable: true }
                      )
                    }
                  >
                    {deactivateindicator && <ActivityIndicator size={18} color="purple" />}
                    <Text style={styles.deactivate}>Deactivate</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={styles.deactivated}>Not active</Text>
                </View>
              )}
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
                  {deleteindicator ? <ActivityIndicator size={18} color="purple" /> : <AntDesign name="delete" size={12} color="red" />}

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
                        ToastAndroid.show('No responses come back after some minutes', ToastAndroid.SHORT);
                      }}
                    >
                      <Text>no response</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Pressable>
          </View>
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

const Threadsavailable = ({ route }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [data, setdata] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setemail] = useState();
  const [indicator, setindicator] = useState(false);
  const [token, settoken] = useState(null);
  const router = useRoute()
  const v = false;
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (router.name === "homeCustomer") {
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
    }, [router.name])
  );
  useEffect(() => {
    if (route.params) {
      onRefresh();
    }
  }, [route.params]);
  const custoken = useSelector(
    (state) => state.customerAuth.customertoken
  );
  console.log("customertoken" + custoken);
  useEffect(() => {
    setindicator(true);
    const fetchData = async () => {
      try {
        SecureStore.getItemAsync("customertoken")
          .then((value) => {
            settoken(value);
          })
          .catch((error) => console.log("Error retrieving value:", error));
        const data = await AsyncStorage.getItem("customerdata");
        console.log("inide fetchdata ...........????"+data)
        
          const parsedData = JSON.parse(data);
          setemail(parsedData.email);
          setindicator(false);
      } catch (err) {
        setindicator(false);
        console.log(err);
      }
    };

    fetchData();
  }, [custoken]);

  useEffect(() => {
    if (refreshing ) {
      return;
    }
    const fetchjob = async () => {
      if(!email || !token){
        return;
      }
  
      try {
        setindicator(true)
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

    fetchjob();
  }, [email,refreshing,token]);

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
          backgroundColor: '#E0E5FF',
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
            height: 690,
            padding: 15,
            backgroundColor: '#E0E5FF',
          }}

        >
          <Image
            source={require("../../assets/final3.png")}
            style={{ height: "100%", width: "100%",margin:0 }}
          />
        </View>
        <View style={{alignItems:'çenter',marginTop:-160,backgroundColor:'#E0E5FF',marginHorizontal:'35%'}}>
        <TouchableOpacity
            onPress={() => navigation.navigate("Createthread")}
            style={{
              padding: 10,
              width:120,
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
            <AccordionItem key={index} data={item} token={token} onRefresh={onRefresh} />
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
  expirationtitle: {
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderColor: '#f4f5fb',
    justifyContent: 'center',
  },
  expireText: {
    color: 'grey',
    fontSize: 14,
    color: COLORS.gray
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
    justifyContent: 'center',
    backgroundColor: "white",
    elevation: 1,
    marginVertical: "3%",
    marginHorizontal: "3%",
    borderRadius: 5,
    borderWidth: 0.3,
    paddingVertical: 20,
  },
  threadcardsection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threadImage: {
    width: (width * 35) / 100,
    height: 100,
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
    fontSize: 16,
    fontWeight: "medium",
    color: COLORS.primary,
  },
  threaddes: {
    fontSize: 12,
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
  deactivate: {
    padding: 2,
    backgroundColor: "#f4f5fb",
    borderRadius: 5,
    marginHorizontal: 5,
    fontSize: 12,
  },
  deactivated: {
    padding: 3,
    backgroundColor: "#f4f5fb",
    borderRadius: 5,
    marginHorizontal: 5,
    fontSize: 12,
    color: 'red'
  },
  responsecontainer: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'space-evenly',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  modalText: {
    paddingVertical: 15,
    textAlign: 'center',
  },
});
