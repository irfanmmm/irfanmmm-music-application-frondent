import React from "react"
import { Image, Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInDown, SlideInDown, SlideInLeft, SlideOutLeft } from "react-native-reanimated"
import { color } from "../config/style"
import { responsiveui, wp } from "../config/width_hight_config"
import { useNavigation } from "@react-navigation/native"


export const Controls = ({ playingState, item, index, onPress }) => {
    return (
        <Pressable style={{ padding: wp(2) }} key={index} onPress={() => onPress(item, index)} >
            <Animated.View
                entering={FadeInDown.delay(200 * index)}
            >
                {
                    index === 2 ?
                        <View style={styles.play_pause}>
                            <Image resizeMode="cover" style={[{ width: '100%', height: '100%' }, !playingState && { marginLeft: wp(2) }]} source={playingState ? item.img : require('../img/play.png')} />
                        </View> :
                        <Image source={item.img} />

                }
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    play_pause: {
        backgroundColor: color.bluecolor,
        elevation: 10,
        width: wp(20),
        padding: wp(5),
        height: wp(20),
        borderRadius: wp(20) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

