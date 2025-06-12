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
  QuestionsScreen,
  RegulationsScreen,
  UserListScreen,
  HomeScreenManager,
  PostApprovalScreen,
  CommunityScreenAdmin
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
          <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
          <Stack.Screen name="RegulationsScreen" component={RegulationsScreen} />
          <Stack.Screen name="UserListScreen" component={UserListScreen} />
          <Stack.Screen name="HomeScreenManager" component={HomeScreenManager} />
          <Stack.Screen name="PostApprovalScreen" component={PostApprovalScreen} />
          <Stack.Screen name="CommunityScreenAdmin" component={CommunityScreenAdmin} />

          {/* לאחר הכניסה — גישה לכל האפליקציה עם הסרגל ניווט */}
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
