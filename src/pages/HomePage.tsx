import { Link } from "react-router-dom";
import Logomark from "../assets/images/logomark.svg"
import FeatureShowcase from "../components/FeatureShowcase.tsx";

const HomePage = () => {
  return (
    <>
      <section className="relative bg-purple-700 space-y-10 overflow-hidden">
        <div className="container px-4 md:px-10 py-12 md:py-24">
          <div className="relative w-full md:w-1/2 space-y-10 z-10">
            <div className="space-y-4">
              <h1 className="text-pretty">Keep your game collection organized</h1>
              <p className="text-lg lg:text-xl">
                Keep track of the games you own across platforms and spend less time deciding what to play next.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/explore" className="button primary">Start exploring</Link>
              <Link to="/sign-up" className="button ghost">Create account</Link>
            </div>
          </div>
        </div>

        <img src={Logomark}
          alt="Logomark"
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 left-0 lg:left-auto lg:-right-10 z-0 h-[140%] object-cover pointer-events-none"/>
      </section>


      <section className="container px-4 md:px-10 py-12 md:py-24 space-y-10">
        <FeatureShowcase/>


        <div className="flex flex-col items-start md:flex-row gap-6 md:gap-10 p-4 md:py-6 md:px-10 bg-primary-500 rounded-3xl">
          <div className="grow space-y-4">
            <h2>Ready to start your collection?</h2>
            <p className="text-lg lg:text-xl">Create an account to start tracking the games you own today.</p>
          </div>

          <Link to="/sign-up" className="button primary min-w-fit">Create Account</Link>
        </div>
      </section>
    </>
  )
}

export default HomePage;