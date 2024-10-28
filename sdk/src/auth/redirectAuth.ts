export const redirectAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  dimoLogin: string,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string
) => {
  console.log("Redirect mode not implemented yet.");
  // Implement redirect login flow here
  window.location.href = `${dimoLogin}?clientId=${clientId}&redirectUri=${redirectUri}`;
};
