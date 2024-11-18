import { Event, useTrackPlayerEvents } from 'react-native-track-player'

const events = [Event.PlaybackState, Event.PlaybackError, Event.PlaybackActiveTrackChanged]

export const useLogTrackPlayerState = () => {
	useTrackPlayerEvents(events, async (event) => {
		if (event.type === Event.PlaybackError) {

		}

		if (event.type === Event.PlaybackState) {

		}

		if (event.type === Event.PlaybackActiveTrackChanged) {
 
		}
	})
}
