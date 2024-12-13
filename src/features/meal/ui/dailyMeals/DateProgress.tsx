import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BurgerIcon} from 'shared/assets/icons';
import {ProgressBar} from 'react-native-paper';

interface DateProgressComponentProps {
  date: string;
  progress: number;
  kcal: string;
}

const DateProgress: React.FC<DateProgressComponentProps> = ({
  date,
  progress,
  kcal,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.dateText}>{date}</Text>
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={'#31D6D6'}
            style={styles.progressBar}
          />
          <Text style={styles.kcalProgress}>{kcal}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <BurgerIcon width={50} height={50} fill={'#ff0000'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'normal',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  progressBar: {
    height: 3,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    width: 150,
    marginRight: 12,
  },
  kcalProgress: {
    fontSize: 14,
  },
});

export default DateProgress;
