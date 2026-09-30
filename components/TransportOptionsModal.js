// components/TransportOptionsModal.js

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import haversine from 'haversine';

const transportOptions = [
  {
    type: 'Boda',
    iconComponent: FontAwesome5,
    iconName: 'motorcycle',
    basePrice: 300,
  },
  {
    type: 'Bike',
    iconComponent: FontAwesome5,
    iconName: 'bicycle',
    basePrice: 150,
    onlyShortDistance: true,
  },
  {
    type: 'Pick-up Truck',
    iconComponent: FontAwesome5,
    iconName: 'truck-pickup', // switched to FontAwesome5 for reliability
    basePrice: 800,
  },
  {
    type: 'Truck',
    iconComponent: MaterialCommunityIcons,
    iconName: 'truck',
    basePrice: 1200,
  },
  {
    type: 'Transit',
    iconComponent: MaterialCommunityIcons,
    iconName: 'van-utility',
    basePrice: 1500,
  },
];

const TransportOptionsModal = ({
  visible,
  onClose,
  onSelect,
  pickupCoords,
  dropoffCoords,
}) => {
  const calculateDistance = () => {
    if (!pickupCoords || !dropoffCoords) return Infinity;
    return haversine(pickupCoords, dropoffCoords, { unit: 'km' });
  };

  const distance = calculateDistance();

  const filteredOptions = transportOptions.filter((option) => {
    if (option.onlyShortDistance) return distance < 3;
    return true;
  });

  const handleSelect = (option) => {
    Alert.alert('Request Confirmed', `You selected ${option.type} - KES ${option.basePrice}`);
    onSelect(option);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Choose Transport</Text>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.type}
            renderItem={({ item }) => {
              const Icon = item.iconComponent;
              return (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                  <Icon name={item.iconName} size={28} color="#5D4037" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.type}>{item.type}</Text>
                    <Text style={styles.price}>KES {item.basePrice}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#5D4037',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#777',
  },
  closeBtn: {
    marginTop: 15,
    alignSelf: 'center',
  },
  closeText: {
    color: '#5D4037',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TransportOptionsModal;
