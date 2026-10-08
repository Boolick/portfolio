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
    <div className="w-full max-w-md bento-card bento-card-glow p-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {t("Back to site", "На сайт")}
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("Admin sign in", "Вход в админку")}
        </h1>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
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
            className="mt-1.5"
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
            className="mt-1.5"
            disabled={busy}
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 mt-2 cursor-pointer shadow-md"
        >
          {busy ? t("Signing in…", "Вход…") : t("Sign in", "Войти")}
        </Button>
      </form>
    </div>
  );
}
