import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatBotScreen from '../screens/ChatBotScreen';
import UserListScreen from '../screens/UserListScreen';

const Stack = createStackNavigator();

export default function BotStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatBotScreen" component={ChatBotScreen} />
      <Stack.Screen name="UserListScreen" component={UserListScreen} />
    </Stack.Navigator>
  );
}