import { Link } from "react-router-dom";
import FeatureShowcase from "../components/FeatureShowcase.tsx";

const HomePage = () => {
  return (
    <>
      <section className="bg-purple-700 bg-[url(/src/assets/images/purple-logo-pattern-1280x1024.png)] bg-cover">
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