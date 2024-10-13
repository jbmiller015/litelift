import { cookies } from 'next/headers'


export default function useToken() {
    const cookieStore = cookies()
    const getToken = () => {
        const tokenString = cookieStore.get('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token
    };

    const saveToken = userToken => {
        if (!userToken) {
            cookieStore.delete('token');
        } else {
            cookieStore.set('token', JSON.stringify(userToken),{secure:true});
            setToken(userToken);
        }
    };

    return {
        setToken: saveToken,
        getToken: getToken
    }
}
