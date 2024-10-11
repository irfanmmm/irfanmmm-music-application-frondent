import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginButton, Profile} from 'react-native-fbsdk-next';
import {color} from '../styles/style';
import {hp, responsiveui, wp} from '../styles/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useApiCalls} from '../hooks/useApiCalls';
import {useDispatch} from 'react-redux';
import {userIsLogin} from '../config/redux/reducer';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const {signup} = useApiCalls();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '309812336110-bnrk0qf920uan2s2fpk9rac16trgptv2.apps.googleusercontent.com',
    });
  }, []);
  const handleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      let email = userInfo.user.email;
      let name = userInfo.user.name;
      let photo = userInfo.user.photo;
      const respose = await signup(email, name, photo);
      console.log(email);

      await AsyncStorage.setItem('user-data', JSON.stringify(respose?.data));
      navigation.navigate('Tabs');
    } catch (error) {
      console.log(error);
      
      navigation.navigate('ErrorScreen', {
        error: error.toString(),
      });
    }
  };

  const handleLoginFaceBook = (error, result) => {
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
  };

  return (
    <View style={styles.conatiner}>
      <Image
        blurRadius={5}
        source={require('../img/screen.png')}
        style={styles.baground_image}
      />
      <View style={styles.login_buttons}>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Image source={require('../img/google.png')} style={styles.icon} />
          <Text style={styles.login_text}>Signing with Google</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Image source={require('../img/facebook.png')} style={styles.icon} />
          <Text style={styles.login_text}>Signing with FaceBook</Text>
          <LoginButton
            style={styles.defultFacebook_button}
            onLoginFinished={handleLoginFaceBook}
            onLogoutFinished={() => console.log('logout.')}
          />
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
