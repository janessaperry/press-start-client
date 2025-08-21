// Libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "./layouts/AuthLayout.tsx";
import PageLayout from "./layouts/PageLayout.tsx";

// Route Logic
import ProtectedRoute from "./routes/ProtectedRoute.tsx";

// Pages
import SignUpPage from "./pages/SignUpPage/SignUpPage.tsx";
import SignInPage from "./pages/SignInPage/SignInPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage.tsx";
import CollectionPage from "./pages/CollectionPage/CollectionPage.tsx";
import ExplorePage from "./pages/ExplorePage/ExplorePage.tsx";

// Styles
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
