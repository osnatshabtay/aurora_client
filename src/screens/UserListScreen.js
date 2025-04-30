import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../api';
import { useNavigation } from '@react-navigation/native';

export default function UserListScreen({ route }) {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const { currentUser } = route.params;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api('/users/all'); // נניח שיש לך כזה ראוט, אחרת נוסיף אחד בשרת
      setUsers(response.users.filter(u => u.username !== currentUser));
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'לא ניתן לטעון משתמשים.');
    }
  };

  const handleUserPress = (targetUser) => {
    navigation.navigate('ChatScreen', {
      currentUser,
      targetUser
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>בחר משתמש לצ'אט:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleUserPress(item.username)}
          >
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  username: {
    fontSize: 16
  }
});
