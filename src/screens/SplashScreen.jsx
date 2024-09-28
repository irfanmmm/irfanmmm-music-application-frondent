import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { useSetupTrackPlayer } from "../trackplayer/useSetupTrackPlayer";
import { useLogTrackPlayerState } from "../trackplayer/useLogTrackPlayerState";
const InitiolScreen = ({ navigation }) => {
    useEffect(() => {
        AsyncStorage.getItem('user-data').then((token) => {

            if (token) {
                navigation.navigate('Tabs')
            } else {
                navigation.navigate('Login')
            }

        })
    }, [])
    const handleTrackPlayerLoaded = useCallback(() => {
        SplashScreen.hide()
    }, [])

    useSetupTrackPlayer({
        onLoad: handleTrackPlayerLoaded,
    })

    useLogTrackPlayerState()
    return <></>
}

export default InitiolScreen;