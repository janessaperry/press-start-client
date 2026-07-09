import axios from "axios";
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button, Fieldset } from "@headlessui/react";
import { InfoIcon } from "@phosphor-icons/react";

import { validateEmailFormat } from "../../utils/validators.ts";

import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import Alert from "../../components/Alert.tsx";
import TextInput from "../../components/TextInput.tsx";

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const ForgotPasswordPage = () => {
  const [ email, setEmail ] = useState("")
  const [ emailError, setEmailError ] = useState("")
  const [ linkSent, setLinkSent ] = useState(false);
  const [ rateLimitHit, setRateLimitHit ] = useState(false);
  const [ countdown, setCountdown ] = useState<number>(0);
  const [ serverError, setServerError ] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setServerError(false);

    const emailValid = validateEmailFormat(email);
    if (!emailValid) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const response = await requestReset(email);
    if (response) {
      setLinkSent(true);
      return;
    }
  }

  const requestReset = async (email: string) => {
    try {
      return await axios.post(`${baseServerUrl}/auth/password-reset/request`, {
        email
      });
    }
    catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 429) {
          setRateLimitHit(true);
          const retryAfter = e.response?.data?.retryAfter || 60;
          if (countdown <= 0) setCountdown(retryAfter);
        }
        else {
          setServerError(true);
        }
      }
      else {
        setServerError(true);
      }
      console.error("Request failed:", e);
      return;
    }
  }

  useEffect(() => {
    if (countdown <= 0) {
      setRateLimitHit(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prevState => prevState > 0 ? prevState - 1 : 0);
    }, 1000);

    return () => clearInterval(interval)
  }, [ countdown ])

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
            <p>Don't have an account? <Link to="/sign-up" className="link-primary">Sign up</Link></p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h1>Reset your password</h1>
              <p className="text-lg"><span className="font-bold">Forgot your password?</span> No worries - enter your
                email and we'll send you a reset link.
              </p>

              {linkSent && (
                <Alert message="If an account exists for that email, we've sent a password reset link. Check your inbox to continue."
                  variant="info"/>
              )}

              {rateLimitHit && (
                <Alert message={`Please wait ${countdown} seconds before requesting another reset link.`}
                  variant="warning"/>
              )}

              {serverError && (
                <Alert message="Something went wrong. Please try again." variant="warning"/>
              )}

              <Fieldset className="flex flex-col gap-8 border-none">
                <TextInput id="email"
                  label="Email address"
                  placeholder="email@example.com"
                  required={true}
                  errorMessage={emailError}
                  value={email}
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

export default ForgotPasswordPage;