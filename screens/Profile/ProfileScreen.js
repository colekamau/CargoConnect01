import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { db } from '../../config/firebaseConfig';
import { useTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

const EditProfileScreen = () => {
  const { colors } = useTheme();
  const auth = getAuth();
  const user = auth.currentUser;

  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [homeLocation, setHomeLocation] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [additionalLocations, setAdditionalLocations] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || '');
          setEmail(data.email || user.email);
          setPhone(data.phone || '');
          setHomeLocation(data.homeLocation || '');
          setWorkLocation(data.workLocation || '');
          setAdditionalLocations(data.additionalLocations || []);
          if (data.profileImage) setProfileImage(data.profileImage);
        }
      } catch (error) {
        Alert.alert('Error loading profile', error.message);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleAddLocation = () => {
    setAdditionalLocations([...additionalLocations, '']);
  };

  const handleLocationChange = (text, index) => {
    const updated = [...additionalLocations];
    updated[index] = text;
    setAdditionalLocations(updated);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take profile photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery access is required to choose profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Full Name and Phone Number are required.');
      return;
    }

    const userData = {
      fullName,
      email,
      phone,
      homeLocation,
      workLocation,
      additionalLocations,
      profileImage,
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userData);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error saving profile', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out', 'You have been logged out.');
    } catch (error) {
      Alert.alert('Logout failed', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user);
      Alert.alert('Deleted', 'Account deleted successfully.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={takePhoto} style={styles.profileImageWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholder]}>
              <Ionicons name="person" size={60} color="#aaa" />
            </View>
          )}
          <TouchableOpacity onPress={pickFromGallery} style={styles.galleryIcon}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personal Info</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number *"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={[styles.sectionTitle, { color: colors.primary }]}>Saved Locations</Text>

      <TextInput
        style={styles.input}
        placeholder="Home Location (optional)"
        value={homeLocation}
        onChangeText={setHomeLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Work Location (optional)"
        value={workLocation}
        onChangeText={setWorkLocation}
      />

      {additionalLocations.map((location, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Additional Location ${index + 1}`}
          value={location}
          onChangeText={(text) => handleLocationChange(text, index)}
        />
      ))}

      <TouchableOpacity onPress={handleAddLocation}>
        <Text style={[styles.addLink, { color: colors.primary }]}>+ Add Another Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSaveProfile}
      >
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'gray' }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'red' }]}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addLink: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditProfileScreen;
