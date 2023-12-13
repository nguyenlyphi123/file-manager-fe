import { useQueryClient } from '@tanstack/react-query';

function useClient() {
  const queryClient = useQueryClient();

  return queryClient;
}

export default useClient;
