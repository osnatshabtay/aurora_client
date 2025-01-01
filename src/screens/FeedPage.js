import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../components/Card';
import { Heart, MessageCircle } from '../components/Icon';


const Avatar = ({ size = 40, uri }) => {
  return (
    <View style={[styles.avatarContainer, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={uri ? { uri } : require('../assets/logo.png')}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
};

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [username, setUsername] = useState('JohnDoe'); // Replace with actual username logic

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/feed/all_posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostText.trim()) {
      Alert.alert('Error', 'Post text cannot be empty.');
      return;
    }

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
      Alert.alert('Success', 'Post created successfully.');
      fetchPosts(); // Refresh posts after creating a new one
      setNewPostText('');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea}>
        <View style={styles.contentContainer}>
          {/* Post Creation */}
          <Card>
            <CardHeader style={[styles.cardHeader, styles.postCreationHeader]}>
              <Avatar size={50} />
              <TextInput
                placeholder="What's New?"
                style={styles.input}
                multiline={true}
                value={newPostText}
                onChangeText={setNewPostText}
              />
              <TouchableOpacity style={styles.addPostButton} onPress={createPost}>
                <Text style={styles.addPostText}>Post</Text>
              </TouchableOpacity>
            </CardHeader>
          </Card>

          {/* Loading Spinner */}
          {loading && <ActivityIndicator size="large" color="#560CCE" />}

          {/* Display Posts */}
          {!loading &&
            posts.map((post, index) => (
              <Card key={index}>
                <CardHeader style={styles.cardHeader}>
                  <View style={styles.userContainer}>
                    <Avatar size={40} />
                    <Text style={styles.userName}>{post.username}</Text>
                  </View>
                </CardHeader>
                <CardContent style={styles.cardContent}>
                  <Text>{post.text}</Text>
                </CardContent>
                <CardFooter style={styles.cardFooter}>
                  <View style={styles.footerStats}>
                    <View style={styles.statItem}>
                      <Heart />
                      <Text style={styles.footerText}>{post.likes?.length || 0} likes</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MessageCircle />
                      <Text style={styles.footerText}>{post.commands?.length || 0} Comments</Text>
                    </View>
                  </View>
                </CardFooter>
              </Card>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  postCreationHeader: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginHorizontal: 1,
    fontSize: 14,
    color: '#333',
    width: 230,
  },
  addPostButton: {
    marginLeft: 8,
    backgroundColor: '#560CCE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPostText: {
    color: '#fff',
    fontWeight: '600',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
  },
  cardContent: {
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'column',
    gap: 8,
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#333',
  },
  avatarContainer: {
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
});
