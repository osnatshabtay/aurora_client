import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../core/theme';
import TextInput from '../components/TextInput';
import Paragraph from '../components/Paragraph';

const { width } = Dimensions.get('window');

export default function FeedScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarWidth = useRef(new Animated.Value(60)).current;
  const [posts, setPosts] = useState([]); // State for posts
  const [newPostText, setNewPostText] = useState(''); // State for new post input

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/feed/all_posts');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load posts.');
    }
  };

  const submitPost = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/feed/write_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Osnat',
          text: newPostText,
          likes: [],
          commands: [],
          approved: false,
        }),
      });
      const data = await response.json();
      console.log('hi ', data)
      if (response.ok) {
        console.log('hi :)')
        Alert.alert('Success', 'Post created successfully.');
        setNewPostText('');
        fetchPosts(); 
      } else {
        Alert.alert('Error', data.detail || 'Failed to create post.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post.');
    }
  };

  useEffect(() => {
    fetchPosts(); 
  }, []);

  const toggleSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: isOpen ? 60 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleLike = () => {
    alert('Post liked!');
  };

  const handleComment = () => {
    alert('Commenting on post!');
  };

  return (
    <View style={styles.container}>
      {/* Animated Sidebar */}
      <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
          <Text style={styles.toggleText}>{isOpen ? '←' : '→'}</Text>
        </TouchableOpacity>
        {isOpen && (
          <View>
            <Header>Maddesign</Header>
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Main Menu</Text>
              <Button mode="text" style={styles.menuButton}>
                Messages <Text style={styles.badge}>12</Text>
              </Button>
              <Button mode="text" style={styles.menuButton}>Mail</Button>
              <Button mode="text" style={styles.menuButton}>People</Button>
              <Button mode="text" style={styles.menuButton}>Feed</Button>
            </View>
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Explore</Text>
              <Button mode="text" style={styles.menuButton}>Pages</Button>
              <Button mode="text" style={styles.menuButton}>Events</Button>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Input Section */}
        <View style={styles.card}>
          <TextInput
            placeholder="What's New?"
            style={styles.input}
            value={newPostText}
            onChangeText={setNewPostText}
          />
          <Button mode="contained" onPress={submitPost}>
            Post
          </Button>
        </View>

        {/* Posts Section */}
        {posts.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={require('../assets/logo.png')} style={styles.avatar} />
              <View>
                <Text style={styles.postTitle}>{post.username}</Text>
              </View>
            </View>

            <View style={styles.postContent}>
              <Paragraph>{post.text}</Paragraph>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.emoji}>👍</Text>
                <Text style={styles.iconLabel}>Like {post.likes ? post.likes.length : 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.emoji}>💬</Text>
                <Text style={styles.iconLabel}>Comments {post.commands ? post.commands.length : 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
  },
  sidebar: {
    backgroundColor: 'white', 
    height: '100%',
    padding: 10,
    zIndex: 2,
    borderRightWidth: 1,
    borderColor: theme.colors.secondary,
  },
  toggleButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 5,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  postCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postSubtitle: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  postContent: {
    marginBottom: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  image: {
    width: '48%',
    height: 100,
    borderRadius: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    width: '40%',
  },
  engagementText: {
    textAlign: 'center',
    color: theme.colors.secondary,
    marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  emoji: {
    fontSize: 24,
    marginRight: 5,
  },
  iconLabel: {
    fontSize: 16,
    color: theme.colors.primary,
  },

});
