import { jwtDecode } from 'jwt-decode';

const decode_token = (token) => {
    if (token) {
        try {
            const decoded_token = jwtDecode(token);
            console.log('Decoded Token:', decoded_token); // Check the structure of the token
            const exp = new Date(decoded_token.exp * 1000);
            if (new Date() > exp) {
                localStorage.removeItem('newsToken');
                return "";
            } else {
                return decoded_token;
            }
        } catch (error) {
            console.error('Token decoding failed:', error);
            return "";
        }
    } else {
        return "";
    }
};

export default decode_token;
