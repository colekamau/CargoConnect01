import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CustomDrawer = (props) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#fff" />
        <Text style={styles.username}>
          {user?.displayName || user?.email || 'Guest'}
        </Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>5.0</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <DrawerItemList {...props} />

      <TouchableOpacity disabled style={styles.disabledItem}>
        <Ionicons name="cash-outline" size={20} color="#aaa" />
        <Text style={styles.disabledText}>Payment (Coming Soon)</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#5D4037',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    color: '#fff',
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  disabledItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 20,
  },
  disabledText: {
    color: '#aaa',
    marginLeft: 10,
  },
});

export default CustomDrawer;
