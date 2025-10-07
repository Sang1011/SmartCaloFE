import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '723818287625-s3l202uu5n18vuc821it5i9ep09jrud0.apps.googleusercontent.com', // CHỈ CẦN webClientId
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export const useGoogleAuth = () => {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      return userInfo.data?.idToken;
    } catch (error: any) {
      console.error('Google Sign-In error:', error.code, error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out error:', error);
    }
  };

  return { signIn, signOut };
};