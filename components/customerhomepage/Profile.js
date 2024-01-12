import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking, LayoutAnimation, UIManager, SafeAreaView, Alert } from 'react-native'
import { MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { Feather, AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { React, useEffect, useState } from 'react'

import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const height = Dimensions.get("window").height
const width = Dimensions.get("window").width

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
         
const Profile = () => {
    const navigation = useNavigation() 
    const [customerdata, setCustomerData] = useState(null);
    const data = [
        { title: 'How to create a thread?', content: "To ensure that only one item expands at a time, you can maintain the index of the currently expanded item " },
        { title: 'Why DirecKT?', content: 'To ensure that only one item expands at a time, you can maintain the index of the currently expanded item ' },
        { title: 'How does DirecKT work?', content: 'To ensure that only one item expands at a time, you can maintain the index of the currently expanded item ' },
        { title: 'is Support Available?', content: 'To ensure that only one item expands at a time, you can maintain the index of the currently expanded item ' },
        { title: 'is direcKT Commission free?', content: 'To ensure that only one item expands at a time, you can maintain the index of the currently expanded item ' },
    ];

    const [currentIndex, setCurrentIndex] = useState(null);

    const toggleItem = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      
            console.log(customerdata); 
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchData();
      
      },[]); 
      const removeData = async () => {
        try {
          // Remove data
          await AsyncStorage.removeItem("customerdata");
          navigation.navigate("Home");
          console.log("Data removed successfully");
        } catch (error) {
          console.error("Error removing data:", error);
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
    
                console.log("Logging out...");
              },
            },
          ],
          { cancelable: false }
        );
      };
    return (
        <SafeAreaView style={{flex:1}}>
        <ScrollView
            style={styles.container}>
            <ImageBackground
                source={{
                    uri:'https://img.freepik.com/free-vector/gradient-smooth-background_23-2148969006.jpg?size=626&ext=jpg'
                }}
                style={styles.headercontainer}>
                <View style={styles.headercontainertop}>
                   
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={handleLogout} >
                        <Text style={styles.logout}>Log out </Text>
                        <MaterialIcons name="logout" size={24} color="black" />
                        </TouchableOpacity>
                 
                </View>
                <View >
                <Text style={styles.headername}>{customerdata ? customerdata.name :null}</Text>
                </View>
            </ImageBackground>
            <View style={styles.bodycontainer}>
                <View style={styles.userdetails}>
                    <View>
                        <Text style={styles.bodyusername}>{customerdata ? "@"+customerdata.name :null}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialIcons name="email" size={20} color="black" style={{paddingTop:4}} />
                        <Text style={styles.bodyemail}>{customerdata ? customerdata.email :null}</Text>
                    </View>
                    <View>
                        {/* <Text style={styles.bodythreadscount}>Threads created* ( 4/5 )</Text> */}
                        <TouchableOpacity style={styles.editprofile}>
                            <Feather name="edit" size={20} color="black" />
                            <Text> Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.faq}>
                    <Text style={styles.faqtitle}>Frequently Asked Questions</Text>
                    <ScrollView style={styles.threadcontainer}>
                        {data.map((item, index) => (
                            <AccordionItem
                                key={index}
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
                                style={styles.aboutdetailslast}
                            >
                                <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color="black" />
                                <Text style={styles.tc}>Terms & Conditions</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    )
}

const AccordionItem = ({ title, content, index, currentIndex, toggleItem }) => {
    const isExpanded = index === currentIndex;

    return (
        <View>
            <TouchableOpacity onPress={() => toggleItem(index)}>
                <View style={styles.faqQuestion}>
                    <Text style={{color:'grey'}}>{title}</Text>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.faqAnswer}>
                    <Text>{content}</Text>
                </View>
            )}
        </View>
    );
};


export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: (height * 100) / 100,
    },
    headercontainer: {
        flex: 1,
        justifyContent: "space-between",
        height: (height * 40) / 100,
        padding: 30,
    },
    headercontainertop: {
        flex: 1,
        alignItems: "flex-end",
        fontSize: 30,
    },
    logout: {
        fontSize: 20,
    },
    headername: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 40,
    },
    logoutimage: {

    },
    bodycontainer: {
        flex: 1,
        elevation: 8,
        shadowOffset: {
            height: 2,
            width: 2
        },
        shadowColor: "black",
        borderRadius: 15,
        backgroundColor: "white",
        padding: 30,
        marginTop: -10,
    },
    userdetails: {
        height: (height * 20) / 100,
        justifyContent: 'space-between'
    },
    bodyusername: {
        fontSize: 25,
    },
    bodyemail: {
        fontSize: 18,
        paddingLeft:7
    },
    bodythreadscount: {
        fontSize: 18,
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
    list: {
        backgroundColor: 'white',
    },
    faq:{
        paddingVertical:30,
    },
    threadcontainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical:20,
    },
    faqQuestion: {
        paddingHorizontal: '3%',
        paddingVertical:'9%',
    },
    faqAnswer:{
        paddingHorizontal: '4%',
        paddingVertical:'1%',
    },
    bodyfooter: {
        height: (height * 44) / 100,
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
    aboutdetailslast:{
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