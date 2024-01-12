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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { React, useEffect, useState } from "react";
import axios from "axios";
import Imagepicker from "./Imagepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/Theme";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const EditOwnerProfile = () => {
  const navigation = useNavigation();
  const [businessname, setbusinessname] = useState("Anbu Stores");
  const [businessabout, setbusinessabout] = useState("Vallioor");
  const [phonenumber, setphonenumber] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const [photos, setphotos] = useState([]);
  const [gmaplink, setgmaplink] = useState(
    "https://www.google.com/maps/place/Sri+Eshwar+College+of+Engineering,+Coimbatore/@10.827908,77.0579419,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba84ee37569ae7f:0x3c5b1824b6e79192!8m2!3d10.827908!4d77.0605168!16s%2Fg%2F1tdyp6pq?entry=ttu"
  );
  const [address, setaddress] = useState(
    "Store description will be written here for the betterment of the design"
  );
  const [deliverylocation, setdeliverylocation] = useState();
  const [location, setlocation] = useState("");
  const [category, setcategory] = useState([]);
  const[category2,setcategory2]=useState([]);
  const [shopownerId, setshopownerId] = useState(null);
  const [shopownerdata, setshopownerdata] = useState(null);
  const editprofile = true;
  const addphoto = true;

  const [isButtonDisabled, setButtonDisabled] = useState(false);
    const[uploading,setuploading] = useState(false)
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
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Confirm',
        'Are you sure you want to go back?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
             navigation.navigate('Shopownerprofile')
            },
          },
        ],
        { cancelable: true }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("shopownerdata");

        if (data) {
          const parsedData = JSON.parse(data);

          console.log("parsedData " + parsedData.businessabout);

          setbusinessname(parsedData.businessname);

          setphonenumber(parsedData.phonenumber.toString());
          console.log("phonenumber: " + phonenumber);
          setbusinessabout(parsedData.businessabout);
          setprofilepic(parsedData.profilepic);
          setphotos(parsedData.photos);
          setlocation(parsedData.location);
          setcategory2(parsedData.category);
          setgmaplink(parsedData.gmaplink);
          setaddress(parsedData.address);
          setdeliverylocation(parsedData.deliverylocation);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const updateshopowner = async () => {
    console.log(category2)
     setuploading(true)
    const formdata = {
      shopownerId: "6592f8fa24522066101b3950",
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
    };
    console.log("formdata" + formdata);
    try {
      const updateuser = await axios.put(
        `https://direckt-copy1.onrender.com/shopowner/editshopowner`,
        formdata
      );
      if (updateuser.data && updateuser.data._id) {
        console.log(updateuser.data);
        await AsyncStorage.setItem(
          "shopownerdata",
          JSON.stringify(updateuser.data)
        );
        console.log("AsyncStorage updated successfully");
      } else {
        console.warn("Received invalid or undefined data from the server");
      }
      const local = await AsyncStorage.setItem(
        "shopownerdata",
        JSON.stringify(updateuser.data)
      );
      setuploading(false)
      navigation.navigate('Shopownerprofile');
    } catch (e) {
      setuploading(false)
      console.log(e);
    }
  };

  const shopPhotos = ["Photo", "only", "upto", "5", "No more"];

  const locations = [{key : '1', value: "Vallioor" }];

  const categories = [
    { key: "1", value: "electronic" },
    { key: "2", value: "plumbing" },
    { key: "3", value: "Computers" },
  ];
   




  return (
    <ScrollView style={styles.container}>
      <View style={styles.pagenavigation}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleButtonPress} disabled={isButtonDisabled} >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.pagenavigationtitle}>Edit Profile</Text>
        </View>
        <View>
          {uploading?<ActivityIndicator size='medium' color='purple'/>:
          <TouchableOpacity onPress={updateshopowner}>
            <Text style={styles.editpagesave}>Save</Text>
          </TouchableOpacity>
}
        </View>
      </View>
      <Imagepicker
        editprofile={editprofile}
        setprofilepic={setprofilepic}
        profilepic={profilepic}
      />
      <View style={styles.editdetailscontainer}>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Name</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setbusinessname(e)}
            value={businessname}
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>description</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setbusinessabout(e)}
            value={businessabout}
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Location</Text>
          <SelectList
  setSelected={(val) => setlocation(val)}
  data={locations}
  save="value"
  style={styles.storelocationselect}
  defaultOption={{ key:'2', value:'Vallioor' }}  
/>


        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Address</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setaddress(e)}
            value={address}
          />
        </View>

        <View style={styles.editfield} >
          <Text style={styles.editstorenamelabel}>category</Text>

          <MultipleSelectList
            setSelected={(val) => setcategory(val)}
            data={categories}
            save="value"
            
            
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>
            Delivery locations or Servicable location{" "}
          </Text>
          <TextInput
          
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
          />
        </View>
        <View style={styles.editfield}>
          <Text style={styles.editstorenamelabel}>Google Map</Text>
          <TextInput
            style={styles.editstorenameinput}
            onChangeText={(e) => setgmaplink(e)}
            value={gmaplink}
          />
        </View>
      </View>
      <View style={styles.shopImages}>
        <Text style={styles.heading}>Photos</Text>
        <ScrollView style={styles.imagecontainer} horizontal={true}>
          {photos.map((item, index) => {
            return (
              <View key={index} >
                <Image
             style={styles.card}
              source={{ uri: item }}
            />
              </View>
            );
          })}
          {photos.length < 5 ? (
            <Imagepicker addphoto={addphoto} setphotos={setphotos} />
          ) : (
            <></>
          )}
          {/* {shopPho tos.length < 5 ? <View style={styles.addimagecard}><Text>No Image</Text></View> : <></>} */}
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
    borderColor:COLORS.gray
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
    height: (height * 25) / 100,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  heading: {
    padding: 10,
    fontWeight: "medium",
  },
});
