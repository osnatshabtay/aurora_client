import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { imageMapping } from '../helpers/avatar';

const SERVER_URL = `${URL}:8000`;

export default function ChatScreen({ route }) {
  const { currentUser, targetUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const navigation = useNavigation();

  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const [targetUserAvatar, setTargetUserAvatar] = useState(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');

        const resCurrent = await axios.get(`${SERVER_URL}/users/by_username/${currentUser}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserAvatar(resCurrent.data?.selectedImage);

        const resTarget = await axios.get(`${SERVER_URL}/users/by_username/${targetUser}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTargetUserAvatar(resTarget.data?.selectedImage);

      } catch (err) {
        console.error("Error loading avatars:", err);
      }
    };

    fetchAvatars();
  }, []);

useEffect(() => {
  if (!targetUserAvatar) return;

  navigation.setOptions({
    headerTitle: () => (
      <View style={styles.headerContainer}>
        <Image
          source={imageMapping[targetUserAvatar] || require('../assets/logo.png')}
          style={styles.headerAvatar}
        />
        <Text style={styles.headerTitleText}>{targetUser}</Text>
      </View>
    ),
    headerStyle: { backgroundColor: '#A0D2DB' },
    headerTintColor: '#fff',
  });
}, [targetUser, targetUserAvatar]);

  useEffect(() => {
    const connect = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) return;

      try {
        const res = await axios.get(`${SERVER_URL}/chat/${currentUser}/${targetUser}`);
        setMessages(res.data);

        await axios.post(`${SERVER_URL}/chat/mark_seen`, {
          from_user: targetUser,
          to_user: currentUser
        });
      } catch (err) {
        console.error("Error loading chat or updating seen:", err);
      }

      const ws = new WebSocket(`${SERVER_URL.replace('http', 'ws')}/ws?token=${token}`);
      socketRef.current = ws;

      ws.onopen = () => console.log("WebSocket connected");
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          setMessages(prev => [...prev, msg]);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };
      ws.onerror = (error) => console.error("WebSocket error:", error.message);
      ws.onclose = () => console.log("WebSocket closed");
    };

    connect();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    const msg = {
      to: targetUser,
      message: input
    };

    socketRef.current.send(JSON.stringify(msg));

    setMessages(prev => [
      ...prev,
      { from: currentUser, ...msg, timestamp: new Date().toISOString() }
    ]);

    setInput('');
  };

const renderItem = ({ item }) => {
  const isMe = item.from === currentUser;
  const avatarSource = isMe
    ? imageMapping[currentUserAvatar || 'boy_avatar1.png']
    : imageMapping[targetUserAvatar || 'girl_avatar1.png'];

  const formattedTime = item.timestamp
    ? new Date(item.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <View style={[styles.messageRow, isMe ? styles.userRow : styles.theirRow]}>
      {!isMe && <Image source={avatarSource} style={styles.avatarImage} />}
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestampText}>{formattedTime}</Text>
      </View>
      {isMe && <Image source={avatarSource} style={styles.avatarImage} />}
    </View>
  );
};


  return (
    <View style={styles.container}>
      <FlatList
        data={[...messages].reverse()}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="הקלד הודעה..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#fff'
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
    borderRadius: 15
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6EC6CA'
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  messageText: {
    fontSize: 16
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  theirRow: {
    justifyContent: 'flex-start',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerTitleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestampText: {
  fontSize: 10,
  color: '#666',
  marginTop: 4,
  alignSelf: 'flex-end'
},
});
