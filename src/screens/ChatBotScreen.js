import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text, ActivityIndicator, Image } from 'react-native';
import { theme } from '../core/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../api';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { URL } from '@env';
import { imageMapping } from '../helpers/avatar';


export default function ChatBotScreen() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [botTyping, setBotTyping] = useState(false);
    const [userAvatar, setUserAvatar] = useState('boy_avatar1.png');

    useEffect(() => {
    fetchChatHistory();
    fetchUserAvatar();
    }, []);

    const fetchUserAvatar = async () => {
    try {
        const res = await api('/users/me');
        if (res.selectedImage) {
        setUserAvatar(res.selectedImage);
        }
    } catch (err) {
        console.error('Error fetching user avatar:', err);
    }
    };


    const fetchChatHistory = async () => {
        try {
            const result = await api('/chatbot/chat_history');

            if (result.chat_history) {
                const formattedMessages = result.chat_history.map((msg, index) => ({
                    id: index.toString(),
                    text: msg.content,
                    sender: msg.role === 'user' ? 'user' : 'bot',
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error.message);
        }
    };

    const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
        id: Math.random().toString(),
        text: inputText,
        sender: 'user',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setBotTyping(true);
    setLoading(true);

    try {
        const { sound } = await Audio.Sound.createAsync(
        require('../assets/sound/send.mp3') 
        );
        await sound.playAsync();
    } catch (error) {
        console.warn('Sound error:', error);
    }

    try {
        const result = await api('/chatbot/rag_chat', {
        method: 'POST',
        body: JSON.stringify({ message: inputText }),
        });

        const botMessage = {
        id: Math.random().toString(),
        text: result.response,
        sender: 'bot',
        };

        setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        setBotTyping(false);
        setLoading(false);
    }
    };

    const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';
    const avatarSource = isUser
        ? imageMapping[userAvatar || 'boy_avatar1.png']
        : null;

    return (
        <Animated.View
        entering={FadeIn.duration(300)}
        style={[
            styles.messageRow,
            isUser ? styles.userRow : styles.botRow,
        ]}
        >
        {!isUser && <Text style={styles.botIcon}>🤖</Text>}

        <View style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
        ]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>

        {isUser && (
            <Image source={avatarSource} style={styles.avatarImage} />
        )}
        </Animated.View>
    );
    };




    return (
        <View style={styles.container}>
            {/*Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.chatTitle}>צ׳אט תמיכה</Text>
                <Text style={styles.chatSubtitle}>תמיד כאן כדי לעזור</Text>
            </View>

            {/*Chat Messages Section */}
            <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageContainer}
            />

            {/*Loading Indicator */}
            {loading && <ActivityIndicator size="small" color={theme.colors.primary} />}
            

            {botTyping && (
            <Text style={styles.typingText}>🤖 כותב...</Text>
            )}


            {/*Chat Input Section */}
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="כתוב הודעה..."
                placeholderTextColor="#888"
                textAlign="right"
                writingDirection="rtl"
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <MaterialIcons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF4F4', 
  },
  topBar: {
    paddingVertical: 20,
    backgroundColor: '#A0D2DB', 
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  chatTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#003F5C',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#003F5C',
    opacity: 0.7,
    marginTop: 4,
  },
  messageContainer: {
    flexGrow: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#6EC6CA', 
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#D0E8E8',
  },
  messageText: {
    fontSize: 16,
    color: '#003F5C',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#CCE5E5',
    backgroundColor: '#F8FCFC',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#A0D2DB',
    fontSize: 16,
    backgroundColor: 'white',
    color: '#003F5C',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#6EC6CA',
    borderRadius: 25,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageRow: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  marginBottom: 8,
},
userRow: {
  justifyContent: 'flex-end',
},
botRow: {
  justifyContent: 'flex-start',
},
botIcon: {
  fontSize: 20,
  marginRight: 6,
  marginBottom: 4,
},
messageRow: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  marginBottom: 8,
},
userRow: {
  justifyContent: 'flex-end',
},
botRow: {
  justifyContent: 'flex-start',
},
avatarImage: {
  width: 30,
  height: 30,
  borderRadius: 15,
  marginRight: 8,
},
botIcon: {
  fontSize: 22,
  marginRight: 6,
},
typingText: {
  marginLeft: 16,
  marginBottom: 10,
  color: '#555',
  fontStyle: 'italic',
},


});

