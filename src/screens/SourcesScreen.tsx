import React from 'react';
import {
  Text,
  StyleSheet,
  Linking,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import i18n from '../shared/config/i18n';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

const SourcesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={i18n.t('Information Sources')} />
      <ScrollView style={{flex: 1, padding: 15}}>
        {/*<CustomText style={styles.title}>{i18n.t('Information Sources')}</CustomText>*/}
        <CustomText style={styles.intro}>
          {i18n.t('Our app sources data from reliable sources such as:')}
        </CustomText>

        <CustomText style={styles.header}>
          {i18n.t('Websites of authoritative medical organizations:')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://www.who.int/health-topics/nutrition')
          }>
          {i18n.t('World Health Organization (WHO)')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() => Linking.openURL('https://www.nih.gov/')}>
          {i18n.t('National Institutes of Health (NIH)')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() => Linking.openURL('https://www.cdc.gov/')}>
          {i18n.t('Centers for Disease Control and Prevention (CDC)')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() => Linking.openURL('https://www.eatright.org/')}>
          {i18n.t('Academy of Nutrition and Dietetics (AND)')}
        </CustomText>

        <CustomText style={styles.header}>
          {i18n.t('Scientific journals:')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://www.mdpi.com/journal/nutrients')
          }>
          {i18n.t('Nutrients')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() => Linking.openURL('https://ajcn.nutrition.org/')}>
          {i18n.t('The American Journal of Clinical Nutrition')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://portal.issn.org/resource/ISSN/1541-6100')
          }>
          {i18n.t('The Journal of Nutrition')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://onlinelibrary.wiley.com/journal/1930739x')
          }>
          {i18n.t('Obesity')}
        </CustomText>

        {/*<CustomText style={styles.header}>*/}
        {/*  {i18n.t('3. Books written by reputable medical professionals:')}*/}
        {/*</CustomText>*/}
        {/*<CustomText*/}
        {/*  style={styles.link}*/}
        {/*  onPress={() =>*/}
        {/*    Linking.openURL(*/}
        {/*      'https://www.ozon.ru/product/stend-dlya-sadika-obuchayushchiy-piramida-zdorovogo-pitaniya-600h850mm-1269809805/',*/}
        {/*    )*/}
        {/*  }>*/}
        {/*  {i18n.t('"Nutrition Pyramid" - Margarita Koroleva')}*/}
        {/*</CustomText>*/}
        <CustomText
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              'https://www.ozon.ru/category/maykl-greger-kak-ne-umeret/',
            )
          }>
          {i18n.t('"How Not to Die" - Michael Greger')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              'https://www.ozon.ru/category/kitayskoe-issledovanie/',
            )
          }>
          {i18n.t(
            '"The China Study" - T. Colin Campbell and Thomas M. Campbell II',
          )}
        </CustomText>

        <CustomText style={styles.header}>
          {i18n.t('Apps and websites on healthy eating:')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() => Linking.openURL('https://www.myfitnesspal.com/')}>
          {i18n.t('MyFitnessPal')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://www.loseit.com/how-it-works/')
          }>
          {i18n.t('Lose It!')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() => Linking.openURL('https://www.fatsecret.com/')}>
          {i18n.t('FatSecret')}
        </CustomText>
        <CustomText
          style={styles.link}
          onPress={() => Linking.openURL('https://www.eatthismuch.com/')}>
          {i18n.t('Eat This Much')}
        </CustomText>

        <CustomText style={styles.warning}>
          {i18n.t(
            'Important: Before starting a new diet, it is important to consult with a doctor or dietitian to ensure it is suitable for you. Not all diets are suitable for everyone, and what works for one person may not work for another.',
          )}
        </CustomText>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  intro: {
    fontSize: 14,
    marginBottom: 16,
    color: '#505050',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#505050',
  },
  link: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  warning: {
    marginTop: 20,
    fontSize: 14,
    color: 'red',
    marginBottom: 30,
  },
});

export default SourcesScreen;
