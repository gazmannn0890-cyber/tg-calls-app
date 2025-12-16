import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function CallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact, type = 'audio' } = route.params || {};
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rocketAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  
  const intervalRef = useRef();
  const cameraRef = useRef();

  // Анимация ракеты при соединении
  useEffect(() => {
    if (callStatus === 'Connecting...') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rocketAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rocketAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Имитация соединения
      setTimeout(() => {
        setCallStatus('In Progress');
        startCallTimer();
      }, 3000);
    }
  }, [callStatus]);

  // Таймер звонка
  const startCallTimer = () => {
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setCallDuration(elapsed);
    }, 1000);
  };

  // Запрос разрешения камеры
  useEffect(() => {
    (async () => {
      if (type === 'video') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      }
    })();
  }, [type]);

  // Панорамирование для видео-окна
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: pan.x,
        dy: pan.y,
      }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    navigation.goBack();
  };

  // Анимация появления
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Размытый фон с аватаркой */}
      <Image 
        source={{ uri: contact?.avatar || 'https://i.pravatar.cc/150' }} 
        style={styles.backgroundImage}
        blurRadius={50}
      />
      <BlurView intensity={80} style={StyleSheet.absoluteFill} />

      {/* Основной контент */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Информация о контакте */}
        <View style={styles.contactInfo}>
          <Image 
            source={{ uri: contact?.avatar || 'https://i.pravatar.cc/150' }} 
            style={styles.contactAvatar}
          />
          <Text style={styles.contactName}>
            {contact?.name || 'Unknown Contact'}
          </Text>
          <Text style={styles.status}>
            {callStatus === 'Connecting...' ? 'Calling...' : formatTime(callDuration)}
          </Text>
          {callStatus === 'Connecting...' && (
            <View style={styles.rocketContainer}>
              <Animated.View style={[
                styles.rocket,
                {
                  transform: [{
                    translateY: rocketAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20]
                    })
                  }]
                }
              ]}>
                <Icon name="rocket" size={40} color="#0088cc" />
              </Animated.View>
              <Text style={styles.connectingText}>End-to-end encrypted</Text>
            </View>
          )}
        </View>

        {/* Кнопки управления звонком */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Icon 
              name={isMuted ? "microphone-off" : "microphone"} 
              size={28} 
              color="#fff" 
            />
          </TouchableOpacity>

          {type === 'video' && (
            <TouchableOpacity
              style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Icon 
                name={isVideoOn ? "video" : "video-off"} 
                size={28} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            <Icon 
              name={isSpeakerOn ? "volume-high" : "volume-off"} 
              size={28} 
              color="#fff" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={endCall}
          >
            <Icon name="phone-hangup" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Окно с собственным видео для видеозвонка */}
        {type === 'video' && isVideoOn && hasCameraPermission && (
          <Animated.View
            style={[
              styles.videoPreview,
              {
                transform: [{ translateX: pan.x }, { translateY: pan.y }]
              }
            ]}
            {...panResponder.panHandlers}
          >
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              type={Camera.Constants.Type.front}
            />
            <TouchableOpacity
              style={styles.closeVideoButton}
              onPress={() => setIsVideoOn(false)}
            >
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  contactInfo: {
    alignItems: 'center',
    paddingTop: 40,
  },
  contactAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  contactName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
  },
  rocketContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  rocket: {
    marginBottom: 10,
  },
  connectingText: {
    color: '#0088cc',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  endCallButton: {
    backgroundColor: '#ff3b30',
  },
  videoPreview: {
    position: 'absolute',
    width: 120,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    right: 20,
    top: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  closeVideoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
