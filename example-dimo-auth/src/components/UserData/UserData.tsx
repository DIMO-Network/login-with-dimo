import React from 'react';
import { useDimoAuthState } from '@dimo-network/login-with-dimo';

type UserDataProps = Record<string, never>;

export const UserData: React.FC<UserDataProps> = () => {
  const { isAuthenticated, email, walletAddress } = useDimoAuthState();

  if (!isAuthenticated) return null;

  return (
    <div>
      <p>Connected User</p>
      <p>Wallet Address: {walletAddress}</p>
      {!!email && <p>{email}</p>}
    </div>
  );
};
