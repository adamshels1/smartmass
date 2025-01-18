import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {deleteUserDetails} from 'entities/userDetails/model/slices/userDetailsSlice.ts';
import i18n from 'i18next';
import {fetchLogout} from 'entities/auth/model/authSlice.ts';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider';

export const DeleteAccountButton: React.FC = () => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const status = useSelector((state: RootState) => state.userDetails.status);
  const [confirmationText, setConfirmationText] = useState('');
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    await dispatch(deleteUserDetails());
    actionSheetRef.current?.hide();
    dispatch(fetchLogout());
  };

  return (
    <View style={styles.container}>
      {/*<TouchableOpacity onPress={() => actionSheetRef.current?.show()}>*/}
      {/*  <CustomText style={styles.deleteButtonText}>*/}
      {/*    {i18n.t('Delete Account')}*/}
      {/*  </CustomText>*/}
      {/*</TouchableOpacity>*/}

      <TouchableOpacity
        onPress={() => actionSheetRef.current?.show()}
        style={styles.sectionItem}>
        <CustomText style={styles.sectionItemText}>
          {i18n.t('Delete Account')}
        </CustomText>
        <Image
          style={styles.inputIcon}
          source={require('shared/assets/icons/chevron-right.png')}
        />
      </TouchableOpacity>

      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        containerStyle={styles.sheetContainer}>
        <ScrollView style={styles.sheetContent}>
          <CustomText style={styles.title}>
            {i18n.t('Are you sure you want to delete your account?')}
          </CustomText>
          <CustomTextInput
            placeholder={i18n.t('Type "delete" to confirm')}
            value={confirmationText}
            onChangeText={setConfirmationText}
          />
          <CustomButton
            title={i18n.t('Confirm Deletion')}
            onPress={handleDelete}
            disabled={confirmationText !== 'delete'}
            loading={status === 'loading'}
          />
          <CustomButton
            title={i18n.t('Cancel')}
            onPress={() => actionSheetRef.current?.hide()}
          />
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 20,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  sheetContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  sectionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionItemText: {
    fontSize: 16,
    color: 'red',
  },
  inputIcon: {
    width: 24,
    height: 24,
  },
});
