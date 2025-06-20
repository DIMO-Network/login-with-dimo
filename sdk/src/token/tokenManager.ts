const ONE_SECOND = 1000;

export const base64UrlDecode = (base64Url: string) => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedData = atob(base64);
  return decodedData;
};

export const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  } catch (e) {
    throw new Error('Error decoding JWT: ' + e);
  }
};

export const isTokenExpired = (token: string) => {
  try {
    const decoded = decodeJWT(token);
    const currentTime = Date.now() / ONE_SECOND;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return true;
  }
};
