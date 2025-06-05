import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import CommunityScreen from '../screens/CommunityScreen';
import EnrichmentContent from '../screens/EnrichmentContent';
import SocialGraph from '../screens/SocialGraphScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
<Tab.Navigator
  initialRouteName="בית"
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;

      switch (route.name) {
        case 'בית':
          iconName = 'home';
          break;
        case 'קהילה':
          iconName = 'people';
          break;
        case "צ'אט בוט":
          iconName = 'chatbubble-ellipses-outline';
          break;
        case 'תוכן העשרה':
          iconName = 'book';
          break;
        case 'מצא חבר':
          iconName = 'search';
          break;
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#007BFF',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
  })}
>
  <Tab.Screen name="תוכן העשרה" component={EnrichmentContent} />
  <Tab.Screen name="מצא חבר" component={SocialGraph} />
  <Tab.Screen name="צ'אט בוט" component={ChatBotScreen} />
  <Tab.Screen name="קהילה" component={CommunityScreen} />
  <Tab.Screen name="בית" component={HomeScreen} />
</Tab.Navigator>

  );
}
