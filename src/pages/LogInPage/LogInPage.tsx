// Libraries
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Layouts
// Route Logic
// Components & Assets
import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"
import { Button, Field, Fieldset, Input, Label } from "@headlessui/react";

// Utils
import useAuth from "../../hooks/useAuth.tsx";
import { validateEmail, validatePasswordFormat } from "../../utils/validators.ts";

// Styles


const LogInPage = () => {
  const { login } = useAuth();
  const [ formData, setFormData ] = useState({
    email: "",
    password: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
        ...formData,
        [ e.target.id ]: e.target.value
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    const emailValid = validateEmail(email);
    const passwordFormatValid = validatePasswordFormat(password);
    const formValid = emailValid && passwordFormatValid;

    if ( !formValid ) {
      return;
    }

    const response = await logIn(email, password);
    const token = response.data.token;
    localStorage.setItem('token', token);
    login(token);
  }

  const logIn = async (email: string, password: string) => {
    return await axios.post("http://localhost:8080/users/log-in", {
      email,
      password
    });
  }

  return (
    <>
      <main className="h-screen">
        <div className="h-full flex">
          <div className={`flex-1 p-12`}>
            <img src={PressStartLogo} alt="Press Start logo"/>
          </div>

          <section className="bg-secondary flex-1 p-12">
            <p>No account? <Link to="/sign-up" className="text-link-tertiary">Create account</Link></p>

            <form onSubmit={handleSubmit}>
              <h1>Sign in</h1>

              <Fieldset className="flex flex-col gap-8 border-none">
                <Field className={`flex flex-col gap-1`}>
                  <Label htmlFor="email"
                  >Email <span>*</span></Label>
                  <Input id="email" name="email" placeholder="Email"
                         value={formData.email}
                         onChange={(e) => handleInputChange(e)}/>
                </Field>

                <Field className={`flex flex-col gap-1`}>
                  <Label htmlFor="password"
                  >Password <span>*</span></Label>
                  <Input id="password"
                         name="password"
                         type="password"
                         placeholder="Password"
                         value={formData.password}
                         onChange={(e) => handleInputChange(e)}/>
                </Field>
              </Fieldset>

              <Button className="mt-6" type="submit">Sign In</Button>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}

export default LogInPage;