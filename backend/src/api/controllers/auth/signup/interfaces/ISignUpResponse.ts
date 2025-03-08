interface SignUpResponse {
    success: boolean;
    message: string;
    user?: {
        _id: string;
        name: string;
        email: string;
        username: string;
        isVerified: boolean;
    };
} 

export default SignUpResponse;