import {useSelector, useDispatch, useStore} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  View,
} from 'react-native';
import Header from '../components/Header';
import i18n from '../shared/config/i18n';
import axios from 'axios';
import {ProgressCircle} from 'react-native-svg-charts';

const {GoogleGenerativeAI} = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {Indicator} from 'shared/ui/Indicator';

const sendMessage = async messageText => {
  const model = genAI.getGenerativeModel({model: 'gemini-pro'});
  const result = await model.generateContent(
    JSON.stringify({prompt: messageText, language: i18n.language}),
  );
  const response = await result.response;
  let text = response.text();
  return text;
};

export default function ProductByBarCodeScreen({navigation, route}) {
  const [productInfo, setProductInfo] = useState(null);
  const [healthAssessment, setHealthAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //8690526069500 Yulaf Ezmesi
  //8692886411548 Kefir
  //8699118038559 Birsah sut (нет данных)
  //8690710030323 Tahin (не правильно посчитал калории)
  //8690637921100 calve (нет данных)
  //8695077124685 bobbol mayonez (нет данных)
  //8691216020627 harribo
  //5000159461122 snikers
  //5449000000439 cocacola

  // const barcode = '5053990107339'; // Замените на фактический штрих-код
  //https://barkodist.com/pringles-original-40-g-barkodu
  const barcode = route?.params?.barcode;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const productDetails = await fetchProductInfoWithCountry(barcode);
      if (productDetails) {
        const assessment = await sendMessage(
          `Оцени полезность продукта до 200 символов: ${productDetails.productName}. Ингредиенты: ${productDetails.ingredients}. верни в формате: Продукт полезен/не полезен, является халалом или это харам, следующей строкой чем полезен чем нет, докажи что содержит свинной жир`,
        );
        setHealthAssessment(assessment);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [barcode]);

  const fetchProductInfoWithCountry = async barcode => {
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      );

      if (response.data.status === 1) {
        const product = response.data.product;

        // Извлекаем основные данные
        const productDetails = {
          productName: product.product_name || 'Название не указано',
          category: product.category || 'Категория не указана',
          ingredients: product.ingredients_text || 'Ингредиенты не указаны',
          nutriScore: product.nutrition_grades || 'Nutri-Score не указан',
          calories: product.nutriments['energy-kcal_100g'] || '',
          fat: product.nutriments?.fat || 'Жиры не указаны',
          saturatedFat:
            product.nutriments?.saturatedFat || 'Насыщенные жиры не указаны',
          carbohydrates:
            product.nutriments?.carbohydrates || 'Углеводы не указаны',
          sugars: product.nutriments?.sugars || 'Сахара не указаны',
          protein: product.nutriments?.proteins || 'Белки не указаны',
          salt: product.nutriments?.salt || 'Соль не указана',
          countries:
            product.countries_tags || 'Страна производителя не указана',
          images: product.images || [], // Добавляем массив изображений
          image: product.image_url,
        };

        console.log('Информация о продукте:', productDetails);
        setProductInfo(productDetails);
        return productDetails; // Возвращаем productDetails для дальнейшего использования
      } else {
        console.log('Продукт не найден');
        setProductInfo(null);
        return null;
      }
    } catch (error) {
      console.error('Ошибка при запросе данных о продукте:', error);
      setProductInfo(null);
      return null;
    }
  };

  const calculatePercentage = (value, maxValue = 900) => {
    return value / maxValue;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <Header
          showBack={true}
          navigation={navigation}
          title={i18n.t('Product Info')}
        />
        {isLoading && <Indicator />}

        {/* Вывод информации о продукте */}
        <ScrollView>
          {/* Верхняя часть с изображением */}
          <View style={styles.imageContainer}>
            <Image
              source={{uri: productInfo?.image}} // Укажите URL или используйте локальное изображение
              style={styles.productImage}
              resizeMode={'contain'}
            />
          </View>

          {/* Информация о продукте */}
          <View style={styles.detailsContainer}>
            {productInfo?.calories && (
              <View style={styles.infoContainer}>
                {/* Круговая диаграмма калорий */}
                <View style={styles.caloriesSection}>
                  <ProgressCircle
                    style={styles.mainProgressCircle}
                    progress={calculatePercentage(productInfo?.calories)}
                    progressColor={'#31D6D6'}
                    strokeWidth={10}
                  />
                  <Image
                    source={require('../shared/assets/icons/energy.png')}
                    style={{
                      width: 16,
                      height: 19,
                      position: 'absolute',
                      top: 35,
                    }}
                  />
                  <Text style={styles.kcalText}>
                    {productInfo?.calories}kcal
                  </Text>
                </View>

                {/* Пищевая информация с кругами */}
                <View style={styles.nutritionInfoContainer}>
                  <View style={styles.nutritionRow}>
                    <ProgressCircle
                      style={styles.nutritionCircle}
                      progress={calculatePercentage(
                        productInfo?.carbohydrates,
                        100,
                      )}
                      progressColor={'#FF6384'}
                      strokeWidth={3.5}
                    />
                    <Text style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {productInfo?.carbohydrates}g{'\n'}
                      </Text>
                      <Text style={styles.nutritionTitle}>Carbohydrate</Text>
                    </Text>
                  </View>

                  <View style={styles.nutritionRow}>
                    <ProgressCircle
                      style={styles.nutritionCircle}
                      progress={calculatePercentage(productInfo?.protein, 100)}
                      progressColor={'#333333'}
                      strokeWidth={3.5}
                    />
                    <Text style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {productInfo?.protein}g{'\n'}
                      </Text>
                      <Text style={styles.nutritionTitle}>Protein</Text>
                    </Text>
                  </View>

                  <View style={styles.nutritionRow}>
                    <ProgressCircle
                      style={styles.nutritionCircle}
                      progress={calculatePercentage(productInfo?.fat, 100)}
                      progressColor={'#31D6D6'}
                      strokeWidth={3.5}
                    />
                    <Text style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {productInfo?.fat}g{'\n'}
                      </Text>
                      <Text style={styles.nutritionTitle}>Fat</Text>
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Описание продукта */}

            {isLoading ? (
              <ContentLoader
                viewBox="0 0 380 70"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                speed={2}>
                <Rect x="0" y="0" rx="4" ry="4" width="300" height="13" />
                <Rect x="0" y="25" rx="4" ry="4" width="250" height="13" />
                <Rect x="0" y="50" rx="4" ry="4" width="300" height="13" />
              </ContentLoader>
            ) : (
              <View style={styles.productDescriptionContainer}>
                {/*<Text style={styles.foodTitle}>Food</Text>*/}
                <Text style={styles.foodName}>{productInfo?.productName}</Text>
                <Text style={styles.nutritionDescription}>
                  {healthAssessment}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productInfoContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    margin: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  assessmentContainer: {
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    margin: 10,
  },
  assessmentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  // Остальные стили остаются без изменений

  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  imageContainer: {
    backgroundColor: '#31D6D6',
    alignItems: 'center',
    paddingVertical: 30,
  },
  productImage: {
    width: 220,
    height: 220,
    borderRadius: 15,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: -30,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesSection: {
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 10,
  },
  mainProgressCircle: {
    height: 130,
    width: 130,
  },
  kcalText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'regular',
    color: '#333333',
    top: 60,
  },
  nutritionInfoContainer: {
    flex: 1,
    marginVertical: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  nutritionCircle: {
    height: 23,
    width: 23,
    marginRight: 10,
  },
  nutritionItem: {
    fontSize: 16,
    flexDirection: 'column',
  },
  nutritionValue: {
    color: '#333333',
    fontSize: 18,
  },
  nutritionTitle: {
    color: '#9D9D9D',
    fontSize: 14,
  },
  productDescriptionContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  foodName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#31D6D6',
    marginBottom: 10,
  },
  nutritionDescription: {
    fontSize: 14,
    color: '#777',
  },
});
