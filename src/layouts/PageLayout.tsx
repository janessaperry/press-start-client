import Header from "../components/Header.tsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.tsx";
import { SearchOverlayProvider } from "../context/SearchOverlayContext.tsx";
import SearchOverlay from "../components/SearchOverlay.tsx";

const PageLayout = () => {
  return (
    <SearchOverlayProvider>
      <Header/>
      <SearchOverlay/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </SearchOverlayProvider>
  )
}

export default PageLayout;