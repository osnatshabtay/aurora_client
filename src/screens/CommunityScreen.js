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
import { MessageCircle, HeartOutline, HeartFilled } from '../components/Icon';
import { imageMapping } from '../helpers/avatar';
import { theme } from '../core/theme'; 
import { URL } from '@env';
import { api } from '../api';


const Avatar = ({ size = 40, uri }) => {
  const imageSource = imageMapping[uri] || require('../assets/logo.png');
  return (
    <View style={[styles.avatarContainer, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={imageSource}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
};

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [currentUser, setCurrentUser] = useState({
    username: 'anonymous',
    selectedImage: 'boy_avatar1.png',
  });
  
  const [commentBoxVisible, setCommentBoxVisible] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api('/feed/all_posts');
      setPosts(data.posts.filter(post => post.approved));
      setCurrentUser({
        username: data.current_username,
        selectedImage: data.current_username_image,
      });
    } catch (error) {
      console.error('Error fetching posts:', error.message);
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
      await api('/feed/write_post', {
        method: 'POST',
        body: JSON.stringify({
          text: newPostText.trim(),
        }),
      });
  
      Alert.alert('הפוסט נשלח לאישור מנהל', 'לאחר אישורו, הוא יתפרסם בקהילה.');
      fetchPosts();
      setNewPostText('');
  
    } catch (error) {
      console.error('Error creating post:', error.message);
      Alert.alert('Error', 'הפוסט לא נוצר בהצלחה');
    }
  };
  
  const handleLike = async (postId) => {
    try {
      await api('/feed/like', {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
        }),
      });

      updatePostLikes(postId); // Update the UI

    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'לא ניתן לבצע כרגע את הפעולה');
    }
  };

  const toggleCommentBox = (postId) => {
    setCommentBoxVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentTextChange = (postId, text) => {
    setCommentTexts((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  const submitComment = async (postId) => {
    const commentText = commentTexts[postId]?.trim();
    if (!commentText) {
      Alert.alert('Error', 'תגובה לא יכולה להיות ריקה');
      return;
    }
    try {
      await api('/feed/comment', {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
          text: commentText,
        }),
      });
      
      setCommentTexts((prev) => ({
        ...prev,
        [postId]: '',
      }));
      setCommentBoxVisible((prev) => ({
        ...prev,
        [postId]: false,
      }));
      fetchPosts();

    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment.');
    }
  };


  const updatePostLikes = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: post.likes.includes(currentUser.username)
                ? post.likes.filter((user) => user !== currentUser.username) // Unlike
                : [...post.likes, currentUser.username], // Like
            }
          : post
      )
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea}>
        <View style={styles.contentContainer}>
          {/* Post Creation */}
          <Card>
            <CardHeader style={[styles.cardHeader, styles.postCreationHeader]}>
              <Avatar size={50} uri={currentUser.selectedImage} />
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
                    <Avatar size={40} uri={post.user_image} />
                    <Text style={styles.userName}>{post.user}</Text>
                  </View>
                </CardHeader>
                <CardContent style={styles.cardContent}>
                  <Text>{post.text}</Text>
                </CardContent>
                <CardFooter style={styles.cardFooter}>
                  <View style={styles.footerStats}>
                    <View style={styles.statItem}>
                      <TouchableOpacity onPress={() => handleLike(post._id)}>
                        {post.likes.includes(currentUser.username) ? (
                          <HeartFilled />
                        ) : (
                          <HeartOutline />
                        )}
                      </TouchableOpacity>
                      <Text style={styles.footerText}>{post.likes?.length || 0} likes</Text>
                    </View>
                    <View style={styles.statItem}>
                      <TouchableOpacity onPress={() => toggleCommentBox(post._id)}>
                        <MessageCircle />
                      </TouchableOpacity>
                      <Text style={styles.footerText}>{post.commands?.length || 0} Comments</Text>
                    </View>
                  </View>

                  {/* Comment Box */}
                  {commentBoxVisible[post._id] && (
                    <View style={styles.commentBox}>
                      <TextInput
                        placeholder="Write a comment..."
                        value={commentTexts[post._id] || ''}
                        onChangeText={(text) => handleCommentTextChange(post._id, text)}
                        style={styles.commentInput}
                      />
                      <TouchableOpacity onPress={() => submitComment(post._id)}>
                        <Text style={styles.postCommentButton}>Post Comment</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {/* Display Comments */}
                  {post.commands.map((comment, idx) => (
                    <View key={idx} style={styles.commentItem}>
                      <Text style={styles.commentUser}>{comment.username}</Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  ))}

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
    backgroundColor: theme.colors.primary,
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
  commentBox: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  postCommentButton: {
    color: '#007BFF',
    textAlign: 'center',
  },
  commentItem: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  commentUser: {
    fontWeight: '600',
  },
  commentText: {
    marginTop: 4,
    fontSize: 14,
  },


});