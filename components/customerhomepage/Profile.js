import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Alert,
  useColorScheme,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { React, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants/Theme";
import axios from "axios";
import { clearCustomerToken } from "../../redux/customerAuthActions";
const height = Dimensions.get("window").height;
import { FontAwesome } from '@expo/vector-icons';
import { changeLanguage } from "../../redux/LanguageAction";
import { strings } from "../../locals/translations";
import setCustomerToken from '../RefreshSession/RefreshSession'



const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [token, settoken] = useState(null);
  const [indicator, setindicator] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const customertoken = useSelector(
    (state) => state.customerAuth.customertoken
  );

  const lang =useSelector(
    (state) => state.appLanguage.language
  );

  let currentlang = lang

  const [customerdata, setCustomerData] = useState(null);
  const data = [
    {
      id: 1,
      title: strings[`${lang}`].whatdireckt,
      content:
        strings[`${lang}`].direcktans,
    },
    {
      id: 2,
      title: strings[`${lang}`].paymoneyq,
      content:
      strings[`${lang}`].paymoneyans,
    },
    {
      id: 3,
      title: strings[`${lang}`].whathappensq,
      content:
      strings[`${lang}`].whathappensans
    },
    {
      id: 4,
      title: strings[`${lang}`].whatdel,
      content:
      strings[`${lang}`].whatdelans,
    },
    {
      id: 5,
      title: strings[`${lang}`].isdirecktresq,
      content:
      strings[`${lang}`].isdirecktresans,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTextIndicator, setFeedbackTextindicator] = useState(false);
  const handleFeedbackSubmit = async () => {
    if (feedbackText.length === 0) {
      showToast('feedback is empty')
      return;
    }
    try {
      setFeedbackTextindicator(true)
      const response = await axios.post('https://direckt-copy1.onrender.com/direckt/customerfeedback', { feedback: feedbackText });//check for usertoken
      showToast('Thanks for your feedback!');
      setFeedbackText('')
      setFeedbackTextindicator(false)

    } catch (error) {

      setFeedbackTextindicator(false)
      if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
          // Response received with an error status code
          showToast("Feedback failed");
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {

        showToast("An error occurred. Please try again. logout and resign in");
      }

    }
  };

  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  const toggleItem = (index) => {
    if (currentIndex === index) {
      setCurrentIndex(null);
    } else {
      setCurrentIndex(index);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("customerdata");

        if (data) {
          const parsedData = JSON.parse(data);
          setCustomerData(parsedData);
        }
        SecureStore.getItemAsync("customertoken")
          .then((value) => {

            settoken(value);
          })
          .catch((error) => { });

      } catch (err) {

      }
    };

    fetchData();
  }, [customertoken]);
  const removeData = async () => {
    const formdata = {
      email: customerdata.email
    }
    try {
      setindicator(true);
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/customerlogout",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(clearCustomerToken());
      await SecureStore.deleteItemAsync("customertoken");
      await SecureStore.deleteItemAsync('refreshToken');

      await AsyncStorage.removeItem("customerdata");
      setindicator(false);
      navigation.navigate("Home");

    } catch (error) {
      if(error.response.status === 429){

        const newtoken = await createnewauthtoken(email)
       
        if(newtoken){
          await SecureStore.setItemAsync('customertoken',newtoken);
          dispatch(setCustomerToken(newtoken))
        }
        else{
          navigation.replace('Home')
        }
      }
      else if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
          // Response received with an error status code

          await SecureStore.deleteItemAsync("customertoken");

          await AsyncStorage.removeItem("customerdata");
          navigation.navigate("Home");
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {
        // Non-Axios error
        await SecureStore.deleteItemAsync("customertoken");

        await AsyncStorage.removeItem("customerdata");
        navigation.navigate("Home");

      }
    }
    finally{
      setindicator(false);
    }
  };
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            removeData();


          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlelanguage = async (e) => {
    if (currentlang === e) {
      return ;
    }
    currentlang = e
    await SecureStore.setItemAsync('language', e); 
    dispatch(changeLanguage(e))
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.chooselang}>Choose language</Text>
            <View style={styles.langlist}>
              <TouchableOpacity style={styles.langitem} onPress={()=>handlelanguage('en')}>
                <MaterialIcons name={`radio-button-${currentlang==="en"?"on":"off"}`} size={24} color="black" />
                <Text>English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langitem}  onPress={()=>handlelanguage('ta')}>
                <MaterialIcons name={`radio-button-${currentlang==="ta"?"on":"off"}`} size={24} color="black" />
                <Text>தமிழ்</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.changelangbtn}>
              <Text style={{ color: 'white' }}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView style={styles.container}>
        <View style={styles.bodycontainer}>
          <View
            style={{
              width: "100%",
              height: 60,
              paddingRight: 10,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {indicator ? (<View>
              <ActivityIndicator color={"red"} size={40} />
            </View>) : <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={handleLogout}
            >
              <Text style={styles.logout}>{strings[`${lang}`].logout}</Text>
              <MaterialIcons name="logout" size={24} color="red" />
            </TouchableOpacity>}
          </View>
          <View style={styles.userdetails}>
            <View>
              <Text style={styles.bodyusername}>
                {customerdata ? "@ " + customerdata.name : null}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="email" size={25} color="black" />
              <Text style={styles.bodyemail}>
                {customerdata ? customerdata.email : null}
              </Text>
            </View>
          </View>
          <View style={styles.faq}>
            <Text style={styles.faqtitle}>{strings[`${lang}`].faq}</Text>
            <ScrollView style={styles.faqcontainer}>
              {data.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  index={index}
                  title={item.title}
                  content={item.content}
                  currentIndex={currentIndex}
                  toggleItem={toggleItem}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.bodyfooter}>

            <View style={styles.aboutlist}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://mageshkrishna.github.io/DirecktAbout/index"
                    )
                  }
                  style={styles.aboutdetails}
                >
                  <AntDesign
                    name="exclamationcircleo"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.aboutdireckt}>{strings[`${lang}`].aboutdireckt}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.aboutdetails}
                >
                  <FontAwesome name="language" size={24} color="black" />
                  <Text style={styles.aboutdireckt}>{strings[`${lang}`].changelanguage}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://elamparithi07.github.io/Direcktterms/index1.html"
                    )
                  }
                  style={styles.aboutdetails}
                >
                  <MaterialIcons name="privacy-tip" size={24} color="black" />
                  <Text style={styles.pp}>{strings[`${lang}`].pp}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://elamparithi07.github.io/Direcktterms/index.html"
                    )
                  }
                  style={styles.aboutdetails}
                >
                  <MaterialCommunityIcons
                    name="file-document-multiple-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.tc}>{strings[`${lang}`].tandc}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      strings[`${lang}`].deleteacc,
                      strings[`${lang}`].delconfirm,
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: strings[`${lang}`].delete,
                          onPress: () => {
                            navigation.navigate("CustomerAccountDelete", { email: customerdata.email });
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                  }
                  style={styles.aboutdetailslast}
                >
                  <AntDesign name="delete" size={24} color="red" />
                  <Text style={styles.deletaccount}>{strings[`${lang}`].deleteacc}</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <View
            style={{ height: 200, width: "100%", flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 10, paddingLeft: 15 }}
          >
            <Text>{strings[`${lang}`].feedback}</Text>
            <TextInput
              style={{
                flex: 1,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                width: '100%',
                borderRadius: 5
              }}
              multiline
              numberOfLines={4}
              placeholder={strings[`${lang}`].typefeedback}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, flexDirection: 'row', alignItems: 'center' }} onPress={handleFeedbackSubmit}><Text style={{ fontSize: 18, color: '#fff' }}>{strings[`${lang}`].submit}</Text>{feedbackTextIndicator && <ActivityIndicator size={18} color={'#fff'} />}</TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const AccordionItem = ({ title, content, index, currentIndex, toggleItem }) => {
  const colorScheme = useColorScheme();
  const isExpanded = index === currentIndex;

  return (
    <View>
      <TouchableOpacity onPress={() => toggleItem(index)}>
        <View style={styles.faqQuestion}>
          <Text style={{ color: "grey" }}>{title}</Text>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={{ color: "black" }}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headercontainer: {
    justifyContent: "space-between",
    height: (height * 30) / 100,
    padding: 30,
    justifyContent: "flex-end",
  },
  headername: {
    color: "black",
    fontWeight: "medium",
    fontSize: 40,
  },
  bodycontainer: {
    flex: 1,
    elevation: 8,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowColor: "black",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    padding: 30,
    marginTop: -10,
  },
  userdetails: {
    height: (height * 20) / 100,
    justifyContent: "space-evenly",
  },
  bodyusername: {
    fontSize: 25,
  },
  bodyemail: {
    fontSize: 18,
    paddingLeft: 5,
  },
  faq: {
    flex: 1,
    paddingVertical: 15,
  },
  faqcontainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  faqQuestion: {
    paddingHorizontal: "3%",
    paddingVertical: "9%",
  },
  faqAnswer: {
    paddingHorizontal: "4%",
    paddingVertical: "1%",
  },
  bodyfooter: {
    height: (height * 35) / 100,
    marginBottom: 20,
  },
  footertitle: {
    fontSize: 18,
  },
  sociallinks: {
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  aboutlist: {
    height: (height * 35) / 100,
    justifyContent: "space-evenly",
    gap: 10,
    marginBottom: 10,
  },
  aboutdetails: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  aboutdetailslast: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  aboutdireckt: {
    paddingHorizontal: 20,
  },
  pp: {
    paddingHorizontal: 20,
  },
  tc: {
    paddingHorizontal: 20,
  },
  logout: {
    color: "red",
    fontSize: 15,
  },
  deletaccount: {
    color: "red",
    paddingHorizontal: 20,
  },
  box3signin: {
    color: "white",
    fontSize: 23,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-evenly',
    padding: 40,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 10,
  },
  chooselang: {
    fontSize: 19,
  },
  langitem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  changelangbtn: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 13,
    borderRadius: 10,
    width: 70,
  },
  langlist: {
    height: 100,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
});
