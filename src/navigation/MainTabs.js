import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStack from './HomeStack';
import CommunityStack from './CommunityStack';
import BotStack from './BotStack';
import EnrichmentStack from './EnrichmentStack';
import FriendsStack from './FriendsStack';

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
      <Tab.Screen name="תוכן העשרה" component={EnrichmentStack} />
      <Tab.Screen name="קהילה" component={CommunityStack} />
      <Tab.Screen name="מצא חבר" component={FriendsStack} />
      <Tab.Screen name="צ'אט בוט" component={BotStack} />
      <Tab.Screen name="בית" component={HomeStack} />

    </Tab.Navigator>
  );
}
