import { Link } from "react-router-dom";
import Logomark from "../assets/images/logomark.svg"

const HomePage = () => {
  return (
    <>
      <section className="relative bg-purple-700 space-y-10 overflow-hidden">
        <div className="container px-4 md:px-10 py-12 md:py-24">
          <div className="relative w-full md:w-1/2 space-y-10 z-10">
            <div className="space-y-4">
              <h1 className="text-pretty">Keep your game collection organized</h1>
              <p className="text-lg lg:text-xl">Keep track of the games you own across platforms and spend less time
                deciding what
                to play next.
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

      <section className="container px-4 md:px-10 py-12 md:py-24">
        <div>
          <h2>Everything you need to manage your collection</h2>
          <p className="text-lg lg:text-xl">
            From discovering new games to organizing your backlog, Press Start keeps everything in one place.
          </p>
        </div>

        <div>
          <div>
            <h3>Discover games</h3>
            <p>Explore games across PlayStation, Xbox, Nintendo, and PC and add to your collection.</p>
          </div>
          <div>
            <h3>Organize your collection</h3>
            <p>Keep track of physical and digital games across platforms in one place.</p>
          </div>
          <div>
            <h3>Manage your backlog</h3>
            <p>Update play status in your collection so you always know what's next.</p>
          </div>
          <div>
            <h3>Decide what to play next</h3>
            <p>Filter your collection by platform, genre, play time, rating, and more to find what you're in the mood
              for.
            </p>
          </div>
        </div>

        <div>
          Image placeholder
        </div>
      </section>

      <div className="container px-4 md:px-10">
        <section className="flex flex-col items-start md:flex-row gap-6 md:gap-10 p-4 md:py-6 md:px-10 bg-primary-500 rounded-3xl">
          <div className="grow space-y-4">
            <h2>Ready to start your collection?</h2>
            <p className="text-lg lg:text-xl">Create an account to start tracking the games you own today.</p>
          </div>

          <Link to="/sign-up" className="button primary min-w-fit">Create Account</Link>
        </section>
      </div>
    </>
  )
}

export default HomePage;