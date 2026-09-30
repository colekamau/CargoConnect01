// screens/Delivery/DeliveryDetailsScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, push } from 'firebase/database';
import '../../config/firebaseConfig';
import TransportOptionsModal from '../../components/TransportOptionsModal';

const DeliveryDetailsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [pickup, setPickup] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoff, setDropoff] = useState('');
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [cost, setCost] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // Auto-fill pickup location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location to use this feature');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = loc.coords;
      setPickup(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
      setPickupCoords({ latitude: coords.latitude, longitude: coords.longitude });
    })();
  }, []);

  // Cost Estimation
  useEffect(() => {
    if (weight) {
      const numericWeight = parseFloat(weight);
      const estimated = numericWeight * 50 + 200;
      setCost(estimated.toFixed(0));
    }
  }, [weight]);

  const handleDropoffCoords = async () => {
    try {
      const geocoded = await Location.geocodeAsync(dropoff);
      if (geocoded && geocoded.length > 0) {
        const { latitude, longitude } = geocoded[0];
        setDropoffCoords({ latitude, longitude });
        return true;
      } else {
        Alert.alert('Invalid Drop-off', 'Could not find that location.');
        return false;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to geocode drop-off location.');
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!pickup || !dropoff || !description || !weight || !pickupCoords) {
      Alert.alert('Missing Info', 'Please fill all fields');
      return;
    }

    const coordsOk = await handleDropoffCoords();
    if (coordsOk) {
      setModalVisible(true);
    }
  };

  const handleOptionSelect = async (option) => {
    try {
      const db = getDatabase();
      const deliveriesRef = ref(db, 'deliveries');
      const newDelivery = {
        pickup,
        pickupCoords,
        dropoff,
        dropoffCoords,
        description,
        weight,
        cost,
        transportType: option.type,
        status: 'pending',
        timestamp: Date.now(),
      };

      await push(deliveriesRef, newDelivery);
      navigation.navigate('HomeDrawer', {
        screen: 'MainTabs',
        params: {
          screen: 'TrackDelivery',
        },
      });

    } catch (error) {
      Alert.alert('Error', 'Could not complete request.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={[styles.label, { color: colors.text }]}>Pickup Location</Text>
        <TextInput style={styles.input} value={pickup} editable={false} />

        <Text style={[styles.label, { color: colors.text }]}>Drop-off Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination address"
          placeholderTextColor="#999"
          value={dropoff}
          onChangeText={setDropoff}
        />

        <Text style={[styles.label, { color: colors.text }]}>Package Description</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Electronics, Documents"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[styles.label, { color: colors.text }]}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <Text style={[styles.estimate, { color: colors.primary }]}>
          Estimated Cost: KES {cost}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Request Delivery</Text>
        </TouchableOpacity>
      </ScrollView>

      <TransportOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleOptionSelect}
        pickupCoords={pickupCoords}
        dropoffCoords={dropoffCoords}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  estimate: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '600',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DeliveryDetailsScreen;
