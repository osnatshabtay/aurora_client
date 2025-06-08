import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EnrichmentContent from '../screens/EnrichmentContent';
import MeditationPlayerScreen from '../screens/MeditationPlayerScreen';
import MeditationSelectionScreen from '../screens/MeditationSelectionScreen';
import CategoryContent from '../screens/CategoryContent';

const Stack = createStackNavigator();


export default function EnrichmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EnrichmentContent" component={EnrichmentContent} />
      <Stack.Screen name="MeditationPlayerScreen" component={MeditationPlayerScreen} />
      <Stack.Screen name="MeditationSelectionScreen" component={MeditationSelectionScreen} />
      <Stack.Screen name="CategoryContent" component={CategoryContent} />
    </Stack.Navigator>
  );
}