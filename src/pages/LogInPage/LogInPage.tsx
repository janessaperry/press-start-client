// Libraries
import { Link } from "react-router-dom";
import { Button, Description, Field, Fieldset, Input, Label } from "@headlessui/react";

// Layouts

// Route Logic

// Components & Assets
import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"

// Utils

// Pages

// Styles


const LogInPage = () => {
  return (
    <>
      <main className="h-screen">
        <div className="h-full flex">
          <div className={`flex-1 p-12`}>
            <img src={PressStartLogo} alt="Press Start logo"/>
          </div>

          <section className="bg-secondary flex-1 p-12">
            <p>No account? <Link to="/sign-up" className="text-link-tertiary">Create account</Link></p>

            <form>
              <h1>Sign up</h1>

              <Fieldset className="flex flex-col gap-8 border-none">
                <Field className={`flex flex-col gap-1`}>
                  <Label htmlFor="email"
                  >Email <span>*</span></Label>
                  <Input id="email" type="email" placeholder="Email"/>
                </Field>

                <Field className={`flex flex-col gap-1`}>
                  <Label htmlFor="password"
                  >Password <span>*</span></Label>
                  <Input id="password" type="password" placeholder="Password"/>
                  <Description className="mb-0 text-sm text-secondary">Password should be at least 8 characters
                    including a number and a lowercase letter.</Description>
                </Field>

              </Fieldset>

              <Button>Sign In</Button>
            </form>
          </section>

        </div>
      </main>
    </>
  )
}

export default LogInPage;