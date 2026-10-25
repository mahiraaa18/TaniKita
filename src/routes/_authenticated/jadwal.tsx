import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDB, tgl, upsert } from "@/lib/store";
import { CrudTable, PageHeader } from "@/components/CrudTable";

export const Route = createFileRoute("/_authenticated/jadwal")({
  head: () => ({
    meta: [
      { title: "Jadwal Kegiatan — TaniKita" },
      { name: "description", content: "Atur jadwal penyiraman, pemupukan, perawatan tanaman, dan panen." },
      { property: "og:title", content: "Jadwal Kegiatan — TaniKita" },
      { property: "og:description", content: "Jadwal kegiatan kebun yang teratur." },
    ],
  }),
  component: Page,
});

const JENIS = ["Penyiraman", "Pemupukan", "Perawatan", "Panen"];

function Page() {
  const db = useDB();
  const [filter, setFilter] = useState("Semua");
  const rows = [...db.jadwal]
    .filter((j) => filter === "Semua" || j.jenis === filter)
    .sort((a, b) => Number(a.selesai) - Number(b.selesai) || a.tanggal.localeCompare(b.tanggal));
  return (
    <>
      <PageHeader title="Jadwal Kegiatan" desc="Penyiraman, pemupukan, perawatan, dan panen." />
      <div className="mb-4 flex flex-wrap gap-2">
        {["Semua", ...JENIS].map((j) => (
          <button key={j} onClick={() => setFilter(j)}
            className={`rounded-full border px-4 py-1.5 text-sm ${filter === j ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>
            {j} {j !== "Semua" && `(${db.jadwal.filter((x) => x.jenis === j && !x.selesai).length})`}
          </button>
        ))}
      </div>
      <CrudTable col="jadwal" title="Daftar Jadwal" addLabel="Tambah Jadwal" rows={rows}
        defaults={{ judul: "", jenis: "Penyiraman", lahan: db.lahan[0]?.nama ?? "", tanggal: "", selesai: false }}
        fields={[
          { key: "judul", label: "Nama Kegiatan" },
          { key: "jenis", label: "Jenis", type: "select", options: JENIS },
          { key: "lahan", label: "Lahan", type: "select", options: db.lahan.map((l) => l.nama) },
          { key: "tanggal", label: "Tanggal", type: "date" },
          { key: "selesai", label: "Sudah selesai", type: "checkbox" },
        ]}
        columns={[
          { label: "Selesai", render: (r) => <input type="checkbox" aria-label="Tandai selesai" className="size-4 accent-primary" checked={r.selesai} onChange={(e) => upsert("jadwal", { id: r.id, selesai: e.target.checked })} /> },
          { label: "Kegiatan", render: (r) => <span className={r.selesai ? "text-muted-foreground line-through" : "font-medium"}>{r.judul}</span> },
          { label: "Jenis", render: (r) => <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{r.jenis}</span> },
          { label: "Lahan", render: (r) => r.lahan },
          { label: "Tanggal", render: (r) => tgl(r.tanggal) },
        ]}
      />
    </>
  );
}
