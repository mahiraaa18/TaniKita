import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useDB, ledger, totals, monthly, rupiah, tgl, resetData } from "@/lib/store";
import { CrudTable, PageHeader, Stat } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { shortRp } from "./index";

export const Route = createFileRoute("/_authenticated/keuangan")({
  head: () => ({
    meta: [
      { title: "Laporan Keuangan — TaniKita" },
      { name: "description", content: "Catat pemasukan dan pengeluaran, lihat keuntungan bersih dan grafik bulanan." },
      { property: "og:title", content: "Laporan Keuangan — TaniKita" },
      { property: "og:description", content: "Pemasukan, pengeluaran, dan keuntungan usaha tani." },
    ],
  }),
  component: Page,
});

const KAT = ["Pupuk", "Benih", "Pestisida", "Tenaga Kerja", "Transportasi", "Sewa Alat", "Penjualan Panen", "Lainnya"];

function Page() {
  const db = useDB();
  const t = totals(db);
  const [jenis, setJenis] = useState("Semua");
  const all = ledger(db).filter((x) => jenis === "Semua" || x.jenis === jenis);
  const manual = all.filter((x) => !x.id.startsWith("sale-"));
  const sales = all.filter((x) => x.id.startsWith("sale-"));

  const exportCsv = () => {
    const rows = [["Tanggal", "Jenis", "Kategori", "Keterangan", "Jumlah (Rp)"], ...ledger(db).map((x) => [x.tanggal, x.jenis, x.kategori, x.keterangan, String(x.jumlah)])];
    rows.push([], ["Total Pemasukan", "", "", "", String(t.masuk)], ["Total Pengeluaran", "", "", "", String(t.keluar)], ["Keuntungan Bersih", "", "", "", String(t.bersih)]);
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv" }));
    a.download = `laporan-keuangan-tanikita.csv`;
    a.click();
    toast.success("Laporan diekspor");
  };

  return (
    <>
      <PageHeader title="Laporan Keuangan" desc="Pemasukan, pengeluaran, dan keuntungan bersih usaha tani." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total Pemasukan" value={rupiah(t.masuk)} />
        <Stat label="Total Pengeluaran" value={rupiah(t.keluar)} />
        <Stat label="Keuntungan Bersih" value={rupiah(t.bersih)} hint={t.masuk ? `Margin ${Math.round((t.bersih / t.masuk) * 100)}%` : undefined} />
      </div>
      <div className="panel mb-6 p-5">
        <h2 className="font-display text-lg font-semibold">Grafik Keuangan Bulanan</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <AreaChart data={monthly(db)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="bulan" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={shortRp} width={55} />
              <Tooltip formatter={(v: number) => rupiah(v)} />
              <Legend />
              <Area dataKey="Pemasukan" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} />
              <Area dataKey="Pengeluaran" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} />
              <Area dataKey="Keuntungan" stroke="var(--chart-4)" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["Semua", "Pemasukan", "Pengeluaran"].map((j) => (
          <button key={j} onClick={() => setJenis(j)}
            className={`rounded-full border px-4 py-1.5 text-sm ${jenis === j ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>{j}</button>
        ))}
      </div>
      <div className="space-y-6">
        <CrudTable col="transaksi" title="Riwayat Transaksi" addLabel="Tambah Transaksi" rows={manual}
          extraActions={<>
            <Button size="sm" variant="outline" onClick={exportCsv}><Download className="size-4" /> Ekspor CSV</Button>
            <Button size="sm" variant="ghost" onClick={() => { if (confirm("Ganti semua data Anda dengan data contoh?")) { resetData(); toast.success("Data contoh dimuat"); } }}><RotateCcw className="size-4" /> Isi data contoh</Button>
          </>}
          defaults={{ tanggal: "", jenis: "Pengeluaran", kategori: "Pupuk", keterangan: "", jumlah: "" }}
          fields={[
            { key: "tanggal", label: "Tanggal", type: "date" },
            { key: "jenis", label: "Jenis", type: "select", options: ["Pemasukan", "Pengeluaran"] },
            { key: "kategori", label: "Kategori", type: "select", options: KAT },
            { key: "keterangan", label: "Keterangan" },
            { key: "jumlah", label: "Jumlah (Rp)", type: "number" },
          ]}
          columns={cols}
        />
        {sales.length > 0 && (
          <section className="panel">
            <div className="border-b border-border p-4">
              <h2 className="font-display text-lg font-semibold">Pemasukan dari Penjualan</h2>
              <p className="text-xs text-muted-foreground">Otomatis dari menu Penjualan — ubah data di sana.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm"><tbody>
                {sales.map((r) => (
                  <tr key={r.id} className="border-t border-border first:border-0">
                    {cols.map((c) => <td key={c.label} className="whitespace-nowrap px-4 py-3">{c.render(r)}</td>)}
                  </tr>
                ))}
              </tbody></table>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

const cols = [
  { label: "Tanggal", render: (r: any) => tgl(r.tanggal) },
  { label: "Jenis", render: (r: any) => <span className={`rounded-full px-2 py-0.5 text-xs ${r.jenis === "Pemasukan" ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"}`}>{r.jenis}</span> },
  { label: "Kategori", render: (r: any) => r.kategori },
  { label: "Keterangan", render: (r: any) => r.keterangan },
  { label: "Jumlah", render: (r: any) => <span className={`font-semibold ${r.jenis === "Pemasukan" ? "text-primary" : "text-destructive"}`}>{r.jenis === "Pemasukan" ? "+" : "−"}{rupiah(r.jumlah)}</span> },
];
