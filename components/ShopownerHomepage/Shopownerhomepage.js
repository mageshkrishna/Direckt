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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import JobCard from "./Jobcard";
import { useIsFocused } from "@react-navigation/native";

const Shopownerhomepage = () => {
  const [job_id, setjob_id] = useState(null);
  const [shopowner_id, setshopowner_id] = useState(null);
  const [deliverystatus, setdeliverystatus] = useState(false);
  const [replymessage, setreplymessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [job, setjob] = useState([]);
  const [shopownerdata, setshopownerdata] = useState(null);
  const[ownerdetail,setownerdetail] = useState(null);
  

  useEffect(() => {
    if(refreshing){
     return ;
    }
    else{
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("shopownerdata");

        if (data) {
          const parsedData = JSON.parse(data);
          setshopownerdata(parsedData);
          setownerdetail(parsedData._id)
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }
  }, [refreshing]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true); // Set refreshing to true before fetching data
  
    setTimeout( () => {
     
      setRefreshing(false); // Set refreshing back to false after data is fetched
    }, 2000);
  }, []);
  

  const getjob = async () => {
    if (!shopownerdata || !shopownerdata.location || !shopownerdata.category) {
      return;
    }

    const location = shopownerdata.location;
    const category = shopownerdata.category;

    console.log("getjob : " + location, category);
    try {
      const response1 = await axios.get(
        `https://direckt-copy1.onrender.com/shopowner/getjobs?location=${location}&category=${category}`
      );
      console.log(response1.data);
      setjob(response1.data);
    } catch (e) {
      Alert.alert("Something went wrong. Try again");
      console.log(e);  
    }
  };

  useEffect(() => {
    getjob();
  }, [shopownerdata]);
   
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    > 
       {!job &&  <ActivityIndicator size="medium" color="#0000ff" /> }
      {job.length > 0 && ownerdetail ? (
        job.map((item, index) => (
          <View key={index}>
            <JobCard item={item} ownerdetail={ownerdetail} />
          </View>
        ))
      ) : (
        <Text>No jobs available.refresh the app</Text>
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
// import {
//   View,
//   Text,
//   Button,
//   Alert,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import JobCard from "./Jobcard";

// const Shopownerhomepage = () => {
//   const [job_id, setjob_id] = useState(null);
//   const [shopowner_id, setshopowner_id] = useState(null);
//   const [deliverystatus, setdeliverystatus] = useState(false);
//   const [replymessage, setreplymessage] = useState(null);
//   const [refreshing, setRefreshing] = React.useState(false);
//   const [job, setjob] = useState([]);
//   const [shopownerdata, setshopownerdata] = useState([]);


//   const createreply = async () => {
//     if (!deliverystatus || !replymessage) {
//       Alert.alert("please fill the two feilds");
//     }
//     if (!job_id || !shopowner_id) {
//       Alert.alert("something went wrong refresh the app");
//     }
//     const formdata = {
//       job_id: job_id,
//       shopowner_id: shopowner_id,
//       deliverystatus: deliverystatus,
//       replymessage: replymessage,
//     };
//     try {
//       const response = await axios.post(
//         "https://direckt-copy1.onrender.com/shopowner/createjobreply",
//         formdata
//       );
//       console.log(response.status);
//       Alert.alert("created job reply successfully");
//     } catch (e) {
//       Alert.alert("Something went wrong try again");
//     }
//   };
//  useEffect(()=>{
//   const fetchData = async () => {
//     try {
//       const data = await AsyncStorage.getItem("shopownerdata");

//       if (data) {
//         const parsedData = JSON.parse(data);
//         setshopownerdata(parsedData);
         
//         console.log(shopownerdata)
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   fetchData(refreshing);

//  },[])
   
 


//   const onRefresh = React.useCallback(() => {
//     getjob()
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     },2000);
   
//   }, []);

//   const getjob = async () => {
    
//     const location = shopownerdata.location;
//     const category = shopownerdata.category;
//     if(!location && !category){
//       return ;
//     }
//     console.log("getjob : " + location, category);
//     try {
//       const response1 = await axios.get(
//         `https://direckt-copy1.onrender.com/shopowner/getjobs?location=${location}&category=${category}`
//       );
//       console.log(response1.data);
//       setjob(response1.data);
//     } catch (e) { 
//       Alert.alert("Something went wrong try again");
//       console.log(e);  
//     }
//   };
//   useEffect(() => {
   
//       getjob();


  
//   }, [shopownerdata,refreshing]);
  

//   return (
//     <ScrollView 
//     refreshControl={
//       <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//     }
//     >
  
//       {job ? (
//       job.map((item, index) => {
          
//         return (
//           <View key={index}>
         
//           <JobCard item={item}/>
//            </View>
//         )
//       }
       
//       )
//     ) : (
//       <Text>No jobs available</Text>
//     )}
//       </ScrollView>
    
//   )
// };

// export default Shopownerhomepage;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: 'pink',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
