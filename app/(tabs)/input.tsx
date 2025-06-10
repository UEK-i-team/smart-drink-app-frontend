import { ArrowUp, Camera, SlidersHorizontal } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function InputScreen() {
  const [message, setMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        if (Platform.OS !== 'web') {
          setKeyboardHeight(e.endCoordinates.height);
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handleCameraPress = () => {
    if (Platform.OS !== 'web') {
      // Native camera functionality would go here
      console.log('Camera pressed');
    } else {
      // Web alternative - could trigger file input
      console.log('Camera pressed - web alternative');
    }
  };

  const handleMicPress = () => {
    if (Platform.OS !== 'web') {
      // Native audio recording would go here
      console.log('Microphone pressed');
    } else {
      // Web alternative - could use Web Audio API
      console.log('Microphone pressed - web alternative');
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const getInputContainerStyle = () => {
    if (Platform.OS === 'web') {
      return styles.inputContainer;
    }

    if (keyboardHeight > 0) {
      // Position input just above keyboard, accounting for tab bar height
      const tabBarHeight = 60; // Height of the tab bar
      return [
        styles.inputContainer,
        {
          bottom: keyboardHeight - tabBarHeight,
          position: 'absolute',
        },
      ];
    }

    return styles.inputContainer;
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <Text style={styles.headerSubtitle}>{mockUsers.length} members</Text>
      </View> */}

      {/* Users List
      <ScrollView
        style={styles.usersList}
        contentContainerStyle={[
          styles.usersListContent,
          {
            paddingBottom: keyboardHeight > 0 ? 20 : 100, // Adjust padding based on keyboard
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {mockUsers.map(renderUser)}
      </ScrollView> */}

      {/* Bottom Input Component */}
      <View style={getInputContainerStyle()}>
        <View style={styles.inputWrapper}>
          {/* Text Input Section */}
          <View style={styles.textInputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              blurOnSubmit={false}
              textAlignVertical="top"
            />

            {/* Action Icons Row */}
            <View style={styles.actionIconsRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleCameraPress}
                activeOpacity={0.7}
              >
                <Camera size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleMicPress}
                activeOpacity={0.7}
              >
                <SlidersHorizontal size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, { opacity: message.trim() ? 1 : 0.5 }]}
            onPress={handleSendMessage}
            activeOpacity={0.8}
            disabled={!message.trim()}
          >
            <ArrowUp size={20} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  usersList: {
    flex: 1,
  },
  usersListContent: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 48,
  },
  textInputSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#111827',
    minHeight: 24,
    maxHeight: 80,
    lineHeight: 20,
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  actionIconsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    alignSelf: 'center',
    shadowColor: '#FF5722',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
