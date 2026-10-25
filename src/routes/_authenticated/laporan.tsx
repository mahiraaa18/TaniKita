import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Printer } from "lucide-react";
import { useDB, ledger, totals, rupiah, num } from "@/lib/store";
import { PageHeader, Stat } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/laporan")({
  head: () => ({
    meta: [
      { title: "Laporan Pertanian — TaniKita" },
      { name: "description", content: "Ringkasan hasil panen, produktivitas lahan, biaya produksi, dan keuntungan usaha tani." },
      { property: "og:title", content: "Laporan Pertanian — TaniKita" },
      { property: "og:description", content: "Hasil panen, produktivitas, dan keuntungan." },
    ],
  }),
  component: Page,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Page() {
  const db = useDB();
  const t = totals(db);
  const tanaman = [...new Set([...db.lahan.map((l) => l.tanaman), ...db.panen.map((p) => p.tanaman)])];
  const rows = tanaman.map((nama) => {
    const kg = db.panen.filter((p) => p.tanaman === nama).reduce((s, p) => s + p.jumlahKg, 0);
    const luas = db.lahan.filter((l) => l.tanaman === nama).reduce((s, l) => s + l.luas, 0);
    const pendapatan = db.penjualan.filter((p) => p.produk === nama).reduce((s, p) => s + p.jumlahKg * p.hargaPerKg, 0);
    return { nama, kg, luas, produktivitas: luas ? kg / luas : 0, pendapatan };
  });
  const biaya = ledger(db).filter((x) => x.jenis === "Pengeluaran");
  const perKat = Object.entries(biaya.reduce<Record<string, number>>((a, x) => ((a[x.kategori] = (a[x.kategori] || 0) + x.jumlah), a), {})).map(([name, value]) => ({ name, value }));
  const totalKg = rows.reduce((s, r) => s + r.kg, 0);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Laporan Pertanian" desc="Hasil panen, produktivitas, biaya produksi, dan keuntungan usaha tani." />
        <Button variant="outline" onClick={() => window.print()}><Printer className="size-4" /> Cetak</Button>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Panen" value={`${num(totalKg)} kg`} />
        <Stat label="Biaya Produksi" value={rupiah(t.keluar)} hint={totalKg ? `${rupiah(t.keluar / totalKg)} per kg` : undefined} />
        <Stat label="Pendapatan" value={rupiah(t.masuk)} />
        <Stat label="Keuntungan Usaha" value={rupiah(t.bersih)} hint={t.keluar ? `ROI ${Math.round((t.bersih / t.keluar) * 100)}%` : undefined} />
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold">Hasil Panen per Tanaman (kg)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="nama" fontSize={12} />
                <YAxis fontSize={12} width={50} />
                <Tooltip formatter={(v: number) => `${num(v)} kg`} />
                <Bar dataKey="kg" name="Panen" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold">Komposisi Biaya Produksi</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={perKat} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {perKat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => rupiah(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <section className="panel overflow-x-auto">
        <h2 className="border-b border-border p-4 font-display text-lg font-semibold">Produktivitas per Komoditas</h2>
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            {["Tanaman", "Luas", "Total Panen", "Produktivitas", "Pendapatan"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.nama} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{r.nama}</td>
                <td className="px-4 py-3">{num(r.luas)} ha</td>
                <td className="px-4 py-3">{num(r.kg)} kg</td>
                <td className="px-4 py-3">{r.luas ? `${num(Math.round(r.produktivitas))} kg/ha` : "-"}</td>
                <td className="px-4 py-3 font-semibold text-primary">{rupiah(r.pendapatan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
