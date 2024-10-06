
import { API_CRIDENTIOLS } from "../config/urls";
import { useAxios } from "./useAxios";

export const useApiCalls = () => {
    const { fetchData, loading, error } = useAxios();

    const signup = async (email, name, photo) => {
        const response = await fetchData({
            url: API_CRIDENTIOLS.LOGIN,
            method: 'POST',
            data: {
                "email": email,
                "profile": photo,
                "username": name
            }
        })
        return response;

    }


    const getProfileDetails = async () => {
        const response = await fetchData({
            url: API_CRIDENTIOLS.PROFILE,
        })
        return response;
    }


    const getAllsongs = async () => {
        
        const response = await fetchData({
            url: API_CRIDENTIOLS.SONG_DETAILS,
        })
        return response;
    }

    const getSong = async (id) => {
        const response = await fetchData({
            url: API_CRIDENTIOLS.GET_SONG + '?id=' + id,
        })
        return response;
    }

    const likesong = async (id, like) => {
        const response = await fetchData({
            url: API_CRIDENTIOLS.LIKE,
            data: {
                id,
                like,
            },
            method: "POST"
        })
        return response;
    }

    const likedSongs = async () => {
        const response = await fetchData({
            url: API_CRIDENTIOLS.LIKED_SONGS,
        })
        return response;
    }

    const recentsongs = async () => {
        const response = await fetchData({
            url: API_CRIDENTIOLS.RECENT,
        })
        return response;
    }

    return {
        loading,
        error,
        signup,
        getProfileDetails,
        getAllsongs,
        getSong,
        likesong,
        likedSongs,
        recentsongs
    }
}  