// LocationButton.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/Theme';
import { strings } from '../../locals/translations';
import { useSelector } from 'react-redux';
const LocationButton = ({ setgmaplink }) => {
  const [loading, setLoading] = useState(false);
  const lang =useSelector(
    (state) => state.appLanguage.language
  );
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
      const { latitude, longitude } = location.coords;
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setgmaplink(locationUrl);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
    <TouchableOpacity style={styles.button} onPress={getLocation} disabled={loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{strings[`${lang}`].getLocationlink}</Text>}
    </TouchableOpacity>
    <Text style={{fontSize:14,marginVertical:5}}>{strings[`${lang}`].suggestlink}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LocationButton;
