import axios from 'axios';

export default async function refreshToken() {
  try {
    await axios.post(`/authentication/refresh-token`, {
      withCredentials: true,
    });

    return true;
  } catch (error) {
    return false;
  }
}
