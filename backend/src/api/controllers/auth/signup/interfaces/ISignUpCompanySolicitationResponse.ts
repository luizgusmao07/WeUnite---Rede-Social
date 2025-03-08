interface ISignUpCompanySolicitationResponse {
    success: boolean;
    message: string;
    errors?: Record<string, string>;
}

export default ISignUpCompanySolicitationResponse;