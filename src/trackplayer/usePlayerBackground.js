import { useEffect, useState } from 'react'
// import { getColors } from 'react-native-image-colors'
import { color } from '../config/style'
import { extractColors } from 'extract-colors';

export const usePlayerBackground = (imageUrl) => {
    // console.log(imageUrl);

    const [imageColors, setImageColors] = useState(null)
    // const src = require('../img/unknown_track.png')
    // useEffect(() => {

    //     extractColors(src)
    //         .then((colors) => {
    //             console.log('dominent colors', colors);

    //         })
    //         .catch(console.error)
    // }, [src])

    return { imageColors }
}
