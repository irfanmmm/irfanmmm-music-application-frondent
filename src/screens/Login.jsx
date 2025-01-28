import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginButton, Profile} from 'react-native-fbsdk-next';
import {color} from '../styles/style';
import {hp, wp} from '../styles/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useApiCalls} from '../hooks/useApiCalls';
import {useDispatch} from 'react-redux';
import {userIsLogin} from '../config/redux/reducer';
import Video from 'react-native-video';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const {signup} = useApiCalls();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [isBufferingBaground, setIsBufferingBaground] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '609457408230-d9sb13do23gujuopfs3h6vpei46prt5t.apps.googleusercontent.com',
    });
    requestUserPermission();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleLogin = async () => {
    setLoadingGoogle(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      let email = userInfo.user.email;
      let name = userInfo.user.name;
      let photo = userInfo.user.photo;
      let token = await getToken();

      const respose = await signup(email, name, photo, token);

      await AsyncStorage.setItem('user-data', JSON.stringify(respose?.data));
      navigation.navigate('Tabs');
    } catch (error) {
      console.log(error);

      navigation.navigate('ErrorScreen', {
        error: error.toString(),
      });
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleLoginFaceBook = (error, result) => {
    setLoadingFacebook(true);

    if (error) {
    } else if (result.isCancelled) {
    } else {
      AccessToken.getCurrentAccessToken().then(async data => {
        await AsyncStorage.setItem('user-data', JSON.stringify(data));
        dispatch(userIsLogin(true));
        navigation.navigate('Tabs');
      });
      const currentProfile = Profile.getCurrentProfile().then(function (
        currentProfile,
      ) {
        if (currentProfile) {
        }
      });
    }
    setLoadingFacebook(false);
  };

  const onBuffer = e => {
    if (!e.isBuffering) {
      setIsBufferingBaground(false);
    }
  };
  const onProgress = progress => {
    if (progress.currentTime >= 120) {
      videoRef.current?.seek(60);
    }
  };
  const onError = () => {};
  const onLoad = () => {
    videoRef?.current?.seek(60);
  };

  return (
    <View style={styles.conatiner}>
      {isBufferingBaground && (
        <Image
          blurRadius={5}
          source={require('../img/screen.png')}
          style={[styles.baground_image, {zIndex: 10}]}
        />
      )}
      <Video
        // Can be a URL or a local file.
        source={require('./../video/background.mp4')}
        resizeMode="cover"
        // Store reference
        ref={videoRef}
        onProgress={onProgress}
        repeat
        onLoad={onLoad}
        // Callback when remote video is buffering
        onBuffer={onBuffer}
        // Callback when video cannot be loaded
        onError={onError}
        style={styles.baground_image}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />
      <View style={styles.login_buttons}>
        <Pressable style={styles.button} onPress={handleLogin}>
          {loadingGoogle ? (
            <ActivityIndicator size={'small'} color={color.textWhite} />
          ) : (
            <>
              <Image
                source={require('../img/google.png')}
                style={styles.icon}
              />
              <Text style={styles.login_text}>Signing with Google</Text>
            </>
          )}
        </Pressable>
        <Pressable style={styles.button}>
          {loadingFacebook ? (
            <ActivityIndicator size={'small'} color={color.textWhite} />
          ) : (
            <>
              <Image
                source={require('../img/facebook.png')}
                style={styles.icon}
              />
              <Text style={styles.login_text}>Signing with FaceBook</Text>
              <LoginButton
                style={styles.defultFacebook_button}
                onLoginFinished={handleLoginFaceBook}
                onLogoutFinished={() => console.log('logout.')}
              />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  baground_image: {
    position: 'absolute',
    zIndex: -10,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  login_buttons: {
    position: 'absolute',
    bottom: hp(12),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(70),
    paddingVertical: wp(2.5),
    backgroundColor: color.background,
    paddingHorizontal: wp(4),
    borderColor: color.textgrey,
    borderStyle: 'dashed',
    borderWidth: wp(0.4),
    borderRadius: wp(10),
    marginBottom: wp(5),
    position: 'relative',
  },
  icon: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(3),
  },
  login_text: {
    color: color.textWhite,
    fontFamily: 'Nunito-ExtraBold',
    fontSize: wp(4),
  },
  defultFacebook_button: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    opacity: 0,
  },
});
