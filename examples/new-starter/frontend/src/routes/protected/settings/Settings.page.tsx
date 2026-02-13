import { Settings as SettingsIcon } from 'lucide-react';
import { ProfileSection, ChangePasswordSection, SessionsSection, DeleteAccountSection } from './components';

export const Settings = () => {
  return (
    <div className="min-h-full bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
        </div>

        <ProfileSection />
        <ChangePasswordSection />
        <SessionsSection />
        <DeleteAccountSection />
      </div>
    </div>
  );
};
