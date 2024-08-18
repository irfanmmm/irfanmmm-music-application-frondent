import React from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { color } from "../config/style"
import { responsiveui, wp } from "../config/width_hight_config"
import { useNavigation } from "@react-navigation/native"


export const HomeCard = ({ item, index }) => {
    const navigation = useNavigation()
    return (
        <Animated.View key={index} entering={FadeInDown.delay(200 * index)} >
            <Pressable style={styles.recomonded_card_parent} key={index}
                onPress={() => navigation.navigate('MusicPlayer', {
                    data: {
                        ...item,
                    },
                })}
            >
                <Animated.Image
                    resizeMode="cover"
                    style={styles.recomonded_card_image}
                    source={{ uri: item?.thumbnail }}
                />
                <View style={styles.recomonded_card_right}>
                    <Text style={styles.recomonded_card_text}>{item?.title}</Text>
                    <Text style={styles.recomonded_card_text2}>{item.discription}</Text>
                    <Text style={styles.recomonded_card_text2}>{item?.like == undefined ? 0 : item?.like}/likes</Text>
                </View>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    recomonded_card_parent: {
        paddingLeft: responsiveui(0.05),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: wp(4),
    },
    recomonded_card_image: {
        width: responsiveui(0.28),
        height: responsiveui(0.28),
        marginRight: responsiveui(0.04),
        borderRadius: wp(1),
    },
    recomonded_card_right: {},
    recomonded_card_text: {
        color: color.textWhite,
        fontSize: wp(5),
        fontFamily: 'Nunito-Regular',
    },
    recomonded_card_text2: {
        color: color.textgrey,
        fontFamily: 'Nunito-Regular',
        fontSize: wp(4),
        marginTop: responsiveui(0.01),
    },
})

