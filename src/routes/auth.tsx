import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Masuk — TaniKita" },
      { name: "description", content: "Masuk atau daftar akun TaniKita untuk mengelola kebun dan keuangan Anda." },
      { property: "og:title", content: "Masuk — TaniKita" },
      { property: "og:description", content: "Masuk atau daftar akun TaniKita." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [f, setF] = useState({ email: "", password: "", nama: "", daerah: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && navigate({ to: "/", replace: true }));
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "daftar") {
        const { error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: { emailRedirectTo: window.location.origin, data: { nama: f.nama, daerah: f.daerah } },
        });
        if (error) throw error;
        toast.success("Pendaftaran berhasil. Cek email Anda untuk konfirmasi akun.");
        setMode("masuk");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        navigate({ to: "/", replace: true });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) {
      toast.error("Gagal masuk dengan Google");
      return;
    }
    if (r.redirected) return;
    navigate({ to: "/", replace: true });
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="panel w-full max-w-sm p-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="size-5" /></span>
          <div>
            <div className="font-display text-lg font-bold leading-none">TaniKita</div>
            <div className="text-xs text-muted-foreground">{mode === "masuk" ? "Masuk ke akun Anda" : "Buat akun petani baru"}</div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "daftar" && (
            <>
              <div><Label>Nama</Label><Input required value={f.nama} onChange={set("nama")} placeholder="Pak Sukardi" /></div>
              <div><Label>Daerah</Label><Input value={f.daerah} onChange={set("daerah")} placeholder="Sumatra Utara" /></div>
            </>
          )}
          <div><Label>Email</Label><Input type="email" required value={f.email} onChange={set("email")} /></div>
          <div><Label>Kata sandi</Label><Input type="password" required minLength={6} value={f.password} onChange={set("password")} /></div>
          <Button className="w-full" disabled={busy}>{mode === "masuk" ? "Masuk" : "Daftar"}</Button>
        </form>
        <div className="my-4 text-center text-xs text-muted-foreground">atau</div>
        <Button variant="outline" className="w-full" onClick={google}>Lanjut dengan Google</Button>
        <button className="mt-4 w-full text-sm text-primary hover:underline" onClick={() => setMode(mode === "masuk" ? "daftar" : "masuk")}>
          {mode === "masuk" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
        </button>
      </div>
    </div>
  );
}
