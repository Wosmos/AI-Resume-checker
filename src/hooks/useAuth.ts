// src/hooks/useAuth.ts
import { useAuth as useFirebaseAuth } from '@/components/auth/AuthProvider';

export const useAuth = () => {
  return useFirebaseAuth();
};
