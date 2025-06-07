// Libraries
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Layouts

// Route Logic

// Components & Assets
import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"
import { Button, Description, Field, Fieldset, Input, Label } from "@headlessui/react";

// Utils
import useAuth from "../../hooks/useAuth.tsx";
import { validateEmail, validatePassword } from "../../utils/validators.ts";

// Pages

// Styles
import styles from "./SignUpPage.module.css"

const SignUpPage = () => {
  const { login } = useAuth();
  const [ formData, setFormData ] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
        ...formData,
        [ e.target.id ]: e.target.value
      }
    )
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formValid = false;

    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);
    const confirmPasswordValid = !!formData.confirmPassword && formData.password === formData.confirmPassword;
    formValid = emailValid && passwordValid && confirmPasswordValid;


    if ( !formValid ) {
      return;
    }

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
          <div className={`flex-1 p-12 ${styles.imageContainer}`}>
            <img src={PressStartLogo} alt="Press Start logo"/>
          </div>

          <section className="bg-secondary flex-1 p-12">
            <p>Already have an account? <Link to="/log-in" className={styles.link}>Sign in (update
              link)</Link></p>

            <form onSubmit={handleSubmit}>
              <h1>Sign up</h1>

              <Fieldset className="flex flex-col gap-8 border-none">
                <Field className={`${styles.formField} flex flex-col gap-1`}>
                  <Label htmlFor="email"
                         className={styles.formLabel}>Email <span className={styles.required}>*</span></Label>
                  <Input id="email"
                         name="email"
                         type="email"
                         placeholder="Email"
                         className={styles.formInput}
                         value={formData.email}
                         onChange={(e) => handleInputChange(e)}/>
                </Field>

                <Field className={`${styles.formField} flex flex-col gap-1`}>
                  <Label htmlFor="password"
                         className={styles.formLabel}>Password <span className={styles.required}>*</span></Label>
                  <Input id="password"
                         name="password"
                         type="password"
                         placeholder="Password"
                         className={styles.formInput}
                         value={formData.password}
                         onChange={(e) => handleInputChange(e)}/>
                  <Description className="mb-0 text-sm text-secondary">Password should be at least 8 characters
                    including a number and a lowercase letter.</Description>
                </Field>

                <Field className={`${styles.formField} flex flex-col gap-1`}>
                  <Label htmlFor="confirmPassword"
                         className={styles.formLabel}>Confirm
                    Password <span className={styles.required}>*</span></Label>
                  <Input id="confirmPassword"
                         name="confirmPassword"
                         type="password"
                         placeholder="Password"
                         className={styles.formInput}
                         value={formData.confirmPassword}
                         onChange={(e) => handleInputChange(e)}/>
                  <Description className="mb-0 text-sm text-secondary">Enter a password update message.</Description>
                </Field>
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