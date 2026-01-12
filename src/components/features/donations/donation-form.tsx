"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDonation, useUpdateDonation } from "@/hooks/use-api";
import {
  DONATION_PURPOSE_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/constants";
import { donationSchema, type DonationFormData } from "@/lib/validators";
import type { Bagis } from "@/types";

interface DonationFormProps {
  onSuccess?: () => void;
  donationToEdit?: Bagis | null;
}

export function DonationForm({ onSuccess, donationToEdit }: DonationFormProps) {
  const isEditMode = !!donationToEdit;

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: donationToEdit
      ? {
          bagisci: {
            ad: donationToEdit.bagisci.ad,
            soyad: donationToEdit.bagisci.soyad,
            telefon: donationToEdit.bagisci.telefon || "",
            email: donationToEdit.bagisci.email || "",
            adres: "",
          },
          tutar: donationToEdit.tutar,
          currency: donationToEdit.currency || "TRY",
          amac: donationToEdit.amac,
          odemeYontemi: donationToEdit.odemeYontemi,
          makbuzNo: donationToEdit.makbuzNo || "",
          aciklama: donationToEdit.aciklama || "",
        }
      : {
          bagisci: {
            ad: "",
            soyad: "",
            telefon: "",
            email: "",
            adres: "",
          },
          tutar: 0,
          currency: "TRY",
          amac: "genel",
          odemeYontemi: "nakit",
          makbuzNo: "",
          aciklama: "",
        },
  });

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateDonation({
      onSuccess: () => {
        onSuccess?.();
      },
    });

  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateDonation({
      onSuccess: () => {
        onSuccess?.();
      },
    });

  const isPending = isCreatePending || isUpdatePending;

  function onSubmit(data: DonationFormData) {
    // Map form payment method to DB enum
    const odemeYontemiMap: Record<
      string,
      "nakit" | "havale" | "kredi_karti" | "kumbara"
    > = {
      nakit: "nakit",
      havale: "havale",
      "kredi-karti": "kredi_karti",
      "mobil-odeme": "havale", // Map mobile payment to havale
      kumbara: "kumbara",
    };

    const donationData = {
      bagisci: {
        id: donationToEdit?.bagisci.id || crypto.randomUUID(),
        ad: data.bagisci.ad,
        soyad: data.bagisci.soyad,
        telefon: data.bagisci.telefon,
        email: data.bagisci.email,
      },
      tutar: data.tutar,
      currency: data.currency,
      amac: data.amac,
      odemeYontemi: odemeYontemiMap[data.odemeYontemi] || "nakit",
      makbuzNo: data.makbuzNo,
      aciklama: data.aciklama,
    };

    if (isEditMode && donationToEdit) {
      updateMutate({ id: donationToEdit.id, data: donationData });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutate(donationData as any);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {/* Bağışçı Bilgileri */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold">
            Bağışçı Bilgileri
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="bagisci.ad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ahmet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bagisci.soyad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soyad *</FormLabel>
                  <FormControl>
                    <Input placeholder="Yılmaz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="bagisci.telefon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="0555 123 45 67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bagisci.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ahmet@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Bağış Detayları */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold">
            Bağış Detayları
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="tutar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutar *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        // Round to 2 decimal places
                        const rounded = Math.round(value * 100) / 100;
                        field.onChange(rounded);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Para Birimi *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TRY">₺ TRY</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="odemeYontemi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ödeme Yöntemi *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(PAYMENT_METHOD_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="amac"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bağış Amacı *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DONATION_PURPOSE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="makbuzNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Makbuz Numarası</FormLabel>
                  <FormControl>
                    <Input placeholder="MKB-2024-001" {...field} />
                  </FormControl>
                  <FormDescription>
                    Boş bırakılırsa otomatik üretilir
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="aciklama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Açıklama</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ek notlar..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            İptal
          </Button>
          <div role="status" aria-live="polite" aria-atomic="true">
            <Button type="submit" loading={isPending}>
              {isPending
                ? "Kaydediliyor..."
                : isEditMode
                  ? "Güncelle"
                  : "Kaydet"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
