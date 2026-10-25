import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, Map, Sprout, Wallet, Wheat } from "lucide-react";
import { useDB, useProfil, totals, monthly, rupiah, tgl, num } from "@/lib/store";
import { Stat, PageHeader } from "@/components/CrudTable";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TaniKita" },
      { name: "description", content: "Ringkasan kondisi kebun, jadwal, hasil panen, dan keuntungan usaha tani Anda." },
      { property: "og:title", content: "Dashboard — TaniKita" },
      { property: "og:description", content: "Ringkasan kebun, panen, dan keuntungan petani." },
    ],
  }),
  component: Dashboard,
});

export const shortRp = (v: number) => (Math.abs(v) >= 1e6 ? `${(v / 1e6).toFixed(1)} jt` : `${Math.round(v / 1e3)} rb`);

function Dashboard() {
  const db = useDB();
  const profil = useProfil();
  const t = totals(db);
  const luas = db.lahan.reduce((s, l) => s + l.luas, 0);
  const jenis = [...new Set(db.lahan.map((l) => l.tanaman))];
  const panen = db.panen.reduce((s, p) => s + p.jumlahKg, 0);
  const upcoming = db.jadwal.filter((j) => !j.selesai).sort((a, b) => a.tanggal.localeCompare(b.tanggal)).slice(0, 5);
  const lowStock = db.stok.filter((s) => s.jumlah <= s.minimum);

  return (
    <>
      <PageHeader title={`Selamat datang${profil.nama ? ", " + profil.nama : ""}`} desc="Ringkasan kondisi kebun dan usaha tani Anda hari ini." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Luas Lahan" value={`${num(luas)} ha`} hint={`${db.lahan.length} lahan aktif`} icon={<Map className="size-4" />} />
        <Stat label="Jenis Tanaman" value={`${jenis.length} jenis`} hint={jenis.join(", ")} icon={<Sprout className="size-4" />} />
        <Stat label="Total Hasil Panen" value={`${num(panen)} kg`} hint={`${db.panen.length} kali panen`} icon={<Wheat className="size-4" />} />
        <Stat label="Keuntungan Bersih" value={rupiah(t.bersih)} hint={`Masuk ${rupiah(t.masuk)}`} icon={<Wallet className="size-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Keuangan 6 Bulan Terakhir</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={monthly(db)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="bulan" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={shortRp} width={55} />
                <Tooltip formatter={(v: number) => rupiah(v)} />
                <Legend />
                <Bar dataKey="Pemasukan" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Jadwal Terdekat</h2>
            <Link to="/jadwal" className="text-sm text-primary hover:underline">Lihat semua</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {upcoming.length === 0 && <li className="text-sm text-muted-foreground">Tidak ada jadwal.</li>}
            {upcoming.map((j) => (
              <li key={j.id} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><CalendarDays className="size-4" /></span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{j.judul}</div>
                  <div className="text-xs text-muted-foreground">{tgl(j.tanggal)} · {j.lahan}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Kondisi Kebun</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {db.lahan.map((l) => (
              <div key={l.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{l.nama}</div>
                    <div className="text-xs text-muted-foreground">{l.tanaman} · {num(l.luas)} ha</div>
                  </div>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{l.status}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Perkiraan panen: {tgl(l.perkiraanPanen)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold">Stok Menipis</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {lowStock.length === 0 && <li className="text-muted-foreground">Semua stok aman</li>}
            {lowStock.map((s) => (
              <li key={s.id} className="flex justify-between rounded-lg bg-warning/15 px-3 py-2">
                <span>{s.nama}</span><span className="font-medium">{num(s.jumlah)} {s.satuan}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
