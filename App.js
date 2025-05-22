import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './src/core/theme';
import MainTabs from './src/navigation/MainTabs';

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  Dashboard,
  QuestionsScreen,
  RegulationsScreen,
  EnrichmentContent,
  CategoryContent,
  HomeScreenManager,
  UserApprovalScreen,
  PostApprovalScreen,
  OptinalHomeScreen,
  PersonalizedContentScreen,
  MeditationPlayerScreen,
  MeditationSelectionScreen,
} from './src/screens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="RegulationsScreen" component={RegulationsScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
          <Stack.Screen name="PersonalizedContentScreen" component={PersonalizedContentScreen} />

          {/* כאן נכנס הסרגל התחתון */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* שאר מסכים שנפתחים מתוך Tabs */}
          <Stack.Screen name="EnrichmentContent" component={EnrichmentContent} />
          <Stack.Screen name="CategoryContent" component={CategoryContent} />
          <Stack.Screen name="HomeScreenManager" component={HomeScreenManager} />
          <Stack.Screen name="PostApprovalScreen" component={PostApprovalScreen} />
          <Stack.Screen name="OptinalHomeScreen" component={OptinalHomeScreen} />
          <Stack.Screen name="MeditationPlayerScreen" component={MeditationPlayerScreen} />
          <Stack.Screen name="MeditationSelectionScreen" component={MeditationSelectionScreen} />

          
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
