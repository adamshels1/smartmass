import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import {RootState} from 'app/providers/StoreProvider/config/store';
import {QrCodeSvg} from 'react-native-qr-svg';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import i18n from 'i18next';

const MyReferral: React.FC = () => {
  const userId = useSelector(
    (state: RootState) => state.userDetails.userDetails.userId,
  );

  const referralLink = `https://smartmass.app.link?ref=${userId}`;
  const copyText = i18n.t(
    'Smart Mass – твой персональный помощник в питании!\\n\\n- Выбери цель: похудение, набор веса или поддержание формы.\\n- Введи свои параметры – ИИ рассчитает твою норму калорий.\\n- Получи готовый план питания на день.\\n- Автоматически сформированный список продуктов упростит покупки.\\n\\nСсылка: {{referralLink}}\\n\\nКак это работает:\\n\\n1. Поделись ссылкой на приложение с друзьями.\\n2. За каждого приглашенного пользователя, который покупает подписку, ты получаешь 20% от стоимости подписки, это $1. Если ты пригласишь 1000 человек, ежемесячно ты будешь получать $1000 - неплохая сумма, согласись?\\n\\nСовмещай здоровое питание и заработок вместе!',
    {referralLink},
  );

  const copyToClipboard = () => {
    Clipboard.setString(copyText);
    Alert.alert(
      i18n.t('Ссылка скопирована'),
      i18n.t('Вы можете отправить её друзьям!'),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {i18n.t('Приглашай друзей и зарабатывай деньги!')}
      </Text>
      <QrCodeSvg
        gradientColors={['#31D6D6', '#ff0000']}
        value={referralLink}
        frameSize={170}
      />
      <Text style={styles.footer}>
        {i18n.t(
          'Как это работает:\n\n1. Поделись ссылкой на приложение с друзьями.\n2. За каждого приглашенного пользователя, который покупает подписку, ты получаешь 20% от стоимости подписки, это $1. Если ты пригласишь 1000 человек, ежемесячно ты будешь получать $1000 - неплохая сумма, согласись?\n\nСовмещай здоровое питание и заработок вместе!',
          {referralLink},
        )}
      </Text>
      <CustomButton
        style={{width: 200}}
        title={i18n.t('Скопировать ссылку')}
        onPress={copyToClipboard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#374151',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 16,
  },
  footer: {
    fontSize: 14,
    // textAlign: 'center',
    color: '#6B7280',
    marginVertical: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default MyReferral;
