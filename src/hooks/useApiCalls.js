import {API_CRIDENTIOLS, BASE_URL} from '../config/urls';
import {useAxios} from './useAxios';

export const useApiCalls = () => {
  const {fetchData, loading, error} = useAxios();

  const checkHealth = async () => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.HEALTH,
    });
    return response;
  };

  const signup = async (email, name, photo, token) => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.LOGIN,
      method: 'POST',
      data: {
        email: email,
        profile: photo,
        username: name,
        notificationid: token,
      },
    });
    return response;
  };

  const getProfileDetails = async () => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.PROFILE,
    });
    return response;
  };

  const getAllsongs = async ({count, pageSize}) => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.SONG_DETAILS,
      method: 'POST',
      data: {
        count, // Example value, replace with your actual data
        pageSize, // Example value, replace with your actual data
      },
    });

    if (response?.status) {
      return {
        songs: response?.data?.map(detai => ({
          ...detai,
          artwork: detai?.artwork,
          url: detai?.url,
        })),
        pagination: response.pagination,
      };
    }

    return {songs: response, pagination: response.pagination};
  };

  const getSong = async id => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.GET_SONG + '?id=' + id,
    });
    return response;
  };

  const likesong = async (id, like) => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.LIKE,
      data: {
        id,
        like,
      },
      method: 'POST',
    });
    return response;
  };

  const likedSongs = async () => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.LIKED_SONGS,
    });

    if (response?.status) {
      return response?.data?.map(detai => ({
        ...detai,
        artwork: detai?.artwork,
        url: detai?.url,
      }));
    }
    return response;
  };

  const recentsongs = async () => {
    const response = await fetchData({
      url: API_CRIDENTIOLS.RECENT,
    });
    if (response?.status) {
      return response?.data?.map(detai => ({
        ...detai,
        artwork: detai?.artwork,
        url: detai?.url,
      }));
    }
    return response;
  };

  return {
    loading,
    error,
    checkHealth,
    signup,
    getProfileDetails,
    getAllsongs,
    getSong,
    likesong,
    likedSongs,
    recentsongs,
  };
};
