import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.tsx";
import PageLayout from "./layouts/PageLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import SignUpPage from "./pages/Auth/SignUpPage.tsx";
import SignInPage from "./pages/Auth/SignInPage.tsx";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.tsx";
import AccountSettingsPage from "./pages/AccountSettingsPage.tsx";
import LibraryPage from "./pages/LibraryPage.tsx";
import ExplorePage from "./pages/ExplorePage.tsx";
import GameResultsPage from "./pages/GameResultsPage.tsx";
import GameDetailsPage from "./pages/GameDetailsPage.tsx";
import './App.css'

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout/>}>
            <Route path="/sign-up" element={<SignUpPage/>}/>
            <Route path="/sign-in" element={<SignInPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
          </Route>


          <Route element={<PageLayout/>}>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/explore" element={<ExplorePage/>}/>
            <Route path="/explore/:platformFamilySlug" element={<GameResultsPage/>}/>
            <Route path="/games" element={<GameResultsPage/>}/>
            <Route path="/game/:gameId/:gameSlug" element={<GameDetailsPage/>}/>
            <Route path="/not-found" element={<NotFoundPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>

            <Route element={<ProtectedRoute/>}>
              <Route path="/my-games" element={<LibraryPage/>}/>
              <Route path="/account-settings" element={<AccountSettingsPage/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
