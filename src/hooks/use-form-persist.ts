import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Persist form data to localStorage
 * @param form - The react-hook-form instance
 * @param key - The localStorage key
 * @param enabled - Whether persistence is enabled (default: true)
 */
export function useFormPersist<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string,
  enabled: boolean = true,
) {
  // Load from storage on mount
  useEffect(() => {
    if (!enabled) return;

    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const isConfirmed = window.confirm(
          "Kaydedilmemiş bir taslak bulundu. Geri yüklemek ister misiniz?",
        );

        if (isConfirmed) {
          form.reset(parsed);
        } else {
          localStorage.removeItem(key);
        }
      } catch (e) {
        console.error("Failed to parse stored form data", e);
      }
    }
  }, [key, enabled, form]);

  // Save to storage on change
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form, key, enabled]);

  // Clear storage on submit
  const clearStorage = () => {
    localStorage.removeItem(key);
  };

  return { clearStorage };
}
