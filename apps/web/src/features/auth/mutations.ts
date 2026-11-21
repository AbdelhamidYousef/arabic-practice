import { useMutation } from '@tanstack/react-query';

import { login, register, startDemoTeacher, startGuest } from '../../api/auth';

import { useSetMe } from './queries';

// Each sign-in path writes the new person into the `me` cache, so the header and every guard
// see them at once, then the page decides where to go.
function useSignIn<V>(fn: (v: V) => ReturnType<typeof login>) {
  const setMe = useSetMe();
  return useMutation({
    mutationFn: fn,
    onSuccess: (user) => setMe(user),
  });
}

export const useLogin = () => useSignIn(login);
export const useRegister = () => useSignIn(register);
export const useGuest = () => useSignIn(startGuest);
export const useDemoTeacher = () => useSignIn(startDemoTeacher);
