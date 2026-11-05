"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { createOrderAction } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FieldHint,
  Input,
  Label,
  Textarea,
} from "@/components/ui/form";
import { formatShortDate, PICKUP_SLOTS } from "@/lib/dates";
import { checkoutSchema } from "@/lib/schemas";
import { cn, formatPrice } from "@/lib/utils";

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm({
  designId,
  totalCents,
  defaultName,
  defaultEmail,
  minPickupDate,
  maxPickupDate,
  defaultPickupDate,
}: {
  designId: string;
  totalCents: number;
  defaultName: string;
  defaultEmail: string;
  minPickupDate: string;
  maxPickupDate: string;
  defaultPickupDate: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: defaultName,
      email: defaultEmail,
      phone: "",
      pickupDate: defaultPickupDate,
      pickupSlot: PICKUP_SLOTS[0]?.value ?? "",
      notes: "",
    },
  });

  const selectedSlot = useWatch({ control, name: "pickupSlot" });
  const notes = useWatch({ control, name: "notes" }) ?? "";

  const onSubmit = handleSubmit((values) => {
    setServerError(null);

    if (values.pickupDate < minPickupDate || values.pickupDate > maxPickupDate) {
      setError("pickupDate", {
        message: "Choose a date within the available pickup window.",
      });
      return;
    }

    startTransition(async () => {
      const result = await createOrderAction({ ...values, designId });
      if (result.error) {
        setServerError(result.error);
        return;
      }
      if (result.orderId) {
        router.push(`/account/orders/${result.orderId}?placed=1`);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div className="rounded-2xl border border-sand/80 bg-cream p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[9.5px] font-medium uppercase tracking-[0.16em] text-gold">
              01 · Contact
            </p>
            <h2 className="mt-2 font-display text-2xl leading-none">
              Who is collecting?
            </h2>
          </div>
          <p className="text-right text-[10.5px] leading-relaxed text-mocha">
            For pickup
            <br />
            questions
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="customerName">Full name</Label>
            <Input
              id="customerName"
              autoComplete="name"
              placeholder="Noor Haddad"
              aria-invalid={Boolean(errors.customerName)}
              {...register("customerName")}
            />
            <FieldError>{errors.customerName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(718) 555-0142"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
            <FieldError>{errors.phone?.message}</FieldError>
            <FieldHint>
              Used only if we need to reach you about this pickup.
            </FieldHint>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-sand/80 bg-cream p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[9.5px] font-medium uppercase tracking-[0.16em] text-gold">
              02 · Pickup
            </p>
            <h2 className="mt-2 font-display text-2xl leading-none">
              Choose a time.
            </h2>
          </div>
          <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="pickupDate">Pickup date</Label>
            <div className="relative">
              <Input
                id="pickupDate"
                type="date"
                min={minPickupDate}
                max={maxPickupDate}
                aria-invalid={Boolean(errors.pickupDate)}
                aria-describedby="pickup-date-help"
                {...register("pickupDate")}
              />
              <CalendarDays
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha/60"
                aria-hidden="true"
              />
            </div>
            <FieldError>{errors.pickupDate?.message}</FieldError>
            <FieldHint>
              <span id="pickup-date-help">
                Between {formatShortDate(minPickupDate)} and{" "}
                {formatShortDate(maxPickupDate)}. We bake to order, so three
                days&apos; notice is needed.
              </span>
            </FieldHint>
          </div>

          <fieldset className="sm:col-span-2">
            <legend className="mb-2 block text-[13px] font-medium text-cocoa">
              Pickup window
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {PICKUP_SLOTS.map((slot) => {
                const selected = selectedSlot === slot.value;
                return (
                  <label
                    key={slot.value}
                    className={cn(
                      "flex cursor-pointer flex-col rounded-xl border p-3 transition-[border-color,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream",
                      selected
                        ? "border-espresso bg-porcelain"
                        : "border-sand bg-cream hover:border-mocha/45",
                    )}
                  >
                    <input
                      type="radio"
                      value={slot.value}
                      className="sr-only"
                      {...register("pickupSlot")}
                    />
                    <span className="text-[12.5px] font-medium text-espresso">
                      {slot.label.split(" – ")[0]}
                    </span>
                    <span className="mt-0.5 text-[10.5px] text-mocha">
                      to {slot.label.split(" – ")[1]}
                    </span>
                  </label>
                );
              })}
            </div>
            <FieldError>{errors.pickupSlot?.message}</FieldError>
          </fieldset>

          <div className="sm:col-span-2">
            <Label htmlFor="notes">
              Notes for the bakery{" "}
              <span className="font-normal text-mocha">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Allergies, a surprise, or anything we should know…"
              maxLength={500}
              aria-invalid={Boolean(errors.notes)}
              {...register("notes")}
            />
            <div className="flex items-start justify-between gap-4">
              <FieldError>{errors.notes?.message}</FieldError>
              <p className="ml-auto mt-1.5 text-[10.5px] text-mocha">
                {notes.length}/500
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-sand/80 bg-porcelain/50 p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-espresso">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[12.5px] font-medium text-espresso">
              Pickup at the atelier
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-mocha">
              84 Wythe Avenue, Brooklyn, NY 11249 · Wednesday–Saturday,
              9am–5pm. We will email you to confirm the exact window.
            </p>
          </div>
        </div>
      </div>

      {serverError ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/15 bg-danger-soft/60 px-4 py-3 text-[13px] leading-relaxed text-danger"
        >
          {serverError}
        </div>
      ) : null}

      <div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending your request
            </>
          ) : (
            <>
              Request this cake · {formatPrice(totalCents)}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
        <div className="mt-3 flex items-center justify-center gap-2 text-[10.5px] text-mocha">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
          No payment now. Pay at pickup once confirmed.
        </div>
      </div>
    </form>
  );
}
