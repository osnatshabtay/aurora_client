import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SocialGraphScreen from '../screens/SocialGraphScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();


export default function FriendsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SocialGraphScreen" component={SocialGraphScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

    </Stack.Navigator>
  );
}