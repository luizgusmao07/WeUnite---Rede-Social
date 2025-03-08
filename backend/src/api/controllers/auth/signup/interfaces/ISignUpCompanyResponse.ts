interface ISignUpCompanyResponse {
    success: boolean;
    message: string;
    user?: {
        _id: string;
        email: string;
        cnpj: string;
        name: string;
        username: string;
        isClub: boolean; 
        isVerified: boolean;
    };   
}

export default ISignUpCompanyResponse;