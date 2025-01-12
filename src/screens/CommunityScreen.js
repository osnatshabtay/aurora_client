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
import { URL } from '@env';

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
      const response = await fetch(`${URL}:8000/feed/all_posts`);
      const data = await response.json();
      setPosts(data.posts);
      setCurrentUser({
        username: data.current_username,
        selectedImage: data.current_username_image,
      });
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
      const response = await fetch(`${URL}:8000/feed/write_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newPostText.trim(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Post created successfully.');
        fetchPosts(); // Refresh posts after creating a new one
        setNewPostText('');
      } else {
        Alert.alert('Error', 'Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post.');
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${URL}:8000/feed/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
        }),
      });

      if (response.ok) {
        updatePostLikes(postId); // Update the UI
      } else {
        Alert.alert('Error', 'Failed to like the post.');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like the post.');
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
      Alert.alert('Error', 'Comment text cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${URL}:8000/feed/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          text: commentText,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Comment added successfully.');
        setCommentTexts((prev) => ({
          ...prev,
          [postId]: '',
        }));
        setCommentBoxVisible((prev) => ({
          ...prev,
          [postId]: false,
        }));
        fetchPosts();
      } else {
        Alert.alert('Error', 'Failed to add comment.');
      }
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


});