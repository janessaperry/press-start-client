import { Link } from "react-router-dom";
import Logomark from "../assets/images/logomark.svg"

const HomePage = () => {
  return (
    <section className="relative px-4 md:px-10 py-12 md:py-24 bg-purple-700 space-y-10 overflow-hidden">
      <div className="container">
        <div className="relative w-full md:w-1/2 space-y-10 z-10">
          <div className="container space-y-4">
            <h1 className="">Keep your game collection organized</h1>
            <p className="text-xl">Keep track of the games you own across platforms and spend less time deciding what to
              play next.
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
  )
}

export default HomePage;