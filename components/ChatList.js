import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Компонент для анимированного переходов
const AnimatedChatItem = ({ item, index, navigation }) => {
  const translateY = useState(new Animated.Value(50))[0];
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.chatItemWrapper,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity style={styles.chatItem}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.online && <View style={styles.onlineIndicator} />}
          {item.isCalling && <View style={styles.callingIndicator} />}
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
          
          <View style={styles.messageRow}>
            <View style={styles.messageContent}>
              {item.lastMessageType === 'call' && (
                <Icon 
                  name={item.lastCallType === 'video' ? 'video' : 'phone'} 
                  size={14} 
                  color={item.missedCall ? '#ff3b30' : '#0088cc'} 
                  style={styles.callIcon}
                />
              )}
              <Text 
                style={[
                  styles.lastMessage,
                  item.missedCall && styles.missedCallText
                ]} 
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>
            
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.callButtons}>
          <TouchableOpacity
            style={styles.audioCallButton}
            onPress={() => navigation.navigate('CallScreen', { 
              contact: item,
              type: 'audio'
            })}
          >
            <Icon name="phone" size={20} color="#0088cc" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.videoCallButton}
            onPress={() => navigation.navigate('CallScreen', { 
              contact: item,
              type: 'video'
            })}
          >
            <Icon name="video" size={20} color="#0088cc" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const chats = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Audio call • 5:24',
    lastMessageType: 'call',
    lastCallType: 'audio',
    time: '14:30',
    unread: 2,
    online: true,
    missedCall: false,
    isCalling: false,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Missed video call',
    lastMessageType: 'call',
    lastCallType: 'video',
    time: '18:15',
    unread: 0,
    online: false,
    missedCall: true,
    isCalling: true,
  },
  {
    id: '3',
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?img=8',
    lastMessage: 'See you at 15:00 for the video call!',
    lastMessageType: 'text',
    time: '10:20',
    unread: 1,
    online: true,
    missedCall: false,
    isCalling: false,
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Audio call • 12:45',
    lastMessageType: 'call',
    lastCallType: 'audio',
    time: 'Вчера',
    unread: 0,
    online: false,
    missedCall: false,
    isCalling: false,
  },
];

export default function ChatList() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchAnim = useState(new Animated.Value(0))[0];

  const handleSearchToggle = () => {
    const toValue = isSearching ? 0 : 1;
    setIsSearching(!isSearching);
    
    Animated.spring(searchAnim, {
      toValue,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const renderChatItem = ({ item, index }) => (
    <AnimatedChatItem 
      item={item} 
      index={index} 
      navigation={navigation} 
    />
  );

  return (
    <View style={styles.container}>
      {/* Хедер с анимированным поиском */}
      <View style={styles.header}>
        <Text style={styles.title}>Telegram</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleSearchToggle}
          >
            <Icon name="magnify" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="dots-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Анимированный поиск */}
      <Animated.View 
        style={[
          styles.searchContainer,
          {
            height: searchAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 60]
            }),
            opacity: searchAnim,
            marginBottom: searchAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 16]
            }),
          }
        ]}
      >
        <View style={styles.searchContent}>
          <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats and calls"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={isSearching}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      {/* Быстрый доступ к звонкам */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => navigation.navigate('CallHistory')}
        >
          <View style={styles.quickActionIcon}>
            <Icon name="phone" size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Calls</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Icon name="account-group" size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Groups</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Icon name="star" size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Favorites</Text>
        </TouchableOpacity>
      </View>
      
      {/* Список чатов */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      {/* Кнопка нового звонка */}
      <TouchableOpacity
        style={styles.newCallButton}
        onPress={() => navigation.navigate('CallScreen', {
          contact: { name: 'New Call', avatar: '' },
          type: 'audio'
        })}
      >
        <Icon name="phone-plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0088cc',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    marginBottom: 8,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0088cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 8,
  },
  chatItemWrapper: {
    paddingHorizontal: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  callingIndicator: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff3b30',
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  timeBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  time: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  callIcon: {
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  missedCallText: {
    color: '#ff3b30',
  },
  unreadBadge: {
    backgroundColor: '#0088cc',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  callButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  audioCallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 136, 204, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 136, 204, 0.3)',
  },
  videoCallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 136, 204, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 136, 204, 0.3)',
  },
  newCallButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0088cc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0088cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
