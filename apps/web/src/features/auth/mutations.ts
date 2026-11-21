import { useMutation } from '@tanstack/react-query';

import {
  changePassword,
  login,
  logout,
  register,
  startDemoTeacher,
  startGuest,
} from '../../api/auth';

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

// Sign out: the API forgets the session, then every cached answer of this person is dropped and
// the header turns back into "Sign in".
export function useLogout() {
  const setMe = useSetMe();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => setMe(null),
  });
}

// The session stays (the API keeps this one and ends the others), so nothing is cached differently.
export const useChangePassword = () => useMutation({ mutationFn: changePassword });
