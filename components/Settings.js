import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.setting}>
        <Icon name="shield-check" size={24} color="#0088cc" />
        <Text style={styles.settingText}>End-to-end Encryption</Text>
        <Text style={styles.settingStatus}>Active</Text>
      </View>
      
      <View style={styles.setting}>
        <Icon name="video" size={24} color="#0088cc" />
        <Text style={styles.settingText}>Video Quality</Text>
        <Text style={styles.settingStatus}>Auto</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Telegram Calls App</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  settingStatus: {
    color: '#0088cc',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  version: {
    color: '#444',
    fontSize: 12,
    marginTop: 4,
  },
});
