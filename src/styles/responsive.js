import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const responsiveui = size => {
  const responsiveSize = width * size;
  return responsiveSize;
};

export const hp = size => {
  return (size * height) / 100;
};

export const wp = size => {
  return (size * width) / 100;
};
