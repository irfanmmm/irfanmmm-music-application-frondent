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
import {responsiveui} from '../config/width_hight_config';
import {color} from '../config/style';

const Login = ({navigation}) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '609457408230-d9sb13do23gujuopfs3h6vpei46prt5t.apps.googleusercontent.com',
    });
  }, []);
  const handleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      navigation.navigate('Tabs');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginFaceBook = (error, result) => {
    console.log(result, error);

    if (error) {
      console.log('login has error: ' + result.error);
    } else if (result.isCancelled) {
      console.log('login is cancelled.');
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        console.log(data.accessToken.toString());
        navigation.navigate('Tabs');
      });
      const currentProfile = Profile.getCurrentProfile().then(function (
        currentProfile,
      ) {
        if (currentProfile) {
          console.log(currentProfile);
        }
      });
    }
  };

  return (
    <View style={styles.conatiner}>
      <Image
        source={require('../img/screen.png')}
        style={styles.baground_image}
      />
      <View style={styles.login_buttons}>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Image source={require('../img/google.png')} style={styles.icon} />
          <Text style={styles.login_text}>Signing With Google</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Image source={require('../img/facebook.png')} style={styles.icon} />
          <Text style={styles.login_text}>Signing With FaceBook</Text>
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
    bottom: responsiveui(0.4),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveui(0.6),
    paddingVertical: responsiveui(0.01),
    paddingHorizontal: responsiveui(0.03),
    borderColor: color.textgrey,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: responsiveui(0.05),
    position: 'relative',
  },
  icon: {
    width: responsiveui(0.08),
    height: responsiveui(0.08),
    marginRight: responsiveui(0.03),
  },
  login_text: {
    color: color.textWhite,
    fontFamily: 'Nunito-Bold',
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
