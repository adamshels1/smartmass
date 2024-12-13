import {ReactElement, memo} from 'react';
import {Code} from 'react-content-loader/native';
import {StyleSheet, View} from 'react-native';

interface Props {
  length?: number;
}
// TODO: update later, use as default
export const SkeletonLoader = memo(function SkeletonLoader({
  length = 7,
}: Props): ReactElement {
  const array = Array(length).fill(1);

  return (
    <View style={styles.root}>
      {array.map((_, index) => (
        <Code key={index} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    gap: 24,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
