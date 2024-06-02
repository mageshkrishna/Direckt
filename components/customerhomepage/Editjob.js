import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../../constants/Theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from "expo-secure-store";
import {createnewauthtoken }from '../RefreshSession/RefreshSession';
import { useDispatch, useSelector } from "react-redux";
import { setCustomerToken } from '../../redux/customerAuthActions';
import { strings } from '../../locals/translations';

const Editjob = () => {
  const navigation = useNavigation(); // Extract navigation object here
  const route = useRoute();
  const dispatch = useDispatch()
  const { token, job_id, title, description, email } = route.params;
  const [jobtitle, setJobTitle] = useState(title);
  const [jobdescription, setJobDescription] = useState(description);
  const [loading, setLoading] = useState(false);
  const lang = useSelector(
    (state) => state.appLanguage.language
  );
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  const handleSaveChanges = async () => {
    if (!jobtitle || jobtitle.length < 8) {
      showToast("Job title should be at least 8 characters...");
      return;
    }
    if (!jobdescription || jobdescription.length < 8) {
      showToast("Job description should be at least 8 characters...");
      return;
    }

    try {
      setLoading(true);
      const formdata = { jobtitle: jobtitle, job_id: job_id, jobdescription: jobdescription };
      let authtoken = await SecureStore.getItemAsync("customertoken")
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/Customerdata/editjobs",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(false);
      showToast("Job updated successfully");
      navigation.navigate("homeCustomer");
      dispatch(setCustomerToken(jobtitle+jobdescription))
      
    } catch (error) {

      if(error.response.status === 429){
        const newtoken = await createnewauthtoken(email)

        if(newtoken){
          await SecureStore.setItemAsync('customertoken',newtoken);
          await handleSaveChanges()
        }
        else{
          navigation.replace('Home')
        }
      }
      else if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast(`Error: ${error.response.data.error}`);
        } else {
          showToast("Network error. Please check your internet connection.");
        }
      } else {
        showToast("An error occurred. Please try again.");
      }
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pagetitle}>{strings[`${lang}`].editjob}</Text>
      <View style={{width:'85%'}}>
      
      <Text style={styles.label}>{strings[`${lang}`].Tasktitle}</Text>
      <TextInput
        style={styles.input}
        value={jobtitle}
        onChangeText={text => setJobTitle(text)}
        placeholder="Enter job title"
      />
      <Text style={styles.label}>{strings[`${lang}`].TaskDescription}</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={jobdescription}
        onChangeText={text => setJobDescription(text)}
        placeholder="Enter job description"
        multiline
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.primary }]}
        onPress={handleSaveChanges}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{strings[`${lang}`].save}</Text>
        )}
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  pagetitle:{
    fontSize:25,
    marginBottom:50,
    fontWeight:'bold'
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    // width:'90%'
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom:30
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Editjob;
