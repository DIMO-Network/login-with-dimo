export const redirectAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  dimoLogin: string,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string, //We don't want to send an API key in the url
  permissionTemplateId?: string,
  vehicles?: string[]
) => {

  // Create URLSearchParams instance
  const params = new URLSearchParams();

  if (clientId) params.append("clientId", clientId);
  if (redirectUri) params.append("redirectUri", redirectUri);
  if (permissionTemplateId) params.append("permissionTemplateId", permissionTemplateId);
  if (vehicles && vehicles.length > 0) {
    vehicles.forEach(vehicle => params.append("vehicles", vehicle));
  }  

  // Construct the full URL
  window.location.href = `${dimoLogin}?${params.toString()}`;
};
