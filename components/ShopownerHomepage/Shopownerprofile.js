import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Dimensions, Image, Linking, Alert, Pressable } from 'react-native'
import { FontAwesome5, AntDesign, MaterialCommunityIcons,MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { React, useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const height = Dimensions.get("window").height
const width = Dimensions.get("window").width

const Shopownerprofile  = () => {
  const navigation = useNavigation();
  const [businessname, setbusinessname] = useState();
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
  const [availabilitystatus,setavailabilitystatus]=useState(Boolean);
  const[deliverystatus,setdeliverystatus]= useState(Boolean)
    const [shopownerId,setshopownerId] = useState(null);
    const isFocused = useIsFocused();
    const updatedeliveryStatusInAsyncStorage = async (deliverystatus) => {
      try {
        // Retrieve the existing data from AsyncStorage
        const existingData = await AsyncStorage.getItem('shopownerdata');
    
        // Parse the existing data or use an initial object if it doesn't exist
        const parsedData = existingData ? JSON.parse(existingData) : {};
    
        // Update the availability status in the parsed data
        parsedData.deliverystatus = deliverystatus;
    
        // Save the updated data back to AsyncStorage
        await AsyncStorage.setItem('shopownerdata', JSON.stringify(parsedData));
        

      } catch (error) {
        console.error(error);
      }
    };
     
  const removeData = async () => {
      try {
     
        await AsyncStorage.removeItem("shopownerdata");
        navigation.navigate("Home");
        console.log("Data removed successfully");
      } catch (error) {
        console.error("Error removing data:", error);
      }
    };
    const delivery = async () => {
      // Show a confirmation alert
      Alert.alert(
        'Confirmation',
        'Do you want to change the delivery status?',
        [
          {
            text: 'No',
            onPress: () => console.log('No Pressed'), // Do nothing if 'No' is pressed
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: async () => {
              // Toggle availability status
            console.log("delivery"+deliverystatus)
           
    
             
              const formdata = {
                shopownerId: shopownerId,
                deliverystatus: !deliverystatus
              };
     
              console.log(formdata);
    
              try {
                // Assuming the API request is uncommented
                const response = await axios.put("https://direckt-copy1.onrender.com/shopowner/deliverystatus", formdata);
                if(response){
                updatedeliveryStatusInAsyncStorage(!deliverystatus)
                setdeliverystatus(!deliverystatus)
                }
                console.log(response.data);
              } catch (err) {
                console.error(err);
              }
            }
          }
        ],
        { cancelable: false }
      );
    };
    const updateavailabilityStatusInAsyncStorage = async (availabilitystatus) => {
      try {
        // Retrieve the existing data from AsyncStorage
        const existingData = await AsyncStorage.getItem('shopownerdata');
    
        // Parse the existing data or use an initial object if it doesn't exist
        const parsedData = existingData ? JSON.parse(existingData) : {};
    
        // Update the availability status in the parsed data
        parsedData.availabilitystatus = availabilitystatus;
    
        // Save the updated data back to AsyncStorage
        await AsyncStorage.setItem('shopownerdata', JSON.stringify(parsedData));
        

      } catch (error) {
        console.error(error);
      }
    };
    const availability = async () => {
      // Show a confirmation alert
      Alert.alert(
        'Confirmation',
        'Do you want to change the availability status?',
        [
          {
            text: 'No',
            onPress: () => console.log('No Pressed'), // Do nothing if 'No' is pressed
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: async () => {
              // Toggle availability status
            console.log("availabilitystatus"+availabilitystatus)
           
    
             
              const formdata = {
                shopownerId: shopownerId,
                 availabilitystatus : !availabilitystatus
              };
     
              console.log(formdata);
    
              try {
                // Assuming the API request is uncommented
                const response = await axios.put("https://direckt-copy1.onrender.com/shopowner/availabilitystatus", formdata);
             
                updateavailabilityStatusInAsyncStorage(!availabilitystatus)
                setavailabilitystatus(!availabilitystatus)
                console.log(response.data);
              } catch (err) {
                console.error(err);
              }
            }
          }
        ],
        { cancelable: false }
      );
    };
  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("shopownerdata");

        if (data) {
          const parsedData = JSON.parse(data);
          setshopownerId(parsedData._id)
          console.log("parsedData " + parsedData.businessabout);

          setbusinessname(parsedData.businessname);

          setphonenumber(parsedData.phonenumber.toString());
          console.log("phonenumber: " + phonenumber);
          setbusinessabout(parsedData.businessabout);
          setprofilepic(parsedData.profilepic);
          setphotos(parsedData.photos);
          setlocation(parsedData.location);
          setcategory(parsedData.category);
          setgmaplink(parsedData.gmaplink);
          setaddress(parsedData.address);
          setdeliverylocation(parsedData.deliverylocation);
          setshopownerId(parsedData._id)
          setavailabilitystatus(parsedData.availabilitystatus)
          setdeliverystatus(parsedData.deliverystatus)
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [isFocused]);

  const [storestate, setStorestate] = useState(true);
  const [deliverystate, setDeliverystate] = useState(true);
  const shopPhotos = [
    "Photo"
  ]
  const selectedItems = [
    "vallioor",
    "Petharangapuram",
    "Tirunelveli"
  ]
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={
          require('../../assets/icon.png')
        }
        style={styles.headercontainer}>
        <View style={styles.profilecontainer}>
          {profilepic&&
          <Image style={styles.headerprofileImage}
            source={{ uri: profilepic }}
          />
}
        </View>
      </ImageBackground>
      <View style={styles.bodycontainer}>
        <View >
          <Text style={styles.bodyshopname}>{businessname}</Text>
        </View>
        <View>
          <Text style={styles.bodyshopdescription}>{businessabout}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.editprofile} onPress={()=>{navigation.navigate('EditOwnerProfile')}}>
            <Feather name="edit" size={20} color="black" />
            <Text> Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ctccontainer}>
        <View style={styles.ctccard}>
          <View style={styles.ctcsection}>
            <Pressable
              style={availabilitystatus ? [styles.storestatus, styles.ctcicon] : [styles.storestatusoff, styles.ctcicon]}
              onPress={() => { availability() }}
            >
              {availabilitystatus ? <MaterialCommunityIcons name="store-check" size={42} color="white" /> : <MaterialCommunityIcons name="store-remove" size={42} color="white" />}
            </Pressable>
            {availabilitystatus ? <Text style={{ fontSize: 10 }}>Store: Open</Text> : <Text style={{ fontSize: 10 }}>Store: Closed</Text>}
          </View>
          <View style={styles.ctcsection}>
            <Pressable
              onPress={() => {delivery() }}
              style={deliverystatus ? [styles.ctcdeliverystatus, styles.ctcicon] : [styles.ctcdeliverystatusoff, styles.ctcicon]}
            >
              <MaterialIcons name="delivery-dining" size={42} color="white" />
            </Pressable>
            {deliverystatus ? <Text style={{ fontSize: 10 }}>Delivery: Available</Text> : <Text style={{ fontSize: 10 }}>Delivery: Not Available</Text>}
          </View>
          <View style={styles.ctcsection}>
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Confirmation',
                  'Are you sure you want to google maps?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'open', onPress: () => Linking.openURL(gmaplink) },
                  ],
                  { cancelable: false }
                )
              }}
              style={[styles.ctcicon, styles.ctcdirection]}
            >
              <FontAwesome5 name="directions" size={42} color="#5271FF" />
            </Pressable>
            <Text style={{ fontSize: 10 }}>google maps</Text>
          </View>
        </View>
      </View>
      <View style={styles.otherdetails}>
        <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Location</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue} numberOfLines={1}>{location}</Text>
          </View>
        </View>
        <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Address</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue} numberOfLines={2}>{address}</Text>
          </View>
        </View>
        <View style={styles.detailitem}>
          <Text style={styles.deliverylocationtitle}>category</Text>
          <View style={styles.deliverylocationContainer}>
            {category.map((item, index) => (
              <View key={index} style={styles.locations}>
                <Text>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Mobile number</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue}>{phonenumber}</Text>
          </View>
        </View>
        {/* <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Google Map link</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue} numberOfLines={1}>{gmaplink}</Text>
          </View>
        </View>
        <View></View> */}
      </View>
      <View style={styles.shopImages}>
        <Text style={styles.heading}>Photos</Text>
        <ScrollView style={styles.imagecontainer} horizontal={true}>
          {
            photos.map((item , index) => {
              return (
                <View key={index}>
                <Image
                style={styles.card}
                 source={{ uri: item }}
               />
               </View>
              )
            })
          }
          {/* {shopPhotos.length<5?<View style={styles.addimagecard}><MaterialIcons name="add-photo-alternate" size={24} color="grey" /></View>:<></>} */}
          {/* {shopPhotos.length < 5 ? <View style={styles.addimagecard}><Text>No Image</Text></View> : <></>} */}
        </ScrollView>
      </View>
      <View style={styles.bodyfooter}>
        <View>
          <Text style={styles.footertitle}>How to use DirecKT</Text>
        </View>
        <View style={styles.sociallinks}>
          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}
            style={styles.iconContainer}>
            <Entypo name="instagram" size={38} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://whatsapp.com')}
            style={styles.iconContainer}>
            <FontAwesome5 name="whatsapp" size={40} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://youtube.com')}
            style={styles.iconContainer}>
            <Entypo name="youtube" size={38} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.aboutlist}>
          <View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Terms_of_service')}
              style={styles.aboutdetails}
            >
              <AntDesign name="exclamationcircleo" size={24} color="black" />
              <Text style={styles.aboutdireckt}>About Direckt</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Terms_of_service')}
              style={styles.aboutdetails}
            >
              <MaterialIcons name="privacy-tip" size={24} color="black" />
              <Text style={styles.pp}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Terms_of_service')}
              style={styles.aboutdetails}
            >
              <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color="black" />
              <Text style={styles.tc}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.aboutdetailslast}
              onPress={()=>{
                Alert.alert(
                  'Confirmation',
                  'Are you sure you want to Logout?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'open', onPress:()=>removeData() },
                  ],
                  { cancelable: false }
                )
            }}
            >
              <MaterialIcons name="logout" size={27} color="red" />
             
              <Text style={[{color:'red'},styles.tc]}>Log out</Text>
            
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Shopownerprofile 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headercontainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: 'center',
    height: (height * 35) / 100,
    padding: 20,
  },
  profilecontainer: {
    flex: 1,
    justifyContent: 'flex-end',
    height: (height * 30) / 100,
  },
  headerprofileImage: {
    height: (height * 15) / 100,
    width: (width * 32) / 100,
    borderRadius: (width * 20) / 100,
    borderWidth: 2,
    borderColor: 'white',
  },
  bodycontainer: {
    flex: 1,
    shadowOffset: {
      height: 2,
      width: 2
    },
    justifyContent: 'space-evenly',
    shadowColor: "black",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // backgroundColor: "white",
    height: (height * 25) / 100,
    paddingHorizontal: 25,
    marginTop: -10,
  },
  bodyshopname: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bodyshopdescription: {
    textAlign: 'center',
    color: 'grey',
  },
  imagecontainer: {
    flex: 1,
    flexDirection: 'row',
  },
  editprofile: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: (width * 3) / 100,
    padding: 10,
  },
  ctccontainer: {
    flex: 1,
    height: (height * 16) / 100,
    paddingHorizontal: '4%',
  },
  ctccard: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: (height * 20) / 100,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 3,
    paddingHorizontal: 18,
  },
  ctcsection: {
    width: '33%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctcicon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: (height * 18) / 100,
    width: (width * 18) / 100,
    marginBottom: 3,
    borderRadius: 40,
  },
  storestatus: {
    borderColor: '#00BF63',
    backgroundColor: '#06A659',
    borderWidth: 1,
  },
  storestatusoff: {
    borderColor: 'red',
    backgroundColor: 'red',
    borderWidth: 1,
  },
  ctcdeliverystatus: {
    borderColor: '#06A659',
    backgroundColor: '#06A659',
    borderWidth: 2,
  },
  ctcdeliverystatusoff: {
    borderColor: 'red',
    backgroundColor: 'red',
    borderWidth: 2,
  },
  ctcdirection: {
    borderColor: '#5271FF',
    borderWidth: 2,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    margin: 4,
   
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowColor: "grey",
    backgroundColor: "red",
  },
  addimagecard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dotted',
    margin: 4,
    shadowOffset: {
      width: 1,
      height: 1
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
    fontWeight: 'medium',
  },
  otherdetails: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  detailitem: {
    paddingVertical: 5,
  },
  deliverylocationtitle: {
    padding: 10,
    fontWeight: 'medium',
  },
  deliverylocationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  locations: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  shopdetailstitle: {
    padding: 10,
    fontWeight: 'medium',
  },
  shopdetailsbox: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  shopdetailsvalue: {
    fontSize: 15,
  },
  bodyfooter: {
    flex:1,
    padding: 20,
  },
  footertitle: {
    fontSize: 18,
  },
  sociallinks: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-evenly",
  },
  aboutlist: {
    height: (height * 30) / 100,
    justifyContent: 'space-evenly',
  },
  aboutdetails: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  aboutdetailslast: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  aboutdireckt: {
    paddingHorizontal: 20,
  },
  pp: {
    paddingHorizontal: 20,
  },
  tc: {
    paddingHorizontal: 20,
  }

})
// import { View, Text, Button, Touchable } from 'react-native'
// import React from 'react'
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

// const Shopownerprofile = () => {
  
//   return (
//     <View>
     
//     </View>
//   )
// }

// export default Shopownerprofile
 // const navigation = useNavigation();
  // const removeData = async () => {
  //     try {
     
  //       await AsyncStorage.removeItem("shopownerdata");
  //       navigation.navigate("Home");
  //       console.log("Data removed successfully");
  //     } catch (error) {
  //       console.error("Error removing data:", error);
  //     }
  //   };
  {/* <Text>Shopownerprofile</Text>
      <TouchableOpacity onPress={()=>{
           navigation.navigate('EditOwnerProfile');
      }}><Text>Editprofile</Text></TouchableOpacity>
      <Button title='log out' onPress={removeData}/> */}