import {Pause, Play} from 'react-native-feather';
import {color} from '../../styles/style';
import {wp} from '../../styles/responsive';
import {useIsPlaying} from 'react-native-track-player';

export const PlayButton = ({size = wp(7), bg = color.textWhite}) => {
  const songProgressing = useIsPlaying();
  return songProgressing.playing ? (
    <Pause stroke={bg} width={size} height={size} strokeWidth={1.5} />
  ) : (
    <Play
      stroke={bg}
      width={size}
      height={size}
      fill={bg}
      strokeWidth={1}
      style={{
        marginLeft: wp(1),
      }}
    />
  );
};
