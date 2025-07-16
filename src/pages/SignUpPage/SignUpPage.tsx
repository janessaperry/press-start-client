// Libraries
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Layouts

// Route Logic

// Components & Assets
import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"
import { Button, Fieldset } from "@headlessui/react";

// Utils
import useAuth from "../../hooks/useAuth.tsx";
import { validateEmail, validatePasswordFormat } from "../../utils/validators.ts";

// Pages

// Styles
import styles from "./SignUpPage.module.css"
import TextInput from "../../components/TextInput/TextInput.tsx";

const SignUpPage = () => {
  const { login } = useAuth();
  const [ formData, setFormData ] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [ formErrors, setFormErrors ] = useState({
    email: "",
    password: "",
    confirmPassword: ""
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

    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePasswordFormat(formData.password);
    const confirmPasswordValid = formData.password === formData.confirmPassword;

    const newErrors = {
      email: emailValid ? "" : "Please enter a valid email address.",
      password: passwordValid ? "" : "Password does not match criteria.",
      confirmPassword: confirmPasswordValid ? "" : "Passwords do not match."
    }

    setFormErrors(newErrors);

    const formValid = emailValid && passwordValid && confirmPasswordValid;
    if ( !formValid ) return;

    await createUser(formData.email, formData.password);
  }

  const createUser = async (email: string, password: string) => {
    //todo move this to correct folder after working
    const response = await axios.post("http://localhost:8080/users/sign-up", {
      email,
      password
    });

    const token = response.data.token;
    localStorage.setItem('token', token);
    login(token);
  }


  return (
    <>
      <main className="h-screen">
        <div className="h-full flex">
          <div className={`hidden md:inline-block flex-1 p-12 ${styles.imageContainer}`}>
            <img src={PressStartLogo} alt="Press Start logo"/>
          </div>

          <section className="bg-secondary flex-1 p-12">
            <p>Already have an account? <Link to="/log-in" className={styles.link}>Sign in (update
              link)</Link></p>

            <form onSubmit={handleSubmit}>
              <h1>Sign up</h1>

              <Fieldset className="flex flex-col gap-8 border-none">
                <TextInput
                  id="email"
                  label="Email"
                  placeholder="Email"
                  required={true}
                  errorMessage={formErrors.email}
                  value={formData.email}
                  onChange={(e) => handleInputChange(e)}/>

                <TextInput
                  id="password"
                  label="Password"
                  description="Password should be at least 8 characters including a number and a lowercase letter."
                  type="password"
                  placeholder="Password"
                  required={true}
                  errorMessage={formErrors.password}
                  value={formData.password}
                  onChange={(e) => handleInputChange(e)}/>

                <TextInput
                  id="confirmPassword"
                  label="Confirm Password"
                  description="Re-enter your password to confirm."
                  type="password"
                  placeholder="Password"
                  required={true}
                  errorMessage={formErrors.confirmPassword}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e)}/>
              </Fieldset>

              <Button className="mt-6" type="submit">Create Account</Button>
            </form>
          </section>

        </div>
      </main>
    </>
  )
}

export default SignUpPage;