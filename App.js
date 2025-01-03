import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  Dashboard,
  QuestionsScreen,
  RegulationsScreen,
  EnrichmentContent,
  HomeScreen,
  CategoryContent,
  CommunityScreen,
} from './src/screens'

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: true,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="RegulationsScreen" component={RegulationsScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
          <Stack.Screen name="EnrichmentContent" component={EnrichmentContent}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen}/>
          <Stack.Screen name="CategoryContent" component={CategoryContent}/>
          <Stack.Screen name="CommunityScreen" component={CommunityScreen}/>

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}