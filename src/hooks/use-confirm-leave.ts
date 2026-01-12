'use client'

import { useEffect } from 'react'

/**
 * Form değişiklikleri kaydedilmeden sayfadan ayrılmaya çalışıldığında uyarı verir.
 * (Sadece tarayıcı kapatma, sekme kapatma ve yenileme durumlarını yakalar)
 */
export function useConfirmLeave(
  shouldPrevent: boolean,
  message: string = 'Yaptığınız değişiklikler kaybolabilir. Sayfadan ayrılmak istediğinize emin misiniz?'
) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldPrevent) return

      e.preventDefault()
      e.returnValue = message
      return message
    }

    if (shouldPrevent) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [shouldPrevent, message])
}
