import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { sendMessage, listenForMessages } from '../../services/chatService';

const InAppChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    listenForMessages((newMessages) => {
      setMessages(newMessages);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
  }, []);

  const handleSendMessage = () => {
    if (text.trim()) {
      sendMessage(text.trim());
      setText('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageCard}>
      <Text style={styles.senderName}>{item.senderName}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeStamp}>
        {item.createdAt?.toDate?.().toLocaleString?.() || ''}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Message list */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />

            {/* Input box */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Type a message"
                placeholderTextColor="#999"
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
                returnKeyType="send"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <FontAwesome name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageCard: {
    backgroundColor: '#f2f2f2',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444',
  },
  messageText: {
    fontSize: 15,
  },
  timeStamp: {
    marginTop: 5,
    fontSize: 11,
    color: '#888',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 25,
  },
});

export default InAppChatScreen;
