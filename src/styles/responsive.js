import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHight} = Dimensions.get('window');

export const responsiveui = size => {
  const responsiveSize = Dimensions.get('window').width * size;

  return responsiveSize;
};

export const hp = percentage => {
  return (percentage * deviceHight) / 100;
};

export const wp = percentage => {
  return (percentage * deviceWidth) / 100;
};
