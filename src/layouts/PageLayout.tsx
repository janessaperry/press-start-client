import Header from "../components/Header/Header.tsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer.tsx";

const PageLayout = () => {
  return (
    <>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </>
  )
}

export default PageLayout;