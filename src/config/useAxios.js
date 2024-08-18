import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const useAxios = (initialConfig) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cancelToken = useRef(null);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(async (request) => {
            const token = await AsyncStorage.getItem('user-data')         
            if (token) {
                request.headers["Authorization"] = JSON.parse(token)
            }
            return request;
        });

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    const fetchData = async (config) => {
        setLoading(true);
        setError(null);
        setData(null);

        if (cancelToken.current) {
            cancelToken.current.cancel();
        }
        cancelToken.current = axios.CancelToken.source();

        try {
            var response = await axios({
                ...initialConfig,
                ...config,
                // timeout: 5000,
                cancelToken: cancelToken.current.token,
            });
            setData(response.data);
        } catch (err) {
            if (err?.response?.status == 401) {

            }
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

export { useAxios };
