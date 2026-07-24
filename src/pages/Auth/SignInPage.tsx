import axios from "axios";
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Fieldset } from "@headlessui/react";
import apiClient from "../../api/client.ts";
import useAuth from "../../hooks/useAuth.ts";
import { validateEmailFormat } from "../../utils/validators.ts";
import Alert from "../../components/Alert.tsx";
import TextInput from "../../components/TextInput.tsx";

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
  const [ serverError, setServerError ] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(false);
    setServerError(false);

    const { email, password } = formData;
    const emailValid = validateEmailFormat(email);
    const isPasswordFilled = password !== "";

    const newErrors = {
      email: emailValid ? "" : "Please enter a valid email address.",
      password: isPasswordFilled ? "" : "Password is required."
    }
    setFormErrors(newErrors);

    const formValid = emailValid && isPasswordFilled;
    if (!formValid) return;

    const response = await logIn(email, password);
    if (!response) return;


    const token = response.data.token;
    const userId = response.data.userId;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    login(token, userId);
  }

  const logIn = async (email: string, password: string) => {
    try {
      return await apiClient.post(`/auth/login`, {
        email,
        password
      });
    }
    catch (e) {
      if (axios.isAxiosError(e)) {
        setAuthError(true);
      }
      else {
        setServerError(true);
      }
      console.error("Login failed:", e);
      return;
    }
  }

  return (
    <section className="bg-primary-700 flex-1 p-12 flex flex-col gap-4">
      <p>Don't have an account? <Link to="/sign-up" className="link-primary">Sign up</Link></p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <h1>Sign in</h1>

        {authError && (
          <Alert message="Email or password is incorrect." variant="warning">
            <Link to="/forgot-password" className="link-primary">Forgot password?</Link>
          </Alert>
        )}

        {serverError && (
          <Alert message="Something went wrong. Please try again." variant="warning"/>
        )}

        <Fieldset className="flex flex-col gap-8 border-none">
          <TextInput id="email"
            label="Email address"
            placeholder="email@example.com"
            required={true}
            errorMessage={formErrors.email}
            value={formData.email}
            onChange={(e) => handleInputChange(e)}/>

          <TextInput id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required={true}
            errorMessage={formErrors.password}
            value={formData.password}
            onChange={(e) => handleInputChange(e)}/>
        </Fieldset>

        <Button className="button primary" type="submit">Continue</Button>
      </form>

      <p className="font-bold">Forgot password? <Link to="/forgot-password" className="link-primary">
        Reset it here
      </Link>
      </p>
    </section>
  )
}

export default SignInPage;