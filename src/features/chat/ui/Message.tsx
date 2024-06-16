import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface MessageItem {
  role: 'user' | 'other';
  parts?: {text: string}[];
}

interface RenderMessageProps {
  item: MessageItem;
}

const RenderMessage: React.FC<RenderMessageProps> = ({item}) => {
  return (
    <View
      style={[
        styles.message,
        item.role === 'user' ? styles.userMessage : styles.otherMessage,
      ]}>
      <Text
        style={
          item.role === 'user'
            ? styles.userMessageText
            : styles.otherMessageText
        }>
        {item?.parts?.[0]?.text?.replace(/[*]/g, '•')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#67CFCF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#EEEEEE',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
    maxWidth: '85%',
    minWidth: '50%',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '300',
  },
  otherMessageText: {
    color: '#505050',
    fontSize: 13,
    fontWeight: '300',
  },
});

export default RenderMessage;
