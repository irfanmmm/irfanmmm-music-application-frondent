import TrackPlayer, {useActiveTrack} from 'react-native-track-player';

const QUEUE_LIMIT = 8;
export const useSelectTrack = () => {
  const activeTrack = useActiveTrack();

  const selectTrack = async song => {
    if (song.url === activeTrack.url) return;

    try {
      let queueList = await TrackPlayer.getQueue();
      const songIndex = queueList.findIndex(track => track.url === song.url);

      if (songIndex !== -1) {
        await TrackPlayer.move(songIndex, 0);
      } else {
        // Add the new song at the top and remove duplicates
        queueList = [
          song,
          ...queueList.filter(track => track.url !== song.url),
        ];
        // Trim the queue to the max limit (QUEUE_LIMIT)
        if (queueList.length > QUEUE_LIMIT) {
          queueList = queueList.slice(0, QUEUE_LIMIT); // Keep only the first QUEUE_LIMIT items
        }
        // Reset the player and add the updated queue
        await TrackPlayer.reset();
        await TrackPlayer.add(queueList);
      }

      await TrackPlayer.skip(0);
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error managing the queue:', error);
    }
  };

  return selectTrack;
};
