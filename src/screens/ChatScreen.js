import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const SERVER_URL = `${URL}:8000`;

export default function ChatScreen({ route }) {
  const { currentUser, targetUser } = route.params;
  console.log('currentUser:', currentUser);
  console.log('targetUser:', targetUser);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({
      title: `צ'אט עם ${targetUser}`,
      headerStyle: { backgroundColor: '#007bff' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }
    });
  }, [targetUser]);


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
  
      ws.onopen = () => {
        console.log("✅ WebSocket connected");
      };
  
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          setMessages(prev => [...prev, msg]);
        } catch (err) {
          console.error("Error parsing incoming message:", err);
        }
      };
  
      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error.message);
      };
  
      ws.onclose = () => {
        console.log("WebSocket closed");
      };
    };
  
    connect();
  
    return () => {
      socketRef.current?.close();
    };
  }, []);
  
  const sendMessage = () => {
    console.log('currentUser:', currentUser);
    console.log('targetUser:', targetUser);

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
  

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.from === currentUser ? styles.myMessage : styles.theirMessage
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="הקלד הודעה..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>שלח</Text>
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
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
    borderRadius: 15
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6'
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  messageText: {
    fontSize: 16
  }
});
