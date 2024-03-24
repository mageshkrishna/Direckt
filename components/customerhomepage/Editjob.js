import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../../constants/Theme';

const Editjob = ({token}) => {
  const [jobtitle, setJobTitle] = useState('');
  const [jobdescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const token = token; // Replace with your token
      const formdata = { jobtitle, jobdescription };
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/shopowner/editjobs",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);
      // Handle response as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Job Title:</Text>
      <TextInput
        style={styles.input}
        value={jobtitle}
        onChangeText={text => setJobTitle(text)}
        placeholder="Enter job title"
      />
      <Text style={styles.label}>Job Description:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={jobdescription}
        onChangeText={text => setJobDescription(text)}
        placeholder="Enter job description"
        multiline
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.primary }]} // Purple color
        onPress={handleSaveChanges}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
// Light purple background
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
  },
  button: {
    backgroundColor: COLORS.primary, // Default purple color
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Editjob;
