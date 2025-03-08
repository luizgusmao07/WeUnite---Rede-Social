
interface LoginResponse {
    success: boolean;
    message: string;
    user?: {
        _id: string;
        name: string;
        email: string;
        username: string;
        bio: string;
        profilePic: string;
        isClub: boolean;
    }
}

export default LoginResponse;