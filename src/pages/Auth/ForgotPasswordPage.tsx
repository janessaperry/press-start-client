import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Fieldset } from "@headlessui/react";
import { CheckCircleIcon, InfoIcon } from "@phosphor-icons/react";

import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import TextInput from "../../components/TextInput.tsx";

import { validateEmailFormat } from "../../utils/validators.ts";

const ForgotPasswordPage = () => {
  // const { login } = useAuth();
  const [ email, setEmail ] = useState("")
  const [ emailError, setEmailError ] = useState("")
  const [ linkSent, setLinkSent ] = useState(false);
  const [ rateLimitHit, setRateLimitHit ] = useState(false);
  const [ countdown, setCountdown ] = useState<number>(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValid = validateEmailFormat(email);
    if (!emailValid) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const response = await requestReset(email);
    if (response && response.status === 200) {
      setLinkSent(true);
      return;
    }
  }

  const requestReset = async (email: string) => {
    try {
      return await axios.post("http://localhost:8080/auth/password-reset/request", {
        email
      });
    }
    catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (status === 429) {
          setRateLimitHit(true);

          const retryAfter = e.response?.data?.retryAfter || 60;
          if (countdown <= 0) setCountdown(retryAfter);
        }

        return;
      }

      console.error(`Request failed:`, e);
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
                <div className="text-info-500 bg-info-900/50 px-4 py-2 rounded-md flex gap-2"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true">
                  <CheckCircleIcon weight="bold" size={18} className="relative top-1 shrink-0"/>
                  <p className="font-bold">If an account exists for that email, we’ve sent a password reset link.
                    Check your inbox to continue.
                  </p>
                </div>
              )}

              {rateLimitHit && (
                <div className="text-error-500 bg-error-900/50 px-4 py-2 rounded-md flex gap-2"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true">
                  <CheckCircleIcon weight="bold" size={18} className="relative top-1 shrink-0"/>
                  <p className="font-bold">Please wait {countdown} seconds before requesting another reset
                    link.
                  </p>
                </div>
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