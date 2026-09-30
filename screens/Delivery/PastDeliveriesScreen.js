import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { format } from 'date-fns';
import theme from '../../config/theme';
import '../../config/firebaseConfig'; // Make sure Firebase is initialized

const PastDeliveriesScreen = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log('❌ No user logged in.');
          setDeliveries([]);
          setLoading(false);
          return;
        }

        console.log('✅ Logged in UID:', user.uid);

        const db = getFirestore();
        const deliveriesRef = collection(db, 'deliveries');

        // 🔄 TEMP: remove 'status' filter while testing
        const q = query(
          deliveriesRef,
          where('userId', '==', user.uid),
          orderBy('deliveryId') // You can change to 'deliveredAt' if needed
        );

        const snapshot = await getDocs(q);

        const parsedDeliveries = snapshot.docs.map((doc) => {
          const data = doc.data();
          let formattedDate = 'Pending';

          // 🔧 Handle both Firestore Timestamp or string
          if (data.deliveredAt && data.deliveredAt !== 'null') {
            try {
              const rawDate =
                typeof data.deliveredAt === 'string'
                  ? new Date(data.deliveredAt)
                  : data.deliveredAt.toDate(); // Firestore Timestamp
              formattedDate = format(rawDate, 'MMMM d, yyyy – h:mm a');
            } catch (e) {
              console.warn('❗ Invalid deliveredAt:', data.deliveredAt);
            }
          }

          return {
            id: doc.id,
            deliveryId: data.deliveryId || 'Unknown',
            driverName: data.driverName || 'N/A',
            status: data.status || 'Unknown',
            date: formattedDate,
          };
        });

        console.log('📦 Deliveries found:', parsedDeliveries.length);
        setDeliveries(parsedDeliveries.reverse());
      } catch (error) {
        console.error('🔥 Error fetching deliveries:', error);
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="cube-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.itemName}>{item.deliveryId}</Text>
      </View>
      <Text style={styles.details}>Driver: {item.driverName}</Text>
      <Text style={styles.details}>Delivered At: {item.date}</Text>
      <Text style={[styles.status, { color: item.status === 'completed' ? 'green' : '#E65100' }]}>
        Status: {item.status}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Past Deliveries</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ marginTop: 20 }}>No past deliveries found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: theme.colors.text,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  status: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PastDeliveriesScreen;
