// Libraries
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Layouts
// Route Logic
// Components & Assets
import { Button, Fieldset } from "@headlessui/react";
import { WarningCircleIcon } from "@phosphor-icons/react";
import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"
import TextInput from "../../components/TextInput/TextInput.tsx";

// Utils
import useAuth from "../../hooks/useAuth.tsx";
import { validateEmail } from "../../utils/validators.ts";

// Styles


const LogInPage = () => {
  const { login } = useAuth();
  const [ formData, setFormData ] = useState({
    email: "",
    password: ""
  })
  const [ formErrors, setFormErrors ] = useState({
    email: "",
    password: ""
  })
  const [ authError, setAuthError ] = useState(false);

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
    const isPasswordFilled = password !== "";

    const newErrors = {
      email: emailValid ? "" : "Please enter a valid email address.",
      password: isPasswordFilled ? "" : "Password is required."
    }
    setFormErrors(newErrors);

    const formValid = emailValid && isPasswordFilled;
    if ( !formValid ) {
      return;
    }

    const response = await logIn(email, password);
    if ( !response ) {
      setAuthError(true);
      return;
    }
    setAuthError(false);

    const token = response.data.token;
    localStorage.setItem('token', token);
    login(token);
  }

  const logIn = async (email: string, password: string) => {
    try {
      return await axios.post("http://localhost:8080/users/log-in", {
        email,
        password
      });
    }
    catch (e) {
      console.error(`Login failed: ${e}`);
    }
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h1>Sign in</h1>

              {authError && (
                <div className={`text-error bg-error px-4 py-2 rounded-md flex items-center gap-2`}
                     role="alert"
                     aria-live="assertive"
                     aria-atomic="true">
                  <WarningCircleIcon weight="bold" size={18}/>
                  <p className={`font-bold`}>Email or password is incorrect.</p>
                </div>
              )}

              <Fieldset className="flex flex-col gap-8 border-none">
                <TextInput id="email"
                           label="Email"
                           placeholder="Email"
                           required={true}
                           errorMessage={formErrors.email}
                           value={formData.email}
                           onChange={(e) => handleInputChange(e)}/>

                <TextInput id="password"
                           label="Password"
                           type="password"
                           placeholder="Password"
                           required={true}
                           errorMessage={formErrors.password}
                           value={formData.password}
                           onChange={(e) => handleInputChange(e)}/>
              </Fieldset>

              <Button className="" type="submit">Sign In</Button>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}

export default LogInPage;