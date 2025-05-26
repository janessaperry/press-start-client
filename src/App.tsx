import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import './App.css'

function App () {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Navigate to="/collection" replace/>}/>
          <Route path="/collection" element={<CollectionPage/>}/>
          <Route path="/explore" element={<CollectionPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
