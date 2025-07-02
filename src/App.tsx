// Libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "./layouts/AuthLayout.tsx";
import PageLayout from "./layouts/PageLayout.tsx";

// Route Logic
import ProtectedRoute from "./routes/ProtectedRoute.tsx";

// Pages
import SignUpPage from "./pages/SignUpPage/SignUpPage.tsx";
import LogInPage from "./pages/LogInPage/LogInPage.tsx";
import CollectionPage from "./pages/CollectionPage/CollectionPage.tsx";

// Styles
import './App.css'
import ExplorePage from "./pages/ExplorePage/ExplorePage.tsx";

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
