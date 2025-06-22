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
  FlatList,
  Dimensions,
} from 'react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../components/Card';
import { MessageCircle, HeartOutline, HeartFilled, FilterIcon } from '../components/Icon';
import { imageMapping } from '../helpers/avatar';
import { theme } from '../core/theme'; 
import { URL } from '@env';
import { api } from '../api';
import * as ImagePicker from 'expo-image-picker';
import { moodOptions } from '../helpers/moods';

const screenWidth = Dimensions.get('window').width;



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
  const [postImage, setPostImage] = useState(null);
const [selectedMood, setSelectedMood] = useState(null);

const pickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.status !== 'granted') {
    alert('נדרש אישור לגשת לגלריה כדי להוסיף תמונה לפוסט');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  if (!result.canceled) {
    setPostImage(result.assets[0].uri);
  }
};

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
      console.log('Error fetching posts:', error.message);
      Alert.alert('Error', 'ישנה בעיה לעלות את הפוסטים');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostText.trim()) {
      Alert.alert('Error', 'פוסט חייב להכיל בתוכו מלל');
      return;
    }
  
    try {
      await api('/feed/write_post', {
        method: 'POST',
        body: JSON.stringify({
          text: newPostText.trim(),
          mood: selectedMood,
        }),
      });
  
      Alert.alert('הפוסט נשלח לאישור מנהל', 'לאחר אישורו, הוא יתפרסם בקהילה.');
      fetchPosts();
      setNewPostText('');
      setSelectedMood(null);
    } catch (error) {
      console.log('Error creating post:', error.message);
      Alert.alert('Error', 'הפוסט לא נוצר בהצלחה');
    }
  };

  const MoodSelector = () => (
  <View style={{ marginTop: 8 }}>
    <Text style={{ fontSize: 14, marginBottom: 4 }}>מה מצב הרוח שלך כרגע?</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {moodOptions.map((mood) => (
        <TouchableOpacity
          key={mood.label}
          onPress={() => setSelectedMood(mood.label)}
          style={{
            padding: 8,
            borderRadius: 12,
            backgroundColor: selectedMood === mood.label ? '#A0D2DB' : '#F0F0F0',
          }}>
          <Text style={{ fontSize: 16 }}>{mood.icon}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
  
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
      console.log('Error liking post:', error);
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

  const [filterMood, setFilterMood] = useState(null);

const filteredPosts = filterMood
  ? posts.filter((post) => post.mood === filterMood)
  : posts;

const MoodFilter = () => (
  <View style={styles.moodFilterWrapper}>
    <View style={styles.moodFilterTitleRow}>
      <FilterIcon />
      <Text style={styles.moodFilterTitle}>סינון לפי מצב רוח</Text>
    </View>
    <View style={styles.moodFilterGrid}>
      {moodOptions.map((mood) => (
        <TouchableOpacity
          key={mood.label}
          onPress={() => setFilterMood(mood.label === filterMood ? null : mood.label)}
          style={[
            styles.moodFilterButton,
            { backgroundColor: mood.label === filterMood ? '#6EC6CA' : '#EEE' },
          ]}
        >
          <Text style={styles.moodFilterText}>{mood.icon} {mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);



  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea}>
        <View style={styles.contentContainer}>
    

          {/* Post Creation */}
          <Card>
            <CardHeader style={styles.createPostContainer}>
              <Avatar size={50} uri={currentUser.selectedImage} />

              <View style={styles.textAreaContainer}>
                <TextInput
                  placeholder="כתבו פוסט, התייעצו או שתפו את הקהילה"
                  style={styles.createPostInput}
                  multiline
                  value={newPostText}
                  onChangeText={setNewPostText}
                  textAlign="right"
                />

                {postImage && (
                  <Image source={{ uri: postImage }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
                )}

                <View style={styles.postActions}>
                  {/* <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.postActionText}>📷 תמונה</Text>
                  </TouchableOpacity> */}

                  {postImage && (
                    <Image
                      source={{ uri: postImage }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 10,
                        marginTop: 8,
                      }}
                    />
                  )}

                </View>
  <MoodSelector />

              <View style={{ alignItems: 'flex-start' , marginTop: 3  , marginBottom:3}}>
                <TouchableOpacity style={styles.postSubmitButton} onPress={createPost}>
                  <Text style={styles.postSubmitText}>פרסם</Text>
                </TouchableOpacity>
              </View>

              </View>
            </CardHeader>
          </Card>

          <MoodFilter />



          {/* Loading Spinner */}
          {loading && <ActivityIndicator size="large" color="#560CCE" />}

          {/* Display Posts */}
          {!loading &&
            filteredPosts.map((post, index) => (
              <Card key={index}>
                <CardHeader style={styles.cardHeader}>
                  <View style={styles.postHeaderRow}>
                    <Avatar size={40} uri={post.user_image} />
                    <View style={styles.userInfoContainer}>
                      <Text style={styles.userName}>{post.user}</Text>
                      {post.mood && (
                        <Text style={styles.userMood}>{moodOptions.find(m => m.label === post.mood)?.icon}</Text>
                      )}
                    </View>
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
                        placeholder="כתוב תגובה..."
                        value={commentTexts[post._id] || ''}
                        onChangeText={(text) => handleCommentTextChange(post._id, text)}
                        style={styles.commentInput}
                      />
                      <TouchableOpacity onPress={() => submitComment(post._id)}>
                        <Text style={styles.postCommentButton}>הוסף תגובה</Text>
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
    backgroundColor: '#EAF4F4',
    direction:'rtl',
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    textAlign: 'right',
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
    textAlign: 'right',
  },
addPostButton: {
  backgroundColor: theme.colors.primary,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  elevation: 2,
},
addPostText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
},

userContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  paddingVertical: 4,
},
userName: {
  fontWeight: '600',
  fontSize: 16,
  color: '#003F5C',
  textAlign: 'right',
},


cardContent: {
  marginVertical: 12,
  paddingHorizontal: 4,
  fontSize: 15,
  lineHeight: 22,
  color: '#333',
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
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#A0D2DB',
  borderRadius: 12,
  padding: 10,
},
commentInput: {
  borderWidth: 1,
  borderColor: '#CCE5E5',
  borderRadius: 20,
  padding: 10,
  backgroundColor: '#FAFAFA',
  marginBottom: 10,
  textAlign: 'right',
},

  postCommentButton: {
    color: '#007BFF',
    textAlign: 'center',
  },
  commentItem: {
  marginTop: 8,
  padding: 10,
  backgroundColor: '#F0F7F7',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#DCEEEE',
},
commentUser: {
  fontWeight: 'bold',
  fontSize: 14,
  color: '#2D6A6A',
},
commentText: {
  marginTop: 4,
  fontSize: 14,
  color: '#333',
},
createPostContainer: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
  paddingBottom: 8,
},

textAreaContainer: {
  flex: 1,
  flexDirection: 'column',
  gap: 8,
},

createPostInput: {
  backgroundColor: '#F2F2F2',
  borderRadius: 12,
  padding: 12,
  fontSize: 15,
  minHeight: 60,
  textAlignVertical: 'top',
  color: '#333',
},

postActions: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: 16,
},

postActionText: {
  fontSize: 14,
  color: '#007BFF',
},

postSubmitButton: {
  backgroundColor: theme.colors.primary,
  paddingVertical: 8,
  paddingHorizontal: 20,
  borderRadius: 20,
  marginTop: 4,

  elevation: 2,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.15,
shadowRadius: 3,

},

postSubmitText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '600',
},

 moodFilterWrapper: {
    marginBottom: 16,
  },
  moodFilterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  moodFilterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moodFilterContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 10,
    minWidth: screenWidth,
  },
  moodFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  moodFilterText: {
    fontSize: 14,
    color: '#003F5C',
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 8,
  },
  userMood: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  moodFilterGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  justifyContent: 'flex-start',
  paddingHorizontal: 12,
},


});