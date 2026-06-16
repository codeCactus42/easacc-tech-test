import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/auth-context';

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <Redirect href={isLoggedIn ? '/(tabs)/settings' : '/login'} />;
}
