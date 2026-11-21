import { useMutation } from '@tanstack/react-query';

import { deleteAccount, fetchExport } from '../../api/account';

// Turns the API's JSON into a file the browser saves. The download is built from the response
// rather than navigating to the URL, so the session cookie, the Origin rules and the error
// handling are the same as for every other call.
function saveJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const useExportData = () =>
  useMutation({
    mutationFn: fetchExport,
    onSuccess: (data) => saveJson(data, 'arabic-practice-export.json'),
  });

// The session is gone with the account. The caller leaves the page BEFORE the cache forgets the
// person (`useSetMe(null)`): the other way round, the settings page's own guard would send them to
// the sign-in for an instant.
export const useDeleteAccount = () => useMutation({ mutationFn: deleteAccount });
