import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ImagePexels from '../../../shared/ui/ImageByDescription/ui/ImagePixabay.tsx';
import {sortByTime} from '../../../utils/sort.js';
import {Meal, MessageItem} from '../model/types/diet.ts';

interface RenderMessageProps {
  item: MessageItem;
}

const Message: React.FC<RenderMessageProps> = ({item}) => {
  console.log('item', item);
  const {data, role, parts} = item;
  const isUser = role === 'user';
  const wrapStyle = [
    styles.message,
    isUser ? styles.userMessage : styles.otherMessage,
  ];
  const textStyle = isUser ? styles.userMessageText : styles.otherMessageText;

  if (data?.type === 'diet') {
    return (
      <View style={wrapStyle}>
        {sortByTime(data.diet).map((item: Meal, key: number) => (
          <View style={styles.mealContainer} key={key}>
            <ImagePexels
              description={item.dishEn}
              imageStyle={styles.mealImage}
              width={80}
              height={80}
            />
            <View style={styles.mealTextContainer}>
              <Text style={[textStyle, styles.mealTimeText]}>
                {item.time} - {item.name}
              </Text>
              <Text style={textStyle}>
                {item.dish} - {item.dishCalories}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (data?.type === 'recipe') {
    return (
      <View style={wrapStyle}>
        {data?.meal && (
          <View style={{alignItems: 'center', marginBottom: 10}}>
            <ImagePexels
              description={data?.meal?.dishEn}
              imageStyle={styles.mealImageMedium}
              width={200}
              height={200}
            />
          </View>
        )}

        <Text style={textStyle}>{parts?.[0]?.text}</Text>
      </View>
    );
  }
  return (
    <View style={wrapStyle}>
      <Text style={textStyle}>{parts?.[0]?.text?.replace(/[*]/g, '•')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '90%',
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
    minWidth: '50%',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '300',
    width: 200,
  },
  otherMessageText: {
    color: '#505050',
    fontSize: 13,
    fontWeight: '300',
    width: 200,
  },
  mealContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  mealImage: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  mealImageMedium: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  mealTextContainer: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  mealTimeText: {
    fontWeight: '500',
  },
});

export default Message;
