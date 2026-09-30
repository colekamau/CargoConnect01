import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Image, Text } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../config/firebaseConfig';
import { useTheme } from '../../config/theme';

const pickupIcon = require('../../assets/icons/pickup.png');

const TrackDeliveryScreen = () => {
  const { colors } = useTheme();
  const [location, setLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  const driverPosition = useRef(
    new AnimatedRegion({
      latitude: -1.286389,
      longitude: 36.817223,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    })
  ).current;

  const destination = {
    latitude: -1.286389,
    longitude: 36.817223,
  };

  // Track user location
  useEffect(() => {
    let subscription;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to track your delivery.');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Get simulated driver location from Firebase
  useEffect(() => {
    const db = getDatabase();
    const driverRef = ref(db, 'drivers/driver1');

    const unsubscribe = onValue(driverRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.latitude && data?.longitude) {
        const newLoc = {
          latitude: data.latitude,
          longitude: data.longitude,
        };

        if (driverLocation) {
          driverPosition.timing({
            ...newLoc,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        } else {
          driverPosition.setValue(newLoc);
        }

        setDriverLocation(newLoc);
      }
    });

    return () => unsubscribe();
  }, [driverLocation]);

  if (!location) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* User marker */}
      <Marker
        coordinate={location}
        title="You"
        description="Current Location"
        pinColor={colors.primary}
      />

      {/* Destination marker */}
      <Marker
        coordinate={destination}
        title="Destination"
        description="Delivery Location"
        pinColor="red"
      />

      {/* Driver marker */}
      {driverLocation ? (
        <Marker.Animated coordinate={driverPosition}>
          <Image
            source={pickupIcon}
            style={{ width: 32, height: 32, resizeMode: 'contain' }}
          />
        </Marker.Animated>
      ) : (
        <Marker coordinate={destination}>
          <Text style={{ color: colors.text }}>Waiting for driver...</Text>
        </Marker>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});

export default TrackDeliveryScreen;
