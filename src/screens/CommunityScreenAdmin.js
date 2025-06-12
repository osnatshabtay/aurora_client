import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../components/Card';
import { MessageCircle, HeartOutline, HeartFilled, FilterIcon } from '../components/Icon';
import { imageMapping } from '../helpers/avatar';
import { theme } from '../core/theme';
import { URL } from '@env';
import { api } from '../api';
import { moodOptions } from '../helpers/moods';
import BackButton from '../components/BackButton'; 
import { useNavigation } from '@react-navigation/native';



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

export default function CommunityScreenAdmin() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    username: 'anonymous',
    selectedImage: 'boy_avatar1.png',
  });

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

  const [filterMood, setFilterMood] = useState(null);

  const filteredPosts = filterMood
    ? posts.filter((post) => post.mood === filterMood)
    : posts;

  const MoodFilter = () => (
    <View style={styles.moodFilterWrapper}>
      <View style={styles.moodFilterTitleRow}>
        <FilterIcon />
        <Text style={styles.moodFilterTitle}>סנן לפי מצב רוח</Text>
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
      <BackButton goBack={navigation.goBack} />
      <ScrollView style={styles.scrollArea}>
        <View style={styles.contentContainer}>
          <MoodFilter />

          {loading && <ActivityIndicator size="large" color="#560CCE" />}

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
                      <HeartOutline />
                      <Text style={styles.footerText}>{post.likes?.length || 0} likes</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MessageCircle />
                      <Text style={styles.footerText}>{post.commands?.length || 0} Comments</Text>
                    </View>
                  </View>

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
    paddingTop:80
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