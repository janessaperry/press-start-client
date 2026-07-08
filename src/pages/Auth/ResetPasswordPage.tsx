// Libraries
import { InfoIcon } from "@phosphor-icons/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";


// Layouts
// Route Logic
// Components & Assets
import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import { Button, Fieldset } from "@headlessui/react";
import TextInput from "../../components/TextInput.tsx";

// Utils
// import useAuth from "../../hooks/useAuth.tsx";
import { validatePasswordFormat } from "../../utils/validators.ts";

// Styles
// import styles from "./ResetPasswordPage.module.css"

const ResetPasswordPage = () => {
  const baseServerUrl = import.meta.env.VITE_SERVER_URL;
  const [ searchParams ] = useSearchParams();
  const token = searchParams.get("token") || null;
  const navigate = useNavigate();

  const [ password, setPassword ] = useState("");
  const [ passwordError, setPasswordError ] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordValid = validatePasswordFormat(password);
    if (!passwordValid) {
      setPasswordError("Password does not match criteria.");
      return;
    }

    if (!token) {
      console.error("Invalid token");
      return;
    }

    try {
      const response = await updatePassword(token, password);
      if (response?.status === 200) {
        navigate("/sign-in")
      }
      else if (response?.status === 401) {
        setPasswordError("The reset link has expired. Request a new link and try again.");
      }
      else {
        setPasswordError("Unable to reset password. Please try again later.");
      }
    }
    catch (e) {
      console.error(e);
      setPasswordError("Unable to reset password. Please try again later.");
    }
  }

  const updatePassword = async (plainToken: string, newPassword: string) => {
    try {
      return await axios.post(`${baseServerUrl}/auth/password-reset/reset`, {
        plainToken,
        newPassword,
      });
    }
    catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response) {
        return e.response;
      }
      console.error(`Reset password failed: ${e}`);
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
            <p>Don't have an account? <Link to="/sign-up" className="link-primary">
              Sign up
            </Link>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h1>Reset your password</h1>

              <p className="text-lg">
                <span className="font-bold">Almost there!</span> Enter a new password and you'll be set.
              </p>

              <Fieldset className="flex flex-col gap-8 border-none">
                <TextInput id="password"
                  label="Password"
                  placeholder="Enter your new password"
                  required={true}
                  errorMessage={passwordError}
                  value={password}
                  type="password"
                  onChange={(e) => handleInputChange(e)}/>
              </Fieldset>

              <Button className="button primary" type="submit">Submit</Button>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}

export default ResetPasswordPage;