import {jwtDecode} from 'jwt-decode';

export async function DecodeToken(token: any) {
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Error decoding token:", error);
        throw new Error("Invalid token");
    }
}
