import { createFileRoute } from "@tanstack/react-router";
import { useDB, tgl, num } from "@/lib/store";
import { CrudTable, PageHeader } from "@/components/CrudTable";

export const Route = createFileRoute("/_authenticated/kebun")({
  head: () => ({
    meta: [
      { title: "Manajemen Kebun — TaniKita" },
      { name: "description", content: "Kelola data lahan, jenis tanaman, tanggal tanam, dan perkiraan panen." },
      { property: "og:title", content: "Manajemen Kebun — TaniKita" },
      { property: "og:description", content: "Kelola data lahan dan tanaman Anda." },
    ],
  }),
  component: Page,
});

function Page() {
  const db = useDB();
  return (
    <>
      <PageHeader title="Manajemen Kebun" desc="Data lahan, tanaman, tanggal tanam, dan perkiraan panen." />
      <CrudTable col="lahan" title="Daftar Lahan" addLabel="Tambah Lahan" rows={db.lahan}
        defaults={{ nama: "", luas: "", tanaman: "", tanggalTanam: "", perkiraanPanen: "", status: "Persiapan Lahan" }}
        fields={[
          { key: "nama", label: "Nama Lahan" },
          { key: "luas", label: "Luas (hektar)", type: "number" },
          { key: "tanaman", label: "Jenis Tanaman" },
          { key: "tanggalTanam", label: "Tanggal Tanam", type: "date" },
          { key: "perkiraanPanen", label: "Perkiraan Panen", type: "date" },
          { key: "status", label: "Status", type: "select", options: ["Persiapan Lahan", "Masa Pertumbuhan", "Berbunga", "Siap Panen", "Selesai Panen"] },
        ]}
        columns={[
          { label: "Lahan", render: (r) => <span className="font-medium">{r.nama}</span> },
          { label: "Luas", render: (r) => `${num(r.luas)} ha` },
          { label: "Tanaman", render: (r) => r.tanaman },
          { label: "Tanam", render: (r) => tgl(r.tanggalTanam) },
          { label: "Perkiraan Panen", render: (r) => tgl(r.perkiraanPanen) },
          { label: "Status", render: (r) => <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{r.status}</span> },
        ]}
      />
    </>
  );
}
