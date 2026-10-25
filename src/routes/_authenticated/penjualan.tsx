import { createFileRoute } from "@tanstack/react-router";
import { useDB, tgl, num, rupiah } from "@/lib/store";
import { CrudTable, PageHeader, Stat } from "@/components/CrudTable";

export const Route = createFileRoute("/_authenticated/penjualan")({
  head: () => ({
    meta: [
      { title: "Penjualan — TaniKita" },
      { name: "description", content: "Catat penjualan langsung hasil panen ke pembeli tanpa perantara." },
      { property: "og:title", content: "Penjualan — TaniKita" },
      { property: "og:description", content: "Penjualan langsung hasil panen ke pembeli." },
    ],
  }),
  component: Page,
});

function Page() {
  const db = useDB();
  const total = db.penjualan.reduce((s, p) => s + p.jumlahKg * p.hargaPerKg, 0);
  const kg = db.penjualan.reduce((s, p) => s + p.jumlahKg, 0);
  const pembeli = new Set(db.penjualan.map((p) => p.pembeli)).size;
  return (
    <>
      <PageHeader title="Penjualan" desc="Jual langsung ke pembeli dan hemat biaya perantara. Penjualan otomatis tercatat sebagai pemasukan." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total Pendapatan" value={rupiah(total)} />
        <Stat label="Produk Terjual" value={`${num(kg)} kg`} hint={`Rata-rata ${rupiah(kg ? total / kg : 0)}/kg`} />
        <Stat label="Pembeli Langsung" value={`${pembeli} pembeli`} />
      </div>
      <CrudTable col="penjualan" title="Riwayat Penjualan" addLabel="Catat Penjualan" rows={[...db.penjualan].sort((a, b) => b.tanggal.localeCompare(a.tanggal))}
        defaults={{ tanggal: "", produk: db.lahan[0]?.tanaman ?? "", pembeli: "", jumlahKg: "", hargaPerKg: "" }}
        fields={[
          { key: "tanggal", label: "Tanggal", type: "date" },
          { key: "produk", label: "Produk", type: "select", options: [...new Set([...db.lahan.map((l) => l.tanaman), ...db.panen.map((p) => p.tanaman)])] },
          { key: "pembeli", label: "Nama Pembeli" },
          { key: "jumlahKg", label: "Jumlah (kg)", type: "number" },
          { key: "hargaPerKg", label: "Harga per kg (Rp)", type: "number" },
        ]}
        columns={[
          { label: "Tanggal", render: (r) => tgl(r.tanggal) },
          { label: "Produk", render: (r) => <span className="font-medium">{r.produk}</span> },
          { label: "Pembeli", render: (r) => r.pembeli },
          { label: "Jumlah", render: (r) => `${num(r.jumlahKg)} kg` },
          { label: "Harga/kg", render: (r) => rupiah(r.hargaPerKg) },
          { label: "Total", render: (r) => <span className="font-semibold text-primary">{rupiah(r.jumlahKg * r.hargaPerKg)}</span> },
        ]}
      />
    </>
  );
}
