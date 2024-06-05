import React from 'react';
import {
  Text,
  StyleSheet,
  Linking,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import i18n from '../shared/config/i18n';

const SourcesScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBack={true}
        navigation={navigation}
        title={i18n.t('Information Sources')}
      />
      <ScrollView style={{flex: 1, padding: 15}}>
        {/*<Text style={styles.title}>Information Sources</Text>*/}
        <Text style={styles.intro}>
          Our app sources data from reliable sources such as:
        </Text>

        <Text style={styles.header}>
          1. Websites of authoritative medical organizations:
        </Text>
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://www.who.int/health-topics/nutrition')
          }>
          World Health Organization (WHO)
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.nih.gov/')}>
          National Institutes of Health (NIH)
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.cdc.gov/')}>
          Centers for Disease Control and Prevention (CDC)
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.eatright.org/')}>
          Academy of Nutrition and Dietetics (AND)
        </Text>

        <Text style={styles.header}>2. Scientific journals:</Text>
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://www.mdpi.com/journal/nutrients')
          }>
          Nutrients
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://ajcn.nutrition.org/')}>
          The American Journal of Clinical Nutrition
        </Text>
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://portal.issn.org/resource/ISSN/1541-6100')
          }>
          The Journal of Nutrition
        </Text>
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://onlinelibrary.wiley.com/journal/1930739x')
          }>
          Obesity
        </Text>

        {/*<Text style={styles.header}>*/}
        {/*  3. Books written by reputable medical professionals:*/}
        {/*</Text>*/}
        {/*<Text*/}
        {/*  style={styles.link}*/}
        {/*  onPress={() =>*/}
        {/*    Linking.openURL(*/}
        {/*      'https://www.ozon.ru/product/stend-dlya-sadika-obuchayushchiy-piramida-zdorovogo-pitaniya-600h850mm-1269809805/',*/}
        {/*    )*/}
        {/*  }>*/}
        {/*  "Nutrition Pyramid" - Margarita Koroleva*/}
        {/*</Text>*/}
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              'https://www.ozon.ru/category/maykl-greger-kak-ne-umeret/',
            )
          }>
          "How Not to Die" - Michael Greger
        </Text>
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              'https://www.ozon.ru/category/kitayskoe-issledovanie/',
            )
          }>
          "The China Study" - T. Colin Campbell and Thomas M. Campbell II
        </Text>

        <Text style={styles.header}>
          3. Apps and websites on healthy eating:
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.myfitnesspal.com/')}>
          MyFitnessPal
        </Text>
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://www.loseit.com/how-it-works/')
          }>
          Lose It!
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.fatsecret.com/')}>
          FatSecret
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.eatthismuch.com/')}>
          Eat This Much
        </Text>

        <Text style={styles.warning}>
          Important: Before starting a new diet, it is important to consult with
          a doctor or dietitian to ensure it is suitable for you. Not all diets
          are suitable for everyone, and what works for one person may not work
          for another.
        </Text>
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
