"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { Button, Input, Label, toast } from "@/shared/ui";
import { useLanguage } from "@/features/language-switcher";
import { useAuth } from "../model/auth-context";

export function LoginForm() {
  const { signIn, isAdmin, session, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) {
      router.push("/admin");
    }
  }, [session, isAdmin, loading, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success(t("Signed in successfully", "Вход выполнен успешно"));
        router.push("/admin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md chassis-module p-6 sm:p-8">
      <div className="chassis-header -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 px-4 py-2 flex items-center justify-between border-b border-border bg-muted/40">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary inline-block" />
          SEC_AUTH_TERMINAL // AUTH-01
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">[ RESTRICTED ]</span>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("Back to site", "На сайт")}
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 border border-primary/40 bg-primary/10 flex items-center justify-center text-primary">
          <Lock className="h-4 w-4" />
        </div>
        <h1 className="text-xl font-bold font-mono tracking-tight uppercase">
          {t("Admin sign in", "Вход в админку")}
        </h1>
      </div>

      <p className="text-xs font-mono text-muted-foreground mb-6">
        {t("Owner-only authenticated access.", "Доступ только для владельца.")}
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="font-mono text-xs uppercase text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 font-mono text-xs"
            placeholder="admin@example.com"
            disabled={busy}
          />
        </div>
        <div>
          <Label htmlFor="pwd" className="font-mono text-xs uppercase text-muted-foreground">
            {t("Password", "Пароль")}
          </Label>
          <Input
            id="pwd"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 font-mono text-xs"
            disabled={busy}
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="w-full mt-4 tactile-btn font-mono uppercase tracking-wider cursor-pointer"
        >
          {busy ? t("Signing in…", "Вход…") : t("Sign in", "Войти")}
        </Button>
      </form>
    </div>
  );
}
