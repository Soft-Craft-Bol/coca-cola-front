import { useAsync } from '@/shared/hooks/useAsync'
import { userService } from '../services/userService'

export const useUsers = () => useAsync(() => userService.list(), [])
