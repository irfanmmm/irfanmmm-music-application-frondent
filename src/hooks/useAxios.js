import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import { API_CRIDENTIOLS } from '../config/urls';

const useAxios = initialConfig => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cancelToken = useRef(null);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(async request => {
      const token = await AsyncStorage.getItem('user-data');
      if (token) {
        console.log(token);
        
        request.headers['Authorization'] = JSON.parse(token);
      }
      return request;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const removeSession = async () => {
    await AsyncStorage.removeItem('user-data');
    navigation.navigate('Login');
  };

  const fetchData = async config => {
    setLoading(true);
    setError(null);
    setData(null);

    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
    cancelToken.current = axios.CancelToken.source();

    try {

      console.log(config);
      
      var response = await axios({
        ...initialConfig,
        ...config,
        // timeout: 5000,
        cancelToken: cancelToken.current.token,
      });

      

      setData(response.data);
    } catch (err) {
      console.log(err);

      // if (err?.response?.status === 401) {
      removeSession();
      // }
      setError(err);
    } finally {
      setLoading(false);
    }
    
    return response?.data;
  };

  useEffect(() => {
    return () => {
      setLoading(false);
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
  };
};

export {useAxios};
