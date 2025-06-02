import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"
import styles from "./SignUpPage.module.css"
import { Link } from "react-router-dom";
import { Button, Description, Field, Fieldset, Input, Label } from "@headlessui/react";

function SignUpPage () {
  return (
    <>
      <main className="h-screen">
        <div className="h-full flex">
          <div className={`flex-1 p-12 ${styles.imageContainer}`}>
            <img src={PressStartLogo} alt="Press Start logo"/>
          </div>

          <section className="bg-secondary flex-1 p-12">
            <p>Already have an account? <Link to="/collection" className={styles.link}>Sign in (update
              link)</Link></p>

            <form>
              <h1>Sign up</h1>

              <Fieldset className="flex flex-col gap-8 border-none">
                <Field className={`${styles.formField} flex flex-col gap-1`}>
                  <Label htmlFor="email"
                         className={styles.formLabel}>Email <span className={styles.required}>*</span></Label>
                  <Input id="email" type="email" placeholder="Email" className={styles.formInput}/>
                </Field>

                <Field className={`${styles.formField} flex flex-col gap-1`}>
                  <Label htmlFor="password"
                         className={styles.formLabel}>Password <span className={styles.required}>*</span></Label>
                  <Input id="password" type="password" placeholder="Password" className={styles.formInput}/>
                  <Description className="mb-0 text-sm text-secondary">Password should be at least 8 characters
                    including a number and a lowercase letter.</Description>
                </Field>

                <Field className={`${styles.formField} flex flex-col gap-1`}>
                  <Label htmlFor="confirmPassword"
                         className={styles.formLabel}>Confirm
                    Password <span className={styles.required}>*</span></Label>
                  <Input id="confirmPassword" type="password" placeholder="Password" className={styles.formInput}/>
                  <Description className="mb-0 text-sm text-secondary">Enter a password update message.</Description>
                </Field>

                <Field className={`${styles.formField} flex flex-col gap-1`}>
                  <Label htmlFor="username"
                         className={styles.formLabel}>Username <span className={styles.required}>*</span></Label>
                  <Description className="mb-0 text-sm text-secondary">Can't think of a username? Generate one now and
                    change it later in your settings.</Description>
                  <Input id="username" type="text" placeholder="Username" className={styles.formInput}/>
                  <Description className="mb-0 text-sm text-secondary">Username may only contain alphanumeric characters
                    or single hyphens, and cannot begin or end with a hyphen.</Description>
                </Field>
              </Fieldset>

              <Button>Create Account</Button>
            </form>
          </section>

        </div>
      </main>
    </>
  )
}

export default SignUpPage;