import { Container } from "@chakra-ui/react";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import CreateOportunity from "./components/CreateOportunity";
import ChatPage from "./pages/ChatPage";
import OportunityPage from "./pages/OportunityPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyResetCodePage from "./pages/VerifyResetCodePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import OportunityDetailsPage from "./pages/OportunityDetailsPage";
import SavedOportunitiesPage from "./pages/SavedOportunitiesPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ClubOpportunitiesPage from "./pages/ClubOpportunitiesPage";
import OpportunityApplicationsPage from "./pages/OpportunityApplicationsPage";

function App() {
    const user = useRecoilValue(userAtom);
    console.log(user);
    return (
        <Container maxW={"full"} p={0} overflowX={"hidden"} >

            <Routes>
                <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to={"/"} />} />
                <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
                <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />

                <Route path="/:username" element={user ? (
                    <>
                        <UserPage />
                        <CreatePost />
                    </>
                ) : (
                    <UserPage />
                )} />
                <Route path="/:username/post/:pid" element={<PostPage />} />
                <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
                {/* <Route path="/oportunities" element={user ? 
                <OportunityPage /> : <Navigate to={"/auth"} />} /> */}
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                <Route path="/oportunities" element={user && user.userType === "Clube" ? (
                    <>
                        <OportunityPage />
                        <CreateOportunity />
                    </>
                ) : (
                    <OportunityPage />
                )} />
                <Route path="/saved-oportunities/:username" element={<SavedOportunitiesPage />} />
                <Route path="/:username/oportunities/:oid" element={<OportunityDetailsPage />} />
                <Route 
                    path="/:username/applied-oportunities" 
                    element={user ? <MyApplicationsPage /> : <Navigate to="/auth" />} 
                />
                       <Route 
                    path="/my-oportunities" 
                    element={user && user.userType === "Clube" ? <ClubOpportunitiesPage /> : <Navigate to="/" />} 
                />
                <Route 
                    path="/oportunities/:oid/applicants" 
                    element={user && user.userType === "Clube" ? <OpportunityApplicationsPage /> : <Navigate to="/" />} 
                />
            </Routes>

            {/* {user && <LogoutButton />} */}

        </Container>
    );
}

export default App;
