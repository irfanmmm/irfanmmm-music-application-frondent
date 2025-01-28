import {useLayoutEffect, useState} from 'react';
import TrackPlayer, {Event} from 'react-native-track-player';

export const useShuffledSongs = () => {
  const [suffleQueelist, setSuffleQueelist] = useState(false);

  useLayoutEffect(() => {
    const handleQueueEnded = async () => {
      if (suffleQueelist) {
        const songs = await TrackPlayer.getQueue();
        const shuffledSongs = songs.slice().sort(() => Math.random() - 0.5);
        await TrackPlayer.reset();
        await TrackPlayer.add(shuffledSongs);
        setQueelist(shuffledSongs);
        TrackPlayer.play();
      }
    };

    if (suffleQueelist) {
      TrackPlayer.addEventListener(Event.PlaybackQueueEnded, handleQueueEnded);
    }
    return () => {
      TrackPlayer.remove();
    };
  }, [suffleQueelist]);

  return [suffleQueelist, setSuffleQueelist];
};
