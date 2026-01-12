/**
 * Toast Service
 * Merkezi toast bildirim yönetimi için servis.
 */

import { toast } from "sonner"

export interface ToastOptions {
  description?: string
  duration?: number
  action?: { label: string; onClick: () => void }
}

export const toastService = {
  success: (message: string, options?: ToastOptions) => toast.success(message, { description: options?.description, duration: options?.duration ?? 4000, action: options?.action }),
  error: (message: string, options?: ToastOptions) => toast.error(message, { description: options?.description, duration: options?.duration ?? 6000, action: options?.action }),
  warning: (message: string, options?: ToastOptions) => toast.warning(message, { description: options?.description, duration: options?.duration ?? 5000, action: options?.action }),
  info: (message: string, options?: ToastOptions) => toast.info(message, { description: options?.description, duration: options?.duration ?? 4000, action: options?.action }),
  promise: <T,>(promise: Promise<T>, config: { loading: string; success: string | ((data: T) => string); error: string | ((error: unknown) => string) }) => toast.promise(promise, config),
  dismiss: (id?: string | number) => toast.dismiss(id),
  dismissAll: () => toast.dismiss(),
}

export function useToast() { return toastService }
