import { FlatList, Image, StyleSheet, View } from 'react-native';
import { color } from '../styles/style';

const DUMMY_CONTAINT = [1, 1, 1, 1, 1, 1, 1, 1];
export const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_CONTAINT}
        renderItem={() => (
          <View style={styles.card}>
            <View style={styles.leftCardContainer}>
              <Image source={require('./../img/')} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: wp(10),
    backgroundColor: color.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(10),
    paddingVertical: wp(5),
    marginBottom: wp(10),
  },
  leftCardContainer: {},
});
