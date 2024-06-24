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
import {useDispatch} from 'react-redux';

interface ResetChatButtonProps {
  setIsVisibleChangePartDiet: (bool: boolean) => void;
  selectedDate: string;
}

const ResetChatButton: React.FC<ResetChatButtonProps> = ({
  setIsVisibleChangePartDiet,
  selectedDate,
}) => {
  const dispatch = useDispatch();

  const handleResetChat = async () => {
    try {
      dispatch(setMessagesAction([]));
      dispatch(setStepAction(0, selectedDate));
      dispatch(clearDays());
      dispatch(setCart([]));
      dispatch(setTooltipStep('showGetCaloriesButton'));
      dispatch(setCalories(null));
      setIsVisibleChangePartDiet(false);
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
