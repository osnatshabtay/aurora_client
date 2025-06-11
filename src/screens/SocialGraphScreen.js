import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { getAvatarImage } from '../helpers/avatar';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import * as SecureStore from 'expo-secure-store';
import { URL } from '@env';


export default function SocialGraphScreen() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const SERVER_URL = `${URL}:8000`;

const [unreadSenders, setUnreadSenders] = useState([]);

useEffect(() => {
  const fetchUnread = async () => {
    try {
      const data = await api('/chat/unread');
      console.log(data);
      const fromUsers = (data.messages || []).map(msg => msg.from);
      const uniqueSenders = [...new Set(fromUsers)];
      setUnreadSenders(uniqueSenders);
    } catch (error) {
      console.error('Error fetching unread:', error.message);
      Alert.alert('Error', 'Failed to fetch unread.');
    }
  };

  fetchUnread(); 
}, []);

  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) return;
        const res = await fetch(`${SERVER_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.username) {
          setCurrentUser({ username: data.username });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api('/users/recommendations');
        setUsers(res.recommended_users);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err.message || err);
      }
    };
    fetchRecommendations();
  }, []);

  const handleUserPress = (targetUser) => {
    navigation.navigate('ChatScreen', {
      currentUser: currentUser.username,
      targetUser: targetUser
    });
  };

  const renderItem = ({ item }) => {
    const hasUnread = unreadSenders.includes(item.username);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleUserPress(item.username)}
        activeOpacity={0.8}
      >
        <View style={{ position: 'relative' }}>
          <Image source={getAvatarImage(item.selectedImage)} style={styles.avatar} />
          {hasUnread && <View style={styles.redDot} />}
        </View>
        <Text style={styles.username}>{item.username}</Text>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>הכר חבר</Text>
        <Text style={styles.subtitle}>
          המשתמשים שמוצעים לך כאן משתפים איתך מאפיינים דומים, התמודדויות מורכבות או תחומי עניין משותפים. 
          הם נבחרו עבורך באופן אישי כדי להציע לך קשרים משמעותיים יותר בקהילה.
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF4F4',
    paddingHorizontal: 16,
  },
  headerWrapper: {
    paddingTop: 48,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003F5C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    paddingHorizontal: 12,
    lineHeight: 24,
  },
  listContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  card: {
    alignItems: 'center',
    width: '40%',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
  redDot: {
  position: 'absolute',
  top: 2,
  right: 2,
  width: 22,
  height: 22,
  borderRadius: 15,
  backgroundColor: 'red',
  borderWidth: 1,
  borderColor: '#fff',
  zIndex: 1,
},
});
