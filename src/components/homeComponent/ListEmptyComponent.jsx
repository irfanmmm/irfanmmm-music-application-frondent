import {Image, View} from 'react-native';
import {wp} from '../../styles/responsive';

export const EmptyList = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        opacity: 0.7,
      }}>
      <Image
        style={{
          width: wp(50),
          height: wp(50),
        }}
        source={require('../../img/notfound.png')}
      />
    </View>
  );
};
