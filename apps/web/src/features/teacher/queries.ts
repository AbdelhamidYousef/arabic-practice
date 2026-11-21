import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchInvite } from '../../api/auth';
import { ApiError } from '../../api/client';
import * as api from '../../api/teacher';
import { keys } from '../../lib/query-client';

export const useTeacherLessons = () =>
  useQuery({
    queryKey: keys.teacher.lessons,
    queryFn: ({ signal }) => api.fetchTeacherLessons(signal),
  });

export const useTeacherLesson = (id: string, enabled = true) =>
  useQuery({
    queryKey: keys.teacher.lesson(id),
    queryFn: ({ signal }) => api.fetchTeacherLesson(id, signal),
    enabled,
    // The editor owns a local copy of the form; a background refetch must not swap it.
    staleTime: Infinity,
    gcTime: 0,
  });

export const useTeacherLearners = () =>
  useQuery({
    queryKey: keys.teacher.learners,
    queryFn: ({ signal }) => api.fetchTeacherLearners(signal),
  });

export const useTeacherLearner = (id: string) =>
  useQuery({
    queryKey: keys.teacher.learner(id),
    queryFn: ({ signal }) => api.fetchTeacherLearner(id, signal),
  });

export const useTranscript = (id: string) =>
  useQuery({
    queryKey: keys.teacher.transcript(id),
    queryFn: ({ signal }) => api.fetchTranscript(id, signal),
  });

export const useInvites = () =>
  useQuery({ queryKey: keys.teacher.invites, queryFn: ({ signal }) => api.fetchInvites(signal) });

export const useUsage = () =>
  useQuery({ queryKey: keys.teacher.usage, queryFn: ({ signal }) => api.fetchUsage(signal) });

// There is no "are invites open" endpoint. The public invite lookup answers 403 INVITES_CLOSED
// for any code while sign-up is off, and 404 (or 200) while it is on, so one look-up of a code
// that cannot exist tells the teacher page which it is. Errors other than "closed" mean open/unknown.
export const useInvitesClosed = () =>
  useQuery({
    queryKey: keys.teacher.invitesOpen,
    queryFn: async ({ signal }) => {
      try {
        await fetchInvite('probe-code-that-does-not-exist', signal);
        return false;
      } catch (error) {
        return error instanceof ApiError && error.code === 'INVITES_CLOSED';
      }
    },
    retry: false,
    staleTime: 5 * 60_000,
  });

export function useSetLearnerLevel(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (level: Parameters<typeof api.setLearnerLevel>[1]) =>
      api.setLearnerLevel(id, level),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: keys.teacher.learner(id) });
      void client.invalidateQueries({ queryKey: keys.teacher.learners });
    },
  });
}

export function useSaveLesson(id: string | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof api.createTeacherLesson>[0]) =>
      id ? api.updateTeacherLesson(id, input) : api.createTeacherLesson(input),
    onSuccess: ({ lesson }) => {
      client.setQueryData(keys.teacher.lesson(lesson.id), { lesson });
      void client.invalidateQueries({ queryKey: keys.teacher.lessons, exact: true });
      // Learners see lessons too (a publish, a title).
      void client.invalidateQueries({ queryKey: keys.lessons });
    },
  });
}

export function useDeleteLesson() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTeacherLesson,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: keys.teacher.lessons, exact: true });
      void client.invalidateQueries({ queryKey: keys.lessons });
    },
  });
}

export function useCreateInvite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.createInvite,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.teacher.invites }),
  });
}
