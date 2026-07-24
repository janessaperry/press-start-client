import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Fieldset } from "@headlessui/react";
import apiClient from "../../api/client.ts";
import { validatePasswordFormat } from "../../utils/validators.ts";
import Alert from "../../components/Alert.tsx";
import TextInput from "../../components/TextInput.tsx";

const ResetPasswordPage = () => {
  const [ searchParams ] = useSearchParams();
  const token = searchParams.get("token") || null;
  const navigate = useNavigate();

  const [ password, setPassword ] = useState("");
  const [ passwordError, setPasswordError ] = useState("");
  const [ authError, setAuthError ] = useState(false);
  const [ serverError, setServerError ] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const resetErrors = () => {
    setAuthError(false);
    setServerError(false);
    setPasswordError("");
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    const passwordValid = validatePasswordFormat(password);
    if (!passwordValid) {
      setPasswordError("Password does not match criteria.");
      return;
    }

    if (!token) return;

    const response = await updatePassword(token, password);
    if (response) {
      navigate("/sign-in");
    }
  }

  const updatePassword = async (plainToken: string, newPassword: string) => {
    try {
      return await apiClient.post(`/auth/password-reset/reset`, {
        plainToken,
        newPassword,
      });
    }
    catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const statusCode = e.response?.status;
        if (statusCode === 400) {
          setAuthError(true);
        }
        else {
          setServerError(true)
        }
      }
      else {

        setServerError(true);
      }
      console.error("Reset password failed:", e);
    }
  }

  return (
    <section className="bg-primary-700 flex-1 p-12 flex flex-col gap-4">
      <p>
        Don't have an account? <Link to="/sign-up" className="link-primary">Sign up</Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <h1>Reset your password</h1>

        {authError && (
          <Alert message="This reset link is invalid or has expired." variant="warning">
            <Link to="/forgot-password" className="link-primary">Request a new one.</Link>
          </Alert>
        )}

        {serverError && (
          <Alert message="Unable to reset password. Please try again later." variant="warning"/>
        )}

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
  )
}

export default ResetPasswordPage;