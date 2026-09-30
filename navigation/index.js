import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import DeliveryDetailsScreen from '../screens/Delivery/DeliveryDetailsScreen';
import TrackDeliveryScreen from '../screens/Delivery/TrackDeliveryScreen';
import DeliveryConfirmationScreen from '../screens/Delivery/DeliveryConfirmationScreen';
import PastDeliveriesScreen from '../screens/Delivery/PastDeliveriesScreen';
import RatingsFeedbackScreen from '../screens/Feedback/Ratings&FeedbackScreen';
import InAppChatScreen from '../screens/Chat/InAppChatScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';

import CustomDrawer from '../components/CustomDrawer';
import theme from '../config/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    primary: theme.colors.primary,
    text: theme.colors.text,
  },
};

// ⬇️ Bottom Tabs Navigator (Main app view)
function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TrackDelivery"
        component={TrackDeliveryScreen}
        options={{
          title: 'Track Delivery',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-shipping" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ⬇️ Drawer Navigation (side menu)
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="MainTabs" component={HomeTabs} options={{ title: 'Home' }} />
      <Drawer.Screen name="PastDeliveries" component={PastDeliveriesScreen} />
      <Drawer.Screen name="RatingsFeedback" component={RatingsFeedbackScreen} />
      <Drawer.Screen name="InAppChat" component={InAppChatScreen} />
    </Drawer.Navigator>
  );
}

// ⬇️ App stack (handles login/signup and everything else)
export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeDrawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} />
        <Stack.Screen name="DeliveryConfirmation" component={DeliveryConfirmationScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
