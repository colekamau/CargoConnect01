import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../config/theme';

const PaymentScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.subtitle}>Payment integration (Stripe/Mpesa) coming soon.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
});

export default PaymentScreen;
