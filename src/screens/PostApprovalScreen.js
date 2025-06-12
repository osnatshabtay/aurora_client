import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import { PostCard } from '../components/PostCard';
import { PostDetailsModal } from '../components/PostDetailsModal';
import { URL } from '@env';
import { ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper'
import BackButton from '../components/BackButton'; 
import { useNavigation } from '@react-navigation/native';

export default function PostApprovalScreen() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
  

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      const response = await fetch(`${URL}:8000/feed/pending_posts`);
      const data = await response.json();
      setPosts(data.pending_posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to fetch pending posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`${URL}:8000/feed/approve_post/${id}`, { method: 'PUT' });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error('Error approving post:', error);
      Alert.alert('Error', 'Failed to approve post.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${URL}:8000/feed/delete_post/${id}`, { method: 'DELETE' });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post.');
    }
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <View style={styles.container}>
            <BackButton goBack={navigation.goBack} />
      <Text style={styles.header}>אישור פוסטים</Text>
      <Text style={styles.subHeader}>
        בלחיצה על הכפתור "אישור", הפוסט יאושר ויופיע לכלל משתמשי האפליקציה.
        אם תלחץ "מחיקה", הפוסט יימחק לחלוטין ממערכת הנתונים.
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard post={item} onApprove={handleApprove} onDelete={handleDelete} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
    paddingTop:80
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#555",
  },
});
