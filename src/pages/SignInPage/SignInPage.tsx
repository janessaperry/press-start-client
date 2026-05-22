import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Fieldset } from "@headlessui/react";
import { WarningCircleIcon } from "@phosphor-icons/react";

import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import TextInput from "../../components/TextInput.tsx";

import useAuth from "../../hooks/useAuth.tsx";
import { validateEmailFormat } from "../../utils/validators.ts";

const SignInPage = () => {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    const emailValid = validateEmailFormat(email);
    const isPasswordFilled = password !== "";

    const newErrors = {
      email: emailValid ? "" : "Please enter a valid email address.",
      password: isPasswordFilled ? "" : "Password is required."
    }
    setFormErrors(newErrors);

    const formValid = emailValid && isPasswordFilled;
    if (!formValid) {
      return;
    }

    const response = await logIn(email, password);
    if (!response) {
      setAuthError(true);
      return;
    }
    setAuthError(false);

    const token = response.data.token;
    const userId = response.data.userId;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    login(token, userId);
  }

  const logIn = async (email: string, password: string) => {
    try {
      return await axios.post("http://localhost:8080/auth/login", {
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
          <div className="hidden md:inline-block flex-1 p-12 bg-[url(/src/assets/images/sign-up-bg-v2.jpg)] bg-cover bg-no-repeat bg-right">
            <img src={PressStartLogo} alt="Press Start logo"/>
          </div>

          <section className="bg-primary-700 flex-1 p-12 flex flex-col gap-4">
            <p>Don't have an account? <Link to="/sign-up" className="link-primary">Sign up</Link></p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h1>Sign in</h1>

              {authError && (
                <div className="text-error-500 bg-error-500/20 px-4 py-2 rounded-md flex items-baseline gap-2"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true">
                  <div className="flex gap-2">
                    <WarningCircleIcon weight="bold" size={18} className="relative top-1 shrink-0"/>
                    <p className="font-bold">Email or password is incorrect. <Link to="/forgot-password"
                      className="link-primary">Forgot
                      password?</Link>
                    </p>
                  </div>
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

              <Button className="button secondary" type="submit">Continue</Button>
            </form>

            <p className="font-bold">Forgot password? <Link to="/forgot-password" className="link-primary">Reset
              it here</Link>
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

export default SignInPage;