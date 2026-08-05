import axios from "axios";
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Fieldset } from "@headlessui/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import apiClient from "../../api/client.ts";
import { getRetryAfterMessage } from "../../utils/rateLimiting.ts";
import useAuth from "../../hooks/useAuth.ts";
import { validateEmailFormat, validatePasswordFormat } from "../../utils/validators.ts";
import Alert from "../../components/Alert.tsx";
import TextInput from "../../components/TextInput.tsx";

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
  const [ serverError, setServerError ] = useState('');

  const resetErrors = () => {
    setAuthError(false);
    setServerError('');
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
      const response = await apiClient.post(`/auth/register`, {
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
        else if (e.response?.status === 429) {
          setServerError(getRetryAfterMessage(e.response.headers));
        }
        else {
          setServerError('Something went wrong. Please try again.');
        }
      }
      else {
        setServerError('Something went wrong. Please try again.');
      }
      console.error("Sign up failed:", e);
    }
  }


  return (
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
          <Alert message={serverError} variant="warning"/>
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
  )
}

export default SignUpPage;