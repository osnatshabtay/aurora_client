import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { theme } from '../core/theme'; 
import { MaterialIcons } from '@expo/vector-icons';


export default function ChatBotScreen() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    // Add welcome message on load
    useEffect(() => {
        const initialMessage = {
            id: '1',
            text: 'שלום! איך אפשר לעזור היום?',
            sender: 'bot',
        };
        setMessages([initialMessage]);
    }, []);

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage = {
            id: Math.random().toString(),
            text: inputText,
            sender: 'user',
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputText('');

        // Simulating a bot response
        setTimeout(() => {
            const botMessage = {
                id: Math.random().toString(),
                text: "אני כאן כדי לעזור! 😊",
                sender: 'bot',
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }, 1000);
    };

    const renderMessageItem = ({ item }) => (
        <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Bar with Support Chat Title */}
            <View style={styles.topBar}>
                <Text style={styles.chatTitle}>צ׳אט תמיכה</Text>
                <Text style={styles.chatSubtitle}>תמיד כאן כדי לעזור</Text>
            </View>

            {/* Chat Messages Section */}
            <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageContainer}
            />

            {/* Chat Input Section */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.colors.secondary}
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
        backgroundColor: '#F2F2F2',
    },
    topBar: {
        padding: 15,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    chatSubtitle: {
        fontSize: 14,
        color: 'white',
        opacity: 0.8,
    },
    messageContainer: {
        flexGrow: 1,
        padding: 15,
        justifyContent: 'flex-end',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 15,
        marginVertical: 4,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    userBubble: {
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-end',
    },
    botBubble: {
        backgroundColor: theme.colors.secondary,
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        fontSize: 16,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: theme.colors.primary,
        borderRadius: 25,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

