export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

//change name of this to validate format or something?
export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
  return regex.test(password);
}