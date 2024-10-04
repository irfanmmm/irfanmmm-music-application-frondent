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
// import {AccessToken, LoginButton, Profile} from 'react-native-fbsdk-next';
import {responsiveui} from '../config/width_hight_config';
import {color} from '../config/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useApiCalls} from '../config/useApiCalls';
import {useDispatch} from 'react-redux';
import {userIsLogin} from '../config/redux/reducer';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const {signup, error} = useApiCalls();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '309812336110-bnrk0qf920uan2s2fpk9rac16trgptv2.apps.googleusercontent.com',
    });
  }, []);
  const handleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {data} = await GoogleSignin.signIn();
      
      let email = data?.user?.email;
      let name = data?.user?.name;
      let photo = data?.user?.photo;
      // login 
      const respose = await signup(email, name, photo);

      

      await AsyncStorage.setItem('user-data', JSON.stringify(respose?.data));
      dispatch(userIsLogin(true));
      navigation.navigate('Tabs');
    } catch (error) {
      console.log(error);
    }
  };

  // const handleLoginFaceBook = (error, result) => {
  //   if (error) {
  //   } else if (result.isCancelled) {
  //   } else {
  //     AccessToken.getCurrentAccessToken().then(async data => {
  //       await AsyncStorage.setItem('user-data', JSON.stringify(data));
  //       dispatch(userIsLogin(true));
  //       navigation.navigate('Tabs');
  //     });
  //     const currentProfile = Profile.getCurrentProfile().then(function (
  //       currentProfile,
  //     ) {
  //       if (currentProfile) {
  //       }
  //     });
  //   }
  // };

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
        {/* <Pressable style={styles.button}>
          <Image source={require('../img/facebook.png')} style={styles.icon} />
          <Text style={styles.login_text}>Signing With FaceBook</Text>
          <LoginButton
            style={styles.defultFacebook_button}
            onLoginFinished={handleLoginFaceBook}
            onLogoutFinished={() => console.log('logout.')}
          />
        </Pressable> */}
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
