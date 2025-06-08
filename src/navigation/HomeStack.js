import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenManager from '../screens/HomeScreenManager';
import PostApprovalScreen from '../screens/PostApprovalScreen';


const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="HomeScreenManager" component={HomeScreenManager} />
      <Stack.Screen name="PostApprovalScreen" component={PostApprovalScreen} />

    </Stack.Navigator>
  );
}
