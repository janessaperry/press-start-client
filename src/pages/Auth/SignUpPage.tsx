import axios from "axios";
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Fieldset } from "@headlessui/react";
import { ArrowRightIcon, InfoIcon } from "@phosphor-icons/react";

import useAuth from "../../hooks/useAuth.ts";
import { validateEmailFormat, validatePasswordFormat } from "../../utils/validators.ts";

import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import Alert from "../../components/Alert.tsx";
import TextInput from "../../components/TextInput.tsx";

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
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
  const [ authError, setAuthError ] = useState(false);
  const [ serverError, setServerError ] = useState(false);

  const resetErrors = () => {
    setAuthError(false);
    setServerError(false);
    setFormErrors({
      email: "",
      password: "",
      confirmPassword: ""
    })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    const emailValid = validateEmailFormat(formData.email);
    const passwordValid = validatePasswordFormat(formData.password);
    const confirmPasswordValid = formData.password === formData.confirmPassword;

    const newErrors = {
      email: emailValid ? "" : "Please enter a valid email address.",
      password: passwordValid ? "" : "Password does not match criteria.",
      confirmPassword: confirmPasswordValid ? "" : "Passwords do not match."
    }
    setFormErrors(newErrors);

    const formValid = emailValid && passwordValid && confirmPasswordValid;
    if (!formValid) return;

    await createUser(formData.email, formData.password);
  }

  const createUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${baseServerUrl}/auth/register`, {
        email,
        password
      });

      const token = response.data.token;
      const userId = response.data.userId;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      login(token, userId);
    }
    catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 409) {
          setAuthError(true);
        }
        else {
          setServerError(true);
        }
      }
      else {
        setServerError(true);
      }
      console.error("Sign up failed:", e);
    }
  }


  return (
    <>
      <main className="h-screen">
        <div className="h-full flex">
          <div className="hidden md:flex md:flex-col md:items-start md:justify-between flex-1 p-12 bg-[url(/src/assets/images/sign-up-bg-v3.jpg)] bg-cover bg-no-repeat bg-right">
            <img src={PressStartLogo} alt="Press Start logo" className="h-8 drop-shadow-xl drop-shadow-secondary-900"/>
            <div className="lg:max-w-1/2 flex items-start gap-1.5 bg-primary-900/60 p-2 text-sm rounded-sm"><InfoIcon
              className="icon-sm shrink-0"/> AI generated image - if you have a gaming related image you'd like you
              contribute, please reach out!
            </div>
          </div>

          <section className="bg-primary-700 flex-1 p-12 flex flex-col gap-4">
            <p>Already have an account? <Link to="/sign-in"
              className="link-primary">Sign in</Link></p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h1>Sign up</h1>

              {authError && (
                <Alert message="An account already exists for that email address." variant="warning">
                  <Link to="/sign-in"
                    className="inline-flex gap-1 items-center link-primary">
                    Sign in <ArrowRightIcon weight="bold"/>
                  </Link>
                </Alert>
              )}

              {serverError && (
                <Alert message="Something went wrong. Please try again." variant="warning"/>
              )}

              <Fieldset className="flex flex-col gap-8 border-none">
                <TextInput
                  id="email"
                  label="Email address"
                  placeholder="email@example.com"
                  required={true}
                  errorMessage={formErrors.email}
                  value={formData.email}
                  onChange={(e) => handleInputChange(e)}/>

                <TextInput
                  id="password"
                  label="Password"
                  description="Password should be at least 8 characters including a number and a lowercase letter."
                  type="password"
                  placeholder="Enter your password"
                  required={true}
                  errorMessage={formErrors.password}
                  value={formData.password}
                  onChange={(e) => handleInputChange(e)}/>

                <TextInput
                  id="confirmPassword"
                  label="Confirm Password"
                  description="Re-enter your password to confirm."
                  type="password"
                  placeholder="Re-enter your password"
                  required={true}
                  errorMessage={formErrors.confirmPassword}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e)}/>
              </Fieldset>

              <Button className="button primary" type="submit">Continue</Button>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}

export default SignUpPage;