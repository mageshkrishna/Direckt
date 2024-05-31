import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import {createnewauthtokenForShopowner} from '../RefreshSession/RefreshSession'
import { React, useEffect, useState } from "react";
import axios from "axios";
import Imagepicker from "./Imagepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/Theme";
import ProfilePicker from "./Profilepicker";
import { useDispatch } from "react-redux";
import { setShopOwnerToken } from "../../redux/shopOwnerAuthActions";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const EditOwnerProfile = () => {
  const navigation = useNavigation();
  const [businessname, setbusinessname] = useState("");
  const [businessabout, setbusinessabout] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const [photos, setphotos] = useState([]);
  const [gmaplink, setgmaplink] = useState("");
  const [address, setaddress] = useState("");
  const [deliverylocation, setdeliverylocation] = useState("");
  const [location, setlocation] = useState("");
  const [category, setcategory] = useState([]);
  const [category2, setcategory2] = useState([]);
  const [shopownerId, setshopownerId] = useState(null);
  const [email, setemail] = useState("");
  const addphoto = true;
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [uploading, setuploading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("shopownerdata");
        if (data) {
          const parsedData = JSON.parse(data);
          setemail(parsedData.email);
          setbusinessname(parsedData.businessname);
          setshopownerId(parsedData._id);
          setphonenumber(parsedData.phonenumber.toString());
          setbusinessabout(parsedData.businessabout);
          setprofilepic(parsedData.profilepic);
          setphotos(parsedData.photos);
          setlocation(parsedData.location);
          setcategory2(parsedData.category);
          setgmaplink(parsedData.gmaplink);
          setaddress(parsedData.address);
          setdeliverylocation(parsedData.deliverylocation);
          setshopownerId(parsedData._id);
        }
      } catch (err) {}
    };

    fetchData();
  }, []);

  const handleButtonPress = () => {
    if (!isButtonDisabled) {
      // Disable the button to prevent multiple rapid clicks
      setButtonDisabled(true);

      // Use navigation.goBack() to go back
      navigation.goBack();

      // Enable the button after a delay or when the navigation action is completed
      setTimeout(() => {
        setButtonDisabled(false);
      }, 1000); // Adjust the delay as needed
    }
  };

  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Confirm",
        "Are you sure you want to go back?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              navigation.navigate("Shopownerprofile");
            },
          },
        ],
        { cancelable: true }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  function validateGoogleMapLink(link) {
    var pattern =
      /^(?:https?:\/\/(?:www\.)?google\.com\/maps\/(?:place\/)?(?:[^/]+)\/@(-?\d+\.\d+),(-?\d+\.\d+)(?:,\d+z)?)|(?:https?:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9]+)$/;

    return pattern.test(link);
  }
  const validatePhone = (phone) => {
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phone);
  };
  const updateshopowner = async () => {
    if (gmaplink) {
      if (!validateGoogleMapLink(gmaplink)) {
        showToast("Enter a valid Google map Link");
        return;
      }
    }

    if (!validatePhone(phonenumber)) {
      showToast("Please enter a valid phone number");
      return;
    }
    if (!businessname) {
      showToast("Please enter your business name");
      return;
    }
    if (businessname) {
      if (businessname.trim() === "") {
        showToast("Please enter a valid Business name");
        return;
      }
    }
    if (businessabout) {
      if (businessabout.trim() === "") {
        showToast("Please enter a valid Business about");
        return;
      }
    }
    if (address) {
      if (address.trim() === "") {
        showToast("Please enter a valid address");
        return;
      }
    }
    if (deliverylocation) {
      if (deliverylocation.trim() === "") {
        showToast("Please enter a valid delivery location");
        return;
      }
    }

    const formdata = {
      shopownerId: shopownerId,
      updateFields: {
        businessname: businessname,
        phonenumber: phonenumber,
        businessabout: businessabout,
        profilepic: profilepic,
        photos: photos,
        location: location,
        category: category.length === 0 ? category2 : category,
        gmaplink: gmaplink,
        address: address,
        deliverylocation: deliverylocation,
      },
      email: email,
    };
    const token = await SecureStore.getItemAsync("shopownertoken");
    try {
      setuploading(true);
      const updateuser = await axios.put(
        `https://direckt-copy1.onrender.com/shopowner/editshopowner`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      await AsyncStorage.setItem(
        "shopownerdata",
        JSON.stringify(updateuser.data.data)
      );
      setuploading(false);
      showToast("Profile Updated Successfully!");
      navigation.navigate("Shopownerprofile");
    }  catch (error) {
      if (error.response) {
        console.log(error.response.status); 
        if (error.response.status === 429) {
            const newtoken = await createnewauthtokenForShopowner(email);
            console.log("new token : " + newtoken)
            if(newtoken){
              await SecureStore.setItemAsync('shopownertoken',newtoken);
              dispatch(setShopOwnerToken(newtoken))
              await updateshopowner(); 
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
      setuploading(false);
    }
  };
  const deleteImageFromBackend = async (shopOwnerId, imageUrl) => {
    const formData = new FormData();
    formData.append("_id", shopOwnerId);
    formData.append("imageUrl", imageUrl);
    const token = await SecureStore.getItemAsync("shopownertoken");
    try {
      const response = await axios.post(
        `https://direckt-copy1.onrender.com/shopowner/deletephotoimage`,
        { _id: shopOwnerId, imageUrl }, // Pass formData as the second argument
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      removeImageUrlFromShopOwnerData(imageUrl);
      const updatedPhotos = photos.filter((item) => item !== imageUrl);
      setphotos(updatedPhotos);
    }  catch (error) {
      if (error.response) {
        console.log(error.response.status); 
        if (error.response.status === 429) {
            const newtoken = await createnewauthtokenForShopowner(email);
            console.log("new token : " + newtoken)
            if(newtoken){
              await SecureStore.setItemAsync('shopownertoken',newtoken);
              dispatch(setShopOwnerToken(newtoken))
              await deleteImageFromBackend(shopOwnerId, imageUrl); 
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
      
    }
  };

  const removeImageUrlFromShopOwnerData = async (imageUrl) => {
    try {
      // Retrieve the current shop owner data from AsyncStorage
      const shopOwnerDataString = await AsyncStorage.getItem("shopownerdata");
      if (!shopOwnerDataString) {
        throw new Error("Shop owner data not found in AsyncStorage");
      }

      // Parse the JSON string to get the shop owner data object
      const shopOwnerData = JSON.parse(shopOwnerDataString);

      // Remove the imageUrl from the photos array
      if (shopOwnerData.photos) {
        const updatedPhotos = shopOwnerData.photos.filter(
          (item) => item !== imageUrl
        );
        shopOwnerData.photos = updatedPhotos;
      }

      // Save the updated shop owner data back to AsyncStorage
      await AsyncStorage.setItem(
        "shopownerdata",
        JSON.stringify(shopOwnerData)
      );
    } catch (error) {
      console.error("Error removing image URL from shop owner data:", error);
      throw error;
    }
  };

  const deleteimage = (itemToRemove) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this image?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "delete",
          onPress: () => {
            deleteImage(itemToRemove);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteImage = async (imageUrl) => {
    try {
      // Attempt to delete the image from the backend
    
      const backendDeleteResponse = await deleteImageFromBackend(
        shopownerId,
        imageUrl
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete image from backend");
    }
  };

  const [choosedata, setChooseData] = useState([
    { key: "1", value: "loading...", disabled: true },
  ]);
  useEffect(() => {
    fetchData(); // Fetch choosedata when the component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://direckt-copy1.onrender.com/direckt/getcategory"
      );
      const dataFromBackend = response.data;

      if (Array.isArray(dataFromBackend) && dataFromBackend.length > 0) {
        // Map over the data to convert it into the required format
        const formattedData =
          dataFromBackend[0]?.categories.map((category) => ({
            key: category.key,
            value: category.value,
          })) || [];
        // Update the state with the formatted data
        setChooseData(formattedData);
      } else {
        return;
      }
    } catch (error) {
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

        showToast("An error occurred. Please try again.");
      }
    }
  };

  const [chooselocation, setchooselocation] = useState([
    { key: "1", value: "loading...", disabled: true },
  ]);
  useEffect(() => {
    fetchDatalocation(); // Fetch choosedata when the component mounts
  }, []);

  const fetchDatalocation = async () => {
    try {
      const response = await axios.get(
        "https://direckt-copy1.onrender.com/direckt/getlocations"
      );
      const dataFromBackend = response.data;

      if (Array.isArray(dataFromBackend) && dataFromBackend.length > 0) {
        const formattedData =
          dataFromBackend[0]?.locations.map((location) => ({
            key: location.key,
            value: location.value,
          })) || [];

        setchooselocation(formattedData);
      } else {
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast(`Error: ${error.response.data.error}`);
        } else {
          showToast("Network error. Please check your internet connection.");
        }
      } else {
        showToast("An error occurred. Please try again.");
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pagenavigation}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleButtonPress}
            disabled={isButtonDisabled}
          >
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.pagenavigationtitle}>Edit Profile</Text>
        </View>
        <View>
          {uploading ? (
            <ActivityIndicator size="medium" color="purple" />
          ) : (
            <TouchableOpacity onPress={updateshopowner}>
              <Text style={styles.editpagesave}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ProfilePicker
        profilepic={profilepic}
        setprofilepic={setprofilepic}
        shopOwnerId={shopownerId}
        email={email}
      />
      <View style={styles.editdetailscontainer}>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Name</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setbusinessname(e)}
            value={businessname}
            placeholder="businessname"
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>description</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setbusinessabout(e)}
            value={businessabout}
            placeholder="Tell about your business"
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Location</Text>
          <SelectList
            setSelected={(val) => setlocation(val)}
            data={chooselocation}
            save="value"
            style={styles.storelocationselect}
            closeicon={<AntDesign name="close" size={30} color={COLORS.gray} />}
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Address</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setaddress(e)}
            value={address}
            placeholder="your shop address"
          />
        </View>

        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>category</Text>

          <MultipleSelectList
            setSelected={(val) => setcategory(val)}
            data={choosedata}
            save="value"
            closeicon={<AntDesign name="close" size={30} color={COLORS.gray} />}
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>
            Delivery locations or Servicable location{" "}
          </Text>
          <TextInput
            placeholder="give place names you can able to deliver"
            style={styles.editstorenameinput}
            onChangeText={(e) => setdeliverylocation(e)}
            value={deliverylocation}
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Mobile Number</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(text) => setphonenumber(text)}
            value={phonenumber.toString()}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Google Map</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setgmaplink(e)}
            value={gmaplink}
            placeholder="Your shop google maps  location link"
          />
        </View>
      </View>
      <View style={styles.shopImages}>
        <Text style={styles.heading}>
          Photos ( You can only upload 5 photos )
        </Text>
        <ScrollView style={styles.imagecontainer} horizontal={true}>
          {photos.map((item, index) => {
            return (
              <View key={index}>
                <Image style={styles.card} source={{ uri: item }} />
                <TouchableOpacity onPress={() => deleteimage(item)}>
                  <Text style={{ textAlign: "center", color: "red" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {photos.length < 5 ? (
            <Imagepicker
              addphoto={addphoto}
              setphotos={setphotos}
              shopOwnerId={shopownerId}
              email={email}
            />
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default EditOwnerProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagenavigation: {
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pagenavigationtitle: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  editpagesave: {
    fontSize: 17,
  },
  editprofileimagecontainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  editprofileImage: {
    height: (height * 15) / 100,
    width: (width * 32) / 100,
    borderRadius: (width * 20) / 100,
    borderWidth: 2,
  },
  editprofileImagetitle: {
    color: "blue",
    paddingVertical: 15,
  },
  editdetailscontainer: {
    paddingHorizontal: 20,
  },
  editstorenamelabel: {
    color: "gray",
    paddingBottom: 5,
  },
  editstorenameinput: {
    padding: 10,
    fontSize: 15,
    borderBottomWidth: 0.9,
    borderColor: COLORS.gray,
  },
  editfield: {
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    margin: 4,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "grey",
    backgroundColor: "red",
  },
  addimagecard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dotted",
    margin: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "grey",
  },
  shopImages: {
    height: (height * 26) / 100,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  heading: {
    padding: 10,
    fontWeight: "medium",
  },
});
