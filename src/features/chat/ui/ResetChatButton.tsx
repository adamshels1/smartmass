import React from 'react';
import {View, Button} from 'react-native';
import i18n from 'shared/config/i18n';
import {
  clearDays,
  setCalories,
  setCart,
  setMessagesAction,
  setStepAction,
  setTooltipStep,
} from 'store/userActions.js';
import {useDispatch, useSelector} from 'react-redux';

interface ResetChatButtonProps {}

const ResetChatButton: React.FC<ResetChatButtonProps> = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.chat.selectedDate);

  const handleResetChat = async () => {
    try {
      dispatch(setMessagesAction([]));
      dispatch(setStepAction(0, selectedDate));
      dispatch(clearDays());
      dispatch(setCart([]));
      dispatch(setTooltipStep('showGetCaloriesButton'));
      dispatch(setCalories(null));
    } catch (error) {
      console.error('Error resetting chat data:', error);
    }
  };

  // Ensure the component always returns a valid React element or null
  if (__DEV__) {
    return (
      <View>
        <Button title={i18n.t('Clear all')} onPress={handleResetChat} />
      </View>
    );
  }

  return null;
};

export default ResetChatButton;
