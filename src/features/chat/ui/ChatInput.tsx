import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import i18n from 'shared/config/i18n';

interface RenderMessageProps {
  messageText: string;
  disabledSendButton: boolean;
  onChangeText: (text: string) => void;
  onSendMessage: () => void;
}

const ChatInput: React.FC<RenderMessageProps> = ({
  messageText,
  disabledSendButton,
  onChangeText,
  onSendMessage,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={i18n.t('Type a message...')}
        placeholderTextColor="#A1A1A1"
        onChangeText={onChangeText}
        value={messageText}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="center"
      />
      <TouchableOpacity
        onPress={onSendMessage}
        disabled={!disabledSendButton}
        style={{opacity: disabledSendButton ? 1 : 0.5}}>
        <Image
          style={{width: 30, height: 30}}
          source={require('shared/assets/icons/send.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 40,
    minHeight: 56,
    // Тень для Android
    elevation: 5,
    // Тень для iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    marginRight: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 40,
    fontSize: 13,
    paddingTop: 12,
    color: '#3E423A',
  },
});

export default ChatInput;
