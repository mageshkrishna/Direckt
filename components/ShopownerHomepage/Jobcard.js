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
  TextInput,
  ActivityIndicator,
  ViewComponent,
  ToastAndroid,
  Modal,
} from "react-native";
import moment from 'moment';

import { useState} from "react";
import {
  MaterialIcons,

  Feather
} from "@expo/vector-icons";
import "react-native";
import { COLORS } from "../../constants/Theme";
import React from "react";
import ImagePopup from "./Imagepopup";
import axios from "axios";
import {createnewauthtokenForShopowner} from '../RefreshSession/RefreshSession'
import * as SecureStore from "expo-secure-store";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import Checkbox from "expo-checkbox";
import { useDispatch, useSelector } from "react-redux";
import { setShopOwnerToken } from "../../redux/shopOwnerAuthActions";
import { strings } from "../../locals/translations";
import { useNavigation } from "@react-navigation/native";
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const JobCard = ({ item, ownerdetail ,email }) => {
  const dispatch = useDispatch();
  const job_id = item._id;
  const [modalVisible, setModalVisible] = useState(false);
  const [deliverystatus, setdeliverystatus] = useState(false);
  const [replymessage, setreplymessage] = useState(null);
  const [uploading, setuploading] = useState(false);
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };

  const timestamp = item.expiryAt;
  const localDateTime = moment(timestamp).utcOffset('+00:00').format('DD-MM-YYYY h:mm:ss A');
  const navigation = useNavigation();
  const createreply = async () => {
    const token = await SecureStore.getItemAsync("shopownertoken");

    if (!replymessage) {
      showToast("Please fill  fields");
      setuploading(false);
      return;
    }
    setuploading(true);
    if (!job_id || !ownerdetail) {
      showToast("Something went wrong. Refresh the app");
      setuploading(false);
      return;
    }
    const formdata = {
      job_id: job_id,
      shopowner_id: ownerdetail,
      deliverystatus: deliverystatus,
      replymessage: replymessage,
    };
 
    try {
      const response = await axios.post(
        "https://server.direckt.site/shopowner/createjobreply",
        formdata
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setuploading(false);
      setreplymessage('');
      setdeliverystatus(false);
      setModalVisible(!modalVisible);
    }  catch (error) {
      if (error.response) {
    
        if (error.response.status === 429) {
            const newtoken = await createnewauthtokenForShopowner(email);
         
            if(newtoken){
              await SecureStore.setItemAsync("shopownertoken",newtoken);
              createreply();
               
            }
            else{
              navigation.replace('Home')
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
      setuploading(false);
    }
  };
  const lang = useSelector(
    (state) => state.appLanguage.language
  );
  const [expanded, setExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View>
    <View>
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
            <Text style={styles.modalText}>Job Reply Sent !</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable style={styles.job} onPress={toggleExpand}>
        <View style={styles.jobCard}>
          <View style={{ width: "100%" }}>
            <View style={styles.jobCardTop}>
              <View
                style={[styles.jobDetails, item.image_url ? { width: "65%" } : {}]}
              >
                <Text style={styles.jobTitle} numberOfLines={1}>
                  {item.jobtitle}
                </Text>
                <Text style={styles.jobDescription} numberOfLines={2}>
                  {item.jobdescription}
                </Text>
                <Text style={styles.expireTime}>
                  <Feather name="calendar" size={11} color="#444444" />{" "}
                 {strings[`${lang}`].expire+" "+localDateTime}
                </Text>
              </View>
              {item.image_url &&
                <TouchableOpacity style={[styles.jobImage]}
                  onPress={() => setShowPopup(true)}
                >
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.image_url,
                    }}
                  />
                </TouchableOpacity>
              }
              {showPopup && item.image_url ? (
                <ImagePopup
                  imageUrl={item.image_url}
                  onClose={() => setShowPopup(false)}
                />
              ) : (
                <></>
              )}
            </View>
            <View style={styles.jobCardBottom}>
              <View style={styles.editJob}>
                <Text style={{ color: COLORS.primary }}>
                  {item.category}
                </Text>
              </View>
              <View style={styles.viewResponse}>

                <View>
                  <Text style={{ color: "white" }}>{strings[`${lang}`].viewdetail}</Text>
                </View>
              </View>

            </View>
          </View>
        </View>
      </Pressable>
    </View>
    {showPopup && item.image_url ? (
      <ImagePopup
        imageUrl={item.image_url}
        onClose={() => setShowPopup(false)}
      />
    ) : <></>}
    {expanded && (
      <View style={styles.jobdetailcontainer}>
        <View style={styles.detailcard}>
          <View>
            <View>
              <Text style={styles.detailtitle}>{strings[`${lang}`].Tasktitle}</Text>
              <Text>{item.jobtitle}</Text>
            </View>
            <View>
              <Text style={styles.detailtitle}>{strings[`${lang}`].TaskDescription}</Text>
              <Text>{item.jobdescription}</Text>
            </View>
            <View>
              <Text style={styles.detailtitle}>{strings[`${lang}`].location}</Text>
              <Text>{item.location}</Text>
            </View>
          </View>
        </View>
        <View style={styles.jobresponsesection}>
          <View
            style={{
              width: "100%",
              gap: 30,
            }}
          >
            <View>
              <Text style={{ color: "grey", paddingBottom: 10 }}>
              {strings[`${lang}`].ReplyMessage}
              </Text>
              <TextInput
                style={styles.replyinput}
                multiline={true}
                maxLength={125}
                textAlignVertical="top"
                numberOfLines={5}
                value={replymessage}
                onChangeText={(val) => {
                  setreplymessage(val);
                }}
                placeholder={strings[`${lang}`].Describe}
              />
            </View>
            <View
              style={{ flexDirection: "row", alignContent: "center", justifyContent: 'flex-start', gap: (width * 20) / 100 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  columnGap: 10,

                }}
              >
                <Text style={{ color: "grey" }}>{strings[`${lang}`].Deliveryoption}</Text>
                <Checkbox
                  value={deliverystatus}
                  onValueChange={() => setdeliverystatus(!deliverystatus)}
                  color={deliverystatus ? "#4630EB" : undefined}
                  style={{ height: 25, width: 25 }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  createreply();
                }}
                style={styles.acceptorder}
              >
                {uploading && (
                  <ActivityIndicator
                    color="white"
                    style={{ height: 10, width: 10 }}
                  />
                )}
                <Text style={{ color: "white" }}>{strings[`${lang}`].Accept}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )}
  </View>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  job: {
    flex: 1,
    height: 165,
    backgroundColor: "white",
    elevation: 1,
    marginTop: 8,
    marginHorizontal: "3%",
    borderRadius: 8,
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
  jobcardsection: {
    flexDirection: 'row',
    alignItems: "center",
  },
  jobImage: {
    width: (width * 35) / 100,
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  jobcategory: {
    paddingVertical: 5,
  },
  jobdetails: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    width: (width * 65) / 100,
    gap: 10,
    padding: 7,
  },
  jobsection: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    marginRight: 5,
    height: "100%",
    width: "40%",
  },
  jobtitle: {
    fontSize: 18,
    fontWeight: "medium",
    color: COLORS.primary
  },
  jobdes: {
    fontSize: 13,
    color: "grey",
  },
  jobowner: {
    color: "green",
    textDecorationLine: "underline",
  },
  viewdetails: {
    padding: 4,
    backgroundColor: "#f4f5fb",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  jobdetailcontainer: {
    backgroundColor: "#ffff",
    marginVertical: "1%",
    marginHorizontal: "3%",
    borderRadius: (width * 3) / 100,
    padding: 10,
  },
  detailcard: {
    paddingHorizontal: 20,
    borderColor: "#cad0dc",
    borderRadius: 15,
    borderWidth: 0.5,
    paddingVertical: 20,
  },
  detailtitle: {
    fontSize: 17,
    paddingVertical: 10,
    color: "grey",
  },
  jobimageviewer: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  imagebtn: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 2,
  },
  jobresponsesection: {
    padding: 10,
    flexDirection: "column",
  },
  replyinput: {
    borderColor: "#cad0dc",
    borderRadius: 3,
    borderWidth: 0.9,
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 8
  },
  acceptorder: {
    flexDirection: "row",
    backgroundColor: "#4daa57",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: "30%",
    gap: 10
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
    paddingHorizontal: 60,
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
    fontSize: 17,
  },
  jobCard: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    position: "absolute",
  },
  jobCardTop: {
    flexDirection: "row",
    height: "65%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  jobDetails: {
    justifyContent: "space-evenly",
  },
  jobTitle: {
    fontSize: 20,
    color: "#8C52FF",
  },
  jobDescription: {
    fontSize: 14,
  },
  expireTime: {
    color: "#444444",
    fontSize: 11,
  },
  jobImage: {
    width: "35%",
    padding: 5,
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 3,
  },
  jobCardBottom: {
    flexDirection: "row",
    height: "35%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  editJob: {
    padding: 8,
    height: 38,
    width: "40%",
    borderRadius: 6,
    alignItems: "center",
  },
  viewResponse: {
    backgroundColor: COLORS.primary,
    padding: 8,

    height: 38,
    width: "40%",
    borderWidth: 2,
    borderColor: "#8C52FF",
    borderRadius: 5,
    alignItems: "center",
  },
});