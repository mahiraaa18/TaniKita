import { createFileRoute } from "@tanstack/react-router";
import { useDB, tgl, num } from "@/lib/store";
import { CrudTable, PageHeader, Stat } from "@/components/CrudTable";

export const Route = createFileRoute("/_authenticated/stok")({
  head: () => ({
    meta: [
      { title: "Stok & Panen — TaniKita" },
      { name: "description", content: "Catat persediaan pupuk, benih, pestisida, dan jumlah hasil panen." },
      { property: "og:title", content: "Stok & Panen — TaniKita" },
      { property: "og:description", content: "Persediaan sarana tani dan hasil panen." },
    ],
  }),
  component: Page,
});

function Page() {
  const db = useDB();
  const sum = (k: string) => db.stok.filter((s) => s.kategori === k).length;
  return (
    <>
      <PageHeader title="Stok & Panen" desc="Persediaan pupuk, benih, pestisida serta catatan hasil panen." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Item Pupuk" value={`${sum("Pupuk")}`} />
        <Stat label="Item Benih" value={`${sum("Benih")}`} />
        <Stat label="Item Pestisida" value={`${sum("Pestisida")}`} />
        <Stat label="Total Panen" value={`${num(db.panen.reduce((s, p) => s + p.jumlahKg, 0))} kg`} />
      </div>
      <div className="space-y-6">
        <CrudTable col="stok" title="Persediaan" addLabel="Tambah Stok" rows={db.stok}
          defaults={{ nama: "", kategori: "Pupuk", jumlah: "", satuan: "kg", minimum: "" }}
          fields={[
            { key: "nama", label: "Nama Barang" },
            { key: "kategori", label: "Kategori", type: "select", options: ["Pupuk", "Benih", "Pestisida", "Lainnya"] },
            { key: "jumlah", label: "Jumlah", type: "number" },
            { key: "satuan", label: "Satuan", type: "select", options: ["kg", "liter", "bungkus", "karung", "botol"] },
            { key: "minimum", label: "Batas Minimum", type: "number" },
          ]}
          columns={[
            { label: "Barang", render: (r) => <span className="font-medium">{r.nama}</span> },
            { label: "Kategori", render: (r) => r.kategori },
            { label: "Jumlah", render: (r) => `${num(r.jumlah)} ${r.satuan}` },
            { label: "Status", render: (r) => r.jumlah <= r.minimum
              ? <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs">Menipis</span>
              : <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Aman</span> },
          ]}
        />
        <CrudTable col="panen" title="Hasil Panen" addLabel="Catat Panen" rows={[...db.panen].sort((a, b) => b.tanggal.localeCompare(a.tanggal))}
          defaults={{ tanggal: "", lahan: db.lahan[0]?.nama ?? "", tanaman: db.lahan[0]?.tanaman ?? "", jumlahKg: "" }}
          fields={[
            { key: "tanggal", label: "Tanggal Panen", type: "date" },
            { key: "lahan", label: "Lahan", type: "select", options: db.lahan.map((l) => l.nama) },
            { key: "tanaman", label: "Tanaman", type: "select", options: [...new Set(db.lahan.map((l) => l.tanaman))] },
            { key: "jumlahKg", label: "Jumlah (kg)", type: "number" },
          ]}
          columns={[
            { label: "Tanggal", render: (r) => tgl(r.tanggal) },
            { label: "Lahan", render: (r) => r.lahan },
            { label: "Tanaman", render: (r) => r.tanaman },
            { label: "Jumlah", render: (r) => <span className="font-medium">{num(r.jumlahKg)} kg</span> },
          ]}
        />
      </div>
    </>
  );
}
