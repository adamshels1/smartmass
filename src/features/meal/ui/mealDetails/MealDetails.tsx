import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppNavigation, NavigationStackLists} from 'shared/config/navigation';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {useAppSelector} from 'shared/lib/state/selector/useAppSelector.ts';
import {fetchMealDetails} from 'entities/meal/model/slices/mealSlice'; // Импортируйте ваш action
import {RootState} from 'app/providers/StoreProvider/config/store';
import {useSelector} from 'react-redux';
import ImagePexels from 'shared/ui/ImageByDescription/ui/ImagePixabay.tsx';
import {LightningIcon} from 'shared/assets/icons';
import {SkeletonLoader} from 'shared/ui';
import {useRoute} from '@react-navigation/native';

type TaskEditScreenProps = NativeStackScreenProps<
  NavigationStackLists,
  AppNavigation.MEAL_DETAILS
>;

const MealDetails = ({}: TaskEditScreenProps) => {
  const route = useRoute();
  console.log('route', route);
  const {mealId} = route.params; // Получение параметров маршрута

  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state);
  console.log('state', state);

  const mealDetails = useAppSelector((state: RootState) =>
    state.meal.mealsDetails.find(meal => meal.mealId === mealId),
  );

  const status = useSelector((state: RootState) => state.meal.status);
  const error = useSelector((state: RootState) => state.meal.error);

  // const meal = useAppSelector((state: RootState) => {
  //   const day = state.meal.days.find(day =>
  //     day.meals.some(meal => meal.id === mealId),
  //   );
  //   return day ? day.meals.find(meal => meal.id === mealId) : undefined;
  // });

  console.log('mealDetails', mealDetails);

  useEffect(() => {
    dispatch(fetchMealDetails({mealId}));
  }, [dispatch, mealId]);

  if (status === 'loading') {
    return <SkeletonLoader />;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  if (!mealDetails) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <AppHeader title={mealDetails?.dish} />
      <ScrollView style={styles.container}>
        {/* Header */}
        {/*<View style={styles.header}>*/}
        {/*  <Text style={styles.title}>*/}
        {/*    {mealDetails?.dish || 'Grilled Lamb'}*/}
        {/*  </Text>*/}
        {/*</View>*/}

        {/* Image */}
        <View style={{alignItems: 'center', marginTop: 10}}>
          <ImagePexels
            description={mealDetails.dishEn}
            style={styles.image}
            width={500}
            height={300}
            size={'large'}
          />
        </View>

        {/* Nutrition Details */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            borderTopLeftRadius: 60,
          }}>
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionItem}>
              <AnimatedCircularProgress
                size={50}
                width={4}
                fill={mealDetails ? mealDetails.dishCalories / 10 : 0} // Подстройте процент на основе значения калорий
                tintColor="#FF6347"
                backgroundColor="#E0E0E0">
                {() => <LightningIcon />}
              </AnimatedCircularProgress>
              <Text style={styles.nutritionText}>
                Calorie{'\n'}
                {mealDetails.dishCalories || 0} Kcal
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <AnimatedCircularProgress
                size={50}
                width={4}
                fill={mealDetails ? mealDetails.proteins : 0} // Подстройте процент на основе значения белков
                tintColor="#1E90FF"
                backgroundColor="#E0E0E0"
              />
              <Text style={styles.nutritionText}>
                Protein{'\n'}
                {mealDetails?.proteins || 0}g
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <AnimatedCircularProgress
                size={50}
                width={4}
                fill={mealDetails ? mealDetails.fats : 0} // Подстройте процент на основе значения жиров
                tintColor="#FFD700"
                backgroundColor="#E0E0E0"
              />
              <Text style={styles.nutritionText}>
                Fat{'\n'}
                {mealDetails?.fats || 0}g
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <AnimatedCircularProgress
                size={50}
                width={4}
                fill={mealDetails ? mealDetails.carbohydrates : 0} // Подстройте процент на основе значения клетчатки
                tintColor="#32CD32"
                backgroundColor="#E0E0E0"
              />
              <Text style={styles.nutritionText}>
                Carbohydrates{'\n'}
                {mealDetails?.carbohydrates || 0}g
              </Text>
            </View>
          </View>

          {/* Nutrition Facts */}
          <View style={styles.nutritionFacts}>
            <Text style={styles.nutritionFactsText}>
              {mealDetails?.fullRecipe ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper sed vulputate lobortis interdum tempor odio. Cras dolor ultrices et blandit sem non, commodo.'}
            </Text>
          </View>

          {/* Add to Diet Button */}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to your daily Diet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6F7F7',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#333',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  nutritionFacts: {
    marginBottom: 20,
  },
  nutritionFactsText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MealDetails;
