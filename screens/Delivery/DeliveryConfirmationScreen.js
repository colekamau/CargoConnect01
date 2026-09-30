import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../../config/firebaseConfig'; // Import Firebase config

const db = getFirestore(); // Initialize Firestore

const DeliveryConfirmationScreen = ({ navigation }) => {
  const [deliveryId] = useState('CARGO123456');
  const [driverName] = useState('John Doe');
  const [deliveryDate] = useState('April 21, 2025');

  const handleConfirm = async () => {
    try {
      const user = auth.currentUser; // Get the current user (optional for tracking who created the document)
      if (user) {
        const deliveriesRef = collection(db, 'deliveries'); // Reference to the 'deliveries' collection

        // Add a document to the 'deliveries' collection
        const docRef = await addDoc(deliveriesRef, {
          deliveryId,
          driverName,
          deliveryDate,
          createdAt: Timestamp.fromDate(new Date()), // Add a timestamp for when the document was created
          senderId: user.uid, // Add the user ID to track who confirmed the delivery
        });

        console.log('Document written with ID: ', docRef.id);
        alert('Delivery confirmed. Thank you!');
        navigation.navigate('Home'); // Navigate to another screen after confirmation
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Complete</Text>
      <Text style={styles.text}>Thank you for using CargoConnect!</Text>

      <View style={styles.summary}>
        <Text style={styles.label}>Delivery ID:</Text>
        <Text style={styles.value}>{deliveryId}</Text>

        <Text style={styles.label}>Driver Name:</Text>
        <Text style={styles.value}>{driverName}</Text>

        <Text style={styles.label}>Delivered on:</Text>
        <Text style={styles.value}>{deliveryDate}</Text>
      </View>

      <Button
        title="Confirm Delivery"
        color="#4CAF50" // You can customize this with your theme color
        onPress={handleConfirm} // Trigger the handleConfirm function when pressed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  summary: {
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
  },
});

export default DeliveryConfirmationScreen;
