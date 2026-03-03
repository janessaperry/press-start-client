import NotFoundGraphic from "../assets/images/not-found-graphic.svg";

const NotFoundPage = () => {
  return (
    <>
      <section className="container px-4 py-20 flex flex-col items-center gap-10">
        <h1 className="sr-only">Not found</h1>
        <img src={NotFoundGraphic} alt="Error: page not found" className="w-full md:max-w-1/2"/>
        <p className="text-xl lg:text-2xl text-center">Sorry, we can't find what you're looking for!</p>
      </section>
    </>
  )
}

export default NotFoundPage;