import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Sprout, CalendarDays, Package, ShoppingBasket, Wallet, FileBarChart, Menu, X, Leaf, LogOut, UserPen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfil, saveProfil, clearUser } from "@/lib/store";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/kebun", label: "Manajemen Kebun", icon: Sprout },
  { to: "/jadwal", label: "Jadwal Kegiatan", icon: CalendarDays },
  { to: "/stok", label: "Stok & Panen", icon: Package },
  { to: "/penjualan", label: "Penjualan", icon: ShoppingBasket },
  { to: "/keuangan", label: "Laporan Keuangan", icon: Wallet },
  { to: "/laporan", label: "Laporan Pertanian", icon: FileBarChart },
] as const;

function ProfilCard() {
  const p = useProfil();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ nama: "", daerah: "" });
  async function keluar() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    clearUser();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="m-3 rounded-xl bg-sidebar-accent p-4 text-xs">
      <div className="truncate font-semibold">{p.nama || p.email}</div>
      <div className="opacity-70">Petani{p.daerah ? ` · ${p.daerah}` : ""}</div>
      <div className="mt-3 flex gap-2">
        <button className="flex items-center gap-1 opacity-80 hover:opacity-100" onClick={() => { setF({ nama: p.nama, daerah: p.daerah }); setEdit(true); }}><UserPen className="size-3.5" /> Profil</button>
        <button className="ml-auto flex items-center gap-1 opacity-80 hover:opacity-100" onClick={keluar}><LogOut className="size-3.5" /> Keluar</button>
      </div>
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ubah Profil</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nama</Label><Input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></div>
            <div><Label>Daerah</Label><Input value={f.daerah} onChange={(e) => setF({ ...f, daerah: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button onClick={async () => { try { await saveProfil(f.nama, f.daerah); toast.success("Profil disimpan"); setEdit(false); } catch { toast.error("Gagal menyimpan"); } }}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const side = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="grid size-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><Leaf className="size-5" /></span>
        <div>
          <div className="font-display text-lg font-bold leading-none">TaniKita</div>
          <div className="text-xs opacity-70">Kelola kebun & keuangan</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: true }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium opacity-80 transition hover:bg-sidebar-accent hover:opacity-100 data-[status=active]:bg-sidebar-primary data-[status=active]:text-sidebar-primary-foreground data-[status=active]:opacity-100">
            <n.icon className="size-4" /> {n.label}
          </Link>
        ))}
      </nav>
      <ProfilCard />
    </div>
  );
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-sidebar text-sidebar-foreground lg:block">{side}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground">
            <button className="absolute right-3 top-6 p-1" aria-label="Tutup menu" onClick={() => setOpen(false)}><X className="size-5" /></button>
            {side}
          </aside>
        </div>
      )}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
        <button aria-label="Buka menu" onClick={() => setOpen(true)}><Menu className="size-6" /></button>
        <span className="font-display font-bold">TaniKita</span>
      </header>
      <main className="px-4 py-6 md:px-8 lg:ml-64 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
