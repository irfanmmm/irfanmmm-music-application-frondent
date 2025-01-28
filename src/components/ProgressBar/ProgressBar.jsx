import {useProgress} from 'react-native-track-player';
import {wp} from '../../styles/responsive';
import {color} from '../../styles/style';
import React from 'react';
import { View } from 'react-native';

export const ProgressBar = React.memo(() => {
  const progress = useProgress();

  return (
    <View
      style={{
        borderTopColor: color.textWhite,
        borderTopWidth: 1,
        width: isNaN((progress.position / progress?.duration) * wp(100))
          ? wp(0)
          : (progress.position / progress?.duration) * wp(100),

        marginBottom: wp(3),
      }}
    />
  );
});
