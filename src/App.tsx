import { BrowserRouter, Routes, Route } from "react-router-dom";
import CollectionPage from "./pages/CollectionPage.tsx";
import './App.css'
import SignUpPage from "./pages/SignUpPage/SignUpPage.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import LogInPage from "./pages/LogInPage/LogInPage.tsx";
import PageLayout from "./layouts/PageLayout.tsx";

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout/>}>
            <Route path="/sign-up" element={<SignUpPage/>}/>
            <Route path="/log-in" element={<LogInPage/>}/>
          </Route>


          <Route element={<PageLayout/>}>
            <Route path="/" element={<CollectionPage/>}/>
            <Route path="/explore" element={<CollectionPage/>}/>

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
