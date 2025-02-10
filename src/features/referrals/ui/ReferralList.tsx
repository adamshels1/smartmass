import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchUserReferrals} from 'features/referrals/model/slices/referralsSlice';
import {RootState} from 'app/providers/StoreProvider/config/store';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import moment from 'moment';
import i18n from 'i18next';
import {NoAvatarIcon} from 'shared/assets/icons';

const ReferralList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {referrals, status, error} = useSelector(
    (state: RootState) => state.referrals,
  );

  useEffect(() => {
    dispatch(fetchUserReferrals());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <Text>{i18n.t('Загрузка...')}</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  const countReferrals = referrals.length;
  const potentialIncome = countReferrals * 1;

  return (
    <View style={styles.container}>
      <Text style={styles.incomeText}>
        {i18n.t('Потенциальный доход в месяц: {{potentialIncome}}$', {
          potentialIncome,
        })}
      </Text>
      <FlatList
        data={referrals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, _}) => (
          <View style={styles.itemContainer}>
            <NoAvatarIcon style={styles.avatar} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.registrationDate}>
                {moment(item.createdAt).format('YYYY-MM-DD HH:mm')} |{' '}
                {item.city}
              </Text>
            </View>
            <Text style={styles.distance}>1$</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  incomeText: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  index: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    width: 24,
    textAlign: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#374151',
  },
  registrationDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  distance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  avatar: {marginRight: 15},
});

export default ReferralList;
