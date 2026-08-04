import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Fieldset } from "@headlessui/react";
import { BellIcon, LockKeyIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import apiClient from "../api/client.ts";
import Alert from "../components/Alert.tsx";
import TextInput from "../components/TextInput.tsx";
import useAuth from "../hooks/useAuth.ts";
import { validatePasswordFormat } from "../utils/validators.ts";

type Tab = 'account' | 'notifications';

const AccountSettingsPage = () => {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const [ activeTab, setActiveTab ] = useState<Tab>('account');
  const [ deleteModalOpen, setDeleteModalOpen ] = useState(false);

  const [ currentPassword, setCurrentPassword ] = useState('');
  const [ newPassword, setNewPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ passwordSuccess, setPasswordSuccess ] = useState('');
  const [ serverError, setServerError ] = useState('');

  const [ passwordErrors, setPasswordErrors ] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const resetFormFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  const resetAllErrors = () => {
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordSuccess('');
    setServerError('');
  }

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetAllErrors();

    const currentPasswordValid = validatePasswordFormat(currentPassword);
    const newPasswordValid = validatePasswordFormat(newPassword);
    const confirmPasswordValid = validatePasswordFormat(confirmPassword);

    if (!currentPasswordValid || !newPasswordValid || !confirmPasswordValid) {
      const newErrors = {
        currentPassword: currentPasswordValid ? "" : "Password does not match criteria.",
        newPassword: newPasswordValid ? "" : "Password does not match criteria.",
        confirmPassword: confirmPasswordValid ? "" : "Password does not match criteria."
      }
      setPasswordErrors(newErrors);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrors((prevState) => ({
        ...prevState,
        confirmPassword: "Passwords do not match."
      }))
      return;
    }

    try {
      const response = await apiClient.patch(`/users/${userId}/account/password`,
        { currentPassword, newPassword },
      );

      if (response.status === 200) {
        setPasswordSuccess('Password updated successfully.');
        resetFormFields();
      }
    }
    catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setPasswordErrors((prevState) => ({
          ...prevState,
          currentPassword: "Password is incorrect."
        }))
      }
      else if (axios.isAxiosError(e) && e.response?.status === 429) {
        const retryAfterSecs = Number(e.response.headers['retry-after']);
        const retryAfterMins = Number.isNaN(retryAfterSecs) ? null : Math.ceil(retryAfterSecs / 60);

        setServerError(
          retryAfterMins !== null
            ? `Too many requests. Please try again after ${retryAfterMins} minutes.`
            : 'Too many requests. Please try again later.'
        );
      }
      else {
        setServerError('Unable to update password. Please try again later.');
      }
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await apiClient.delete(`/users/${userId}/account`);
      logout();
      navigate('/');
    }
    catch (e) {
      console.error('Error deleting account:', e);
    }
  }

  const tabs: { id: Tab; label: string; icon: Icon }[] = [
    { id: 'account', label: 'Account', icon: LockKeyIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
  ];

  const handleTabChange = (id: Tab) => {
    const prevTab = activeTab;
    setActiveTab(id);

    if (prevTab === 'account') {
      resetFormFields();
      resetAllErrors();
    }
  }

  return (
    <>
      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-12 space-y-8 md:space-y-12">
        <h1>Account Settings</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="flex flex-row lg:flex-col gap-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => handleTabChange(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors
                    ${activeTab === id
                    ? 'bg-primary-500 text-grey-50'
                    : 'text-secondary-100 hover:bg-primary-500/50 hover:text-grey-50'
                  }`}>
                  <Icon size={18}/>
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'account' &&
              <>
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2>Update Password</h2>
                    <p className="text-secondary-100">
                      Password must be at least 8 characters and include a number and lowercase letter.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <Fieldset className="flex flex-col gap-4 border-none">
                      <TextInput id="currentPassword"
                        label="Current Password" placeholder="Enter your current password" type="password"
                        required
                        value={currentPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                        errorMessage={passwordErrors.currentPassword}
                      />

                      <TextInput id="newPassword"
                        label="New Password" placeholder="Enter your new password" type="password"
                        required
                        value={newPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        errorMessage={passwordErrors.newPassword}
                      />

                      <TextInput id="confirmPassword"
                        label="Confirm New Password" placeholder="Re-enter your new password" type="password"
                        required
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        errorMessage={passwordErrors.confirmPassword}
                      />
                    </Fieldset>

                    {passwordSuccess && <Alert message={passwordSuccess} variant="success"/>}
                    {serverError && <Alert message={serverError} variant="warning"/>}

                    <Button type="submit" className="button primary">Update Password</Button>
                  </form>
                </section>

                <hr className="border-accent-300/20"/>

                <section className="space-y-4">
                  <div className="space-y-2">
                    <h2>Delete Account</h2>
                    <p className="text-secondary-100">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>

                  <Button className="button danger" onClick={() => setDeleteModalOpen(true)}>
                    Delete Account
                  </Button>
                </section>
              </>
            }

            {activeTab === 'notifications' &&
              <section className="space-y-4">
                <h2>Notifications</h2>
                <p className="text-secondary-100">Notification preferences are coming soon.</p>
              </section>
            }
          </div>
        </div>
      </div>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-secondary-900/80"/>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-primary-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <DialogTitle className="text-2xl lg:text-4xl text-grey-50">Delete Account</DialogTitle>
            <p className="text-xl">
              Are you sure you want to delete your account?
            </p>
            <p className="text-lg">
              This will permanently remove all your data, including your game library. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button className="flex-1 button neutral" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 button danger" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AccountSettingsPage;