import axios from "axios";
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button, Fieldset } from "@headlessui/react";
import apiClient from "../../api/client.ts";
import { getRetryAfterMessage } from "../../utils/rateLimiting.ts";
import { validateEmailFormat } from "../../utils/validators.ts";
import Alert from "../../components/Alert.tsx";
import TextInput from "../../components/TextInput.tsx";

const COOLDOWN_KEY = 'forgotPasswordCooldownExpiry';

const getInitialCountdown = (): number => {
  const expiry = sessionStorage.getItem(COOLDOWN_KEY);
  if (!expiry) return 0;

  const remaining = Math.ceil((Number(expiry) - Date.now()) / 1000);
  if (remaining > 0) return remaining;

  sessionStorage.removeItem(COOLDOWN_KEY);
  return 0;
};

const ForgotPasswordPage = () => {
  const [ email, setEmail ] = useState("")
  const [ emailError, setEmailError ] = useState("")
  const [ linkSent, setLinkSent ] = useState(false);
  const [ showCooldownAlert, setShowCooldownAlert ] = useState(false);
  const [ countdown, setCountdown ] = useState<number>(getInitialCountdown);
  const [ serverError, setServerError ] = useState('');
  const [ rateLimitError, setRateLimitError ] = useState('');

  const startCooldown = (seconds: number) => {
    sessionStorage.setItem(COOLDOWN_KEY, String(Date.now() + seconds * 1000));
    setCountdown(seconds);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setServerError("");
    setRateLimitError("");

    if (countdown > 0) {
      setShowCooldownAlert(true);
      return;
    }

    const emailValid = validateEmailFormat(email);
    if (!emailValid) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const response = await requestReset(email);
    if (response) {
      setLinkSent(true);
      startCooldown(60);
    }
  }

  const requestReset = async (email: string) => {
    try {
      return await apiClient.post(`/auth/password-reset/request`, {
        email
      });
    }
    catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 429) {
          if (e.response?.data?.retryAfter !== undefined) {
            startCooldown(e.response.data.retryAfter);
          }
          else {
            setRateLimitError(getRetryAfterMessage(e.response!.headers));
          }
        }
        else {
          setServerError("Something went wrong. Please try again.");
        }
      }
      else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  useEffect(() => {
    if (countdown <= 0) {
      sessionStorage.removeItem(COOLDOWN_KEY);
      setShowCooldownAlert(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prevState => prevState > 0 ? prevState - 1 : 0);
    }, 1000);

    return () => clearInterval(interval)
  }, [ countdown ])

  return (
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

        {showCooldownAlert && (
          <Alert message={`Please wait ${countdown} seconds before requesting another reset link.`}
            variant="warning"/>
        )}

        {rateLimitError && (
          <Alert message={rateLimitError} variant="warning"/>
        )}

        {serverError && (
          <Alert message={serverError} variant="warning"/>
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
  )
}

export default ForgotPasswordPage;