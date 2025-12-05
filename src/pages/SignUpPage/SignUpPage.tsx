// Libraries
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Layouts

// Route Logic

// Components & Assets
import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import { Button, Fieldset } from "@headlessui/react";

// Utils
import useAuth from "../../hooks/useAuth.tsx";
import { validateEmailFormat, validatePasswordFormat } from "../../utils/validators.ts";

// Pages

// Styles
import styles from "./SignUpPage.module.css"
import TextInput from "../../components/TextInput.tsx";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react";

const SignUpPage = () => {
  const {login} = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [authError, setAuthError] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  }


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      //todo move this to correct folder after working
      const response = await axios.post("http://localhost:8080/auth/register", {
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      login(token);
    }
    catch (e) {
      setAuthError(true);
      console.error(`Sign up failed: ${e}`);
    }

  }


  return (
    <>
      <main className="h-screen">
        <div className="h-full flex">
          <div className={`hidden md:inline-block flex-1 p-12 ${styles.imageContainer}`}>
            <img src={PressStartLogo} alt="Press Start logo"/>
          </div>

          <section className="bg-primary-700 flex-1 p-12 flex flex-col gap-4">
            <p>Already have an account? <Link to="/sign-in"
              className="">Sign in</Link></p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h1>Sign up</h1>

              {authError && (
                <div className="text-error-500 bg-error-500/20 px-4 py-2 rounded-md flex flex-col gap-1"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true">

                  <div className="flex gap-2">
                    <WarningCircleIcon weight="bold" size={18} className="relative top-1 shrink-0"/>
                    <p className="font-bold">An account already exists for that email
                      address. <Link to="/sign-in"
                        className="inline-flex gap-1 items-center text-interactive-primary hover:text-interactive-primary-hover">
                        Sign in <ArrowRightIcon weight="bold"/>
                      </Link>
                    </p>
                  </div>
                </div>
              )}

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

              <Button className="bg-interactive-secondary hover:bg-interactive-secondary-hover text-grey-50 "
                type="submit">Continue</Button>
            </form>
          </section>

        </div>
      </main>
    </>
  )
}

export default SignUpPage;