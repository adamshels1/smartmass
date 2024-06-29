import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import i18n from '../shared/config/i18n';
import {sendMessage} from 'entities/chat/model/services/sendMessage';

import Header from '../components/Header';
import CurrentWeek from 'features/chat/ui/CurrentWeek';
import ChatInput from 'features/chat/ui/ChatInput';
import InformationSourcesButton from 'features/chat/ui/InformationSourcesButton';
import MessageButtons from 'features/chat/ui/MessageButtons';
import ResetChatButton from 'features/chat/ui/ResetChatButton';
import {Message} from '../features/chat/index.ts';
import {Flow} from 'react-native-animated-spinkit';

export default function ChatScreen({navigation}) {
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.chat.selectedDate);
  const isBotWriting = useSelector(state => state.chat.isBotWriting);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef(null);
  const userData = useSelector(state => state.userData);
  const tooltipStep = useSelector(state => state.userData.tooltipStep);

  const day = useSelector(state =>
    state.userData?.days?.find(day =>
      moment(day.date).isSame(moment(selectedDate), 'day'),
    ),
  );

  useEffect(() => {
    const getDeviceId = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      analytics().setUserId(deviceId);
    };

    getDeviceId();
    analytics().logEvent('screen_view', {screen_name: 'Home'});

    return () => {};
  }, []);

  const messages = day?.messages || [];
  const isHasSettingsData =
    userData.weight && userData.height && userData.goal && userData.allergies;

  useEffect(() => {
    if (!isHasSettingsData) {
      navigation.navigate('SettingsScreen');
    }
  }, [isHasSettingsData, navigation]);

  const handleSendMessage = async ({
    messageText,
    messageTextVisible,
    nextStep = null,
    changedDiet,
    meal,
  }) => {
    await dispatch(
      sendMessage({
        messageText,
        messageTextVisible,
        nextStep,
        changedDiet,
        meal,
        chatMessagesRef: flatListRef.current,
      }),
    );
  };

  const renderMessage = ({item}) => <Message item={item} />;

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <Header
          showBack={false}
          navigation={navigation}
          title={
            userData.calories
              ? i18n.t('Goal for {{date}}: {{calories}}kcal', {
                  date: moment(selectedDate).format('DD.MM.YYYY'),
                  calories: userData.calories,
                })
              : i18n.t('Nutrition consultant GPT')
          }
          showSettingsIcon={true}
        />
        <CurrentWeek />
        <ResetChatButton />
        <View style={styles.container}>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
            ListFooterComponent={
              <View style={{marginBottom: 10}}>
                {isBotWriting && (
                  <Flow style={{marginLeft: 15}} size={48} color="#A1A1A1" />
                )}
                <MessageButtons
                  chatMessagesRef={flatListRef.current}
                  tooltipStep={tooltipStep}
                  handleSendMessage={handleSendMessage}
                />
                <InformationSourcesButton />
              </View>
            }
          />
          <ChatInput
            messageText={messageText}
            disabledSendButton={Boolean(messageText && !isBotWriting)}
            onChangeText={setMessageText}
            onSendMessage={() => handleSendMessage({messageText})}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});
