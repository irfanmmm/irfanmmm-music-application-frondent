import React from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated"
import { color } from "../config/style"
import { responsiveui, wp } from "../config/width_hight_config"
import { useNavigation } from "@react-navigation/native"


export const HomeHoriZontalCard = ({ item, index }) => {
    const navigation = useNavigation()
    return (
        <Animated.View
            entering={FadeInRight.delay(200 * index)}
            style={styles.recentlyplayd_card_parent}>
            <Image
                resizeMode="cover"
                style={styles.recentlyplayd_card_image}
                source={{ uri: item?.thumbnail }}
            />
            <Text style={styles.recentlyplayd_card_text}>{item.title}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    recentlyplayd_card_parent: {
        width: wp(30),
        height: wp(30),
        marginRight: wp(4),
    },
    recentlyplayd_card_image: {
        width: '100%',
        height: '100%',
        borderRadius: wp(1),
    },
    recentlyplayd_card_text: {
        fontSize: wp(4),
        color: color.textWhite,
        textAlign: 'center',
        marginTop: responsiveui(0.02),
        fontFamily: 'Nunito-Regular',
    },
})

