import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.tsx";
import PageLayout from "./layouts/PageLayout.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import SignUpPage from "./pages/SignUpPage/SignUpPage.tsx";
import SignInPage from "./pages/SignInPage/SignInPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage.tsx";
import CollectionPage from "./pages/CollectionPage/CollectionPage.tsx";
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
            <Route path="/" element={<CollectionPage/>}/>
            <Route path="/explore" element={<ExplorePage/>}/>
            <Route path="/explore/:platformFamilySlug" element={<GameResultsPage/>}/>
            <Route path="/games" element={<GameResultsPage/>}/>
            <Route path="/game/:gameId/:gameSlug" element={<GameDetailsPage/>}/>
            <Route path="/not-found" element={<NotFoundPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>

            <Route element={<ProtectedRoute/>}>
              <Route path="/collection" element={<CollectionPage/>}/>
              <Route path="/account" element={<CollectionPage/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
