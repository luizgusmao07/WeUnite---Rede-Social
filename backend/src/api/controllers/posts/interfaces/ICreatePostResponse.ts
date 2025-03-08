interface ICreatePostResponse {
    success: boolean;
    message: string;
    post?: {
        postedBy: string;
        text: string;
        img?: string;
        video?: string;
        mediaType: string;
    }
}

export default ICreatePostResponse;