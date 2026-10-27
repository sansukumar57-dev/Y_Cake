"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";

const clientSchema = z.object({
  name: z.string().trim().max(60).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Enter your password").max(72),
});

type AuthValues = z.infer<typeof clientSchema>;

export function AuthForm({
  mode,
  next,
  showDemo = false,
}: {
  mode: "login" | "register";
  next: string;
  showDemo?: boolean;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isRegister = mode === "register";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);

    if (isRegister) {
      if (!values.name || values.name.trim().length < 2) {
        setError("name", { message: "Enter your name" });
        return;
      }
      if (values.password.length < 8) {
        setError("password", { message: "Use at least 8 characters" });
        return;
      }
    }

    startTransition(async () => {
      const result = isRegister
        ? await registerAction({ ...values, next })
        : await loginAction({ ...values, next });

      if (result?.error) {
        setServerError(result.error);
      }
    });
  });

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {isRegister ? (
          <div>
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Noor Haddad"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </div>
        ) : null}

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

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {isRegister ? (
              <span className="mb-1.5 text-[11.5px] text-mocha">
                8 characters minimum
              </span>
            ) : null}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder={isRegister ? "Choose a password" : "Your password"}
              className="pr-12"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-mocha transition-colors hover:bg-porcelain hover:text-espresso"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        {serverError ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/15 bg-danger-soft/60 px-4 py-3 text-[13px] leading-relaxed text-danger"
          >
            {serverError}
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {isRegister ? "Creating account" : "Signing in"}
            </>
          ) : (
            <>
              {isRegister ? "Create my account" : "Sign in"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {showDemo ? (
        <div className="mt-6 rounded-xl border border-sand/80 bg-porcelain/60 p-4">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mocha">
            Demo accounts
          </p>
          <div className="mt-2.5 space-y-1 text-[12px] leading-relaxed text-cocoa">
            <p>
              Customer: <span className="font-medium">hello@ycake.test</span> ·{" "}
              <span className="font-medium">cake1234</span>
            </p>
            <p>
              Admin: <span className="font-medium">admin@ycake.test</span> ·{" "}
              <span className="font-medium">admin1234</span>
            </p>
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-center text-[13px] text-cocoa">
        {isRegister ? "Already have an account?" : "New to the atelier?"}{" "}
        <Link
          href={`${isRegister ? "/login" : "/register"}?next=${encodeURIComponent(next)}`}
          className="font-medium text-espresso underline decoration-gold/50 underline-offset-4 transition-colors hover:decoration-espresso"
        >
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
