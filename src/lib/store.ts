import { useSyncExternalStore } from "react";

export type Lahan = { id: string; nama: string; luas: number; tanaman: string; tanggalTanam: string; perkiraanPanen: string; status: string };
export type Jadwal = { id: string; judul: string; jenis: string; lahan: string; tanggal: string; selesai: boolean };
export type Stok = { id: string; nama: string; kategori: string; jumlah: number; satuan: string; minimum: number };
export type Panen = { id: string; tanggal: string; lahan: string; tanaman: string; jumlahKg: number };
export type Penjualan = { id: string; tanggal: string; produk: string; pembeli: string; jumlahKg: number; hargaPerKg: number };
export type Transaksi = { id: string; tanggal: string; jenis: "Pemasukan" | "Pengeluaran"; kategori: string; keterangan: string; jumlah: number };

export type DB = { lahan: Lahan[]; jadwal: Jadwal[]; stok: Stok[]; panen: Panen[]; penjualan: Penjualan[]; transaksi: Transaksi[] };
export type Collection = keyof DB;

const KEY = "tanikita-v1";
let n = 0;
const id = () => `${Date.now().toString(36)}${(n++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const seed: DB = {
  lahan: [
    { id: "l1", nama: "Sawah Utara", luas: 1.5, tanaman: "Padi", tanggalTanam: "2026-07-20", perkiraanPanen: "2026-11-05", status: "Masa Pertumbuhan" },
    { id: "l2", nama: "Kebun Cabai Timur", luas: 0.5, tanaman: "Cabai Merah", tanggalTanam: "2026-06-10", perkiraanPanen: "2026-10-20", status: "Siap Panen" },
    { id: "l3", nama: "Ladang Jagung", luas: 1, tanaman: "Jagung", tanggalTanam: "2026-08-15", perkiraanPanen: "2026-11-25", status: "Masa Pertumbuhan" },
    { id: "l4", nama: "Kebun Tomat", luas: 0.3, tanaman: "Tomat", tanggalTanam: "2026-08-01", perkiraanPanen: "2026-10-28", status: "Berbunga" },
  ],
  jadwal: [
    { id: "j1", judul: "Penyiraman pagi", jenis: "Penyiraman", lahan: "Kebun Cabai Timur", tanggal: "2026-10-15", selesai: false },
    { id: "j2", judul: "Pupuk NPK tahap 2", jenis: "Pemupukan", lahan: "Ladang Jagung", tanggal: "2026-10-16", selesai: false },
    { id: "j3", judul: "Penyemprotan hama wereng", jenis: "Perawatan", lahan: "Sawah Utara", tanggal: "2026-10-18", selesai: false },
    { id: "j4", judul: "Panen cabai gelombang 3", jenis: "Panen", lahan: "Kebun Cabai Timur", tanggal: "2026-10-20", selesai: false },
    { id: "j5", judul: "Penyiangan gulma", jenis: "Perawatan", lahan: "Kebun Tomat", tanggal: "2026-10-12", selesai: true },
  ],
  stok: [
    { id: "s1", nama: "Pupuk Urea", kategori: "Pupuk", jumlah: 150, satuan: "kg", minimum: 50 },
    { id: "s2", nama: "Pupuk NPK Phonska", kategori: "Pupuk", jumlah: 40, satuan: "kg", minimum: 50 },
    { id: "s3", nama: "Benih Padi Inpari 32", kategori: "Benih", jumlah: 25, satuan: "kg", minimum: 10 },
    { id: "s4", nama: "Benih Cabai Lado", kategori: "Benih", jumlah: 8, satuan: "bungkus", minimum: 5 },
    { id: "s5", nama: "Insektisida Decis", kategori: "Pestisida", jumlah: 3, satuan: "liter", minimum: 2 },
  ],
  panen: [
    { id: "p1", tanggal: "2026-06-12", lahan: "Sawah Utara", tanaman: "Padi", jumlahKg: 8200 },
    { id: "p2", tanggal: "2026-08-25", lahan: "Kebun Cabai Timur", tanaman: "Cabai Merah", jumlahKg: 650 },
    { id: "p3", tanggal: "2026-09-18", lahan: "Kebun Cabai Timur", tanaman: "Cabai Merah", jumlahKg: 720 },
    { id: "p4", tanggal: "2026-07-30", lahan: "Ladang Jagung", tanaman: "Jagung", jumlahKg: 5400 },
    { id: "p5", tanggal: "2026-10-05", lahan: "Kebun Tomat", tanaman: "Tomat", jumlahKg: 900 },
  ],
  penjualan: [
    { id: "x1", tanggal: "2026-06-15", produk: "Padi", pembeli: "Penggilingan Sri Rejeki", jumlahKg: 8000, hargaPerKg: 6500 },
    { id: "x2", tanggal: "2026-08-02", produk: "Jagung", pembeli: "Peternak Ayam Pak Budi", jumlahKg: 5200, hargaPerKg: 5200 },
    { id: "x3", tanggal: "2026-08-27", produk: "Cabai Merah", pembeli: "Warung Bu Siti", jumlahKg: 600, hargaPerKg: 38000 },
    { id: "x4", tanggal: "2026-09-20", produk: "Cabai Merah", pembeli: "Restoran Padang Sederhana", jumlahKg: 700, hargaPerKg: 42000 },
    { id: "x5", tanggal: "2026-10-07", produk: "Tomat", pembeli: "Pasar Tani Online", jumlahKg: 850, hargaPerKg: 9000 },
  ],
  transaksi: [
    { id: "t1", tanggal: "2026-05-10", jenis: "Pengeluaran", kategori: "Benih", keterangan: "Benih padi & cabai", jumlah: 1850000 },
    { id: "t2", tanggal: "2026-05-22", jenis: "Pengeluaran", kategori: "Tenaga Kerja", keterangan: "Upah tanam 6 orang", jumlah: 2400000 },
    { id: "t3", tanggal: "2026-06-05", jenis: "Pengeluaran", kategori: "Pupuk", keterangan: "Urea 200 kg", jumlah: 1300000 },
    { id: "t4", tanggal: "2026-06-14", jenis: "Pengeluaran", kategori: "Tenaga Kerja", keterangan: "Upah panen padi", jumlah: 3000000 },
    { id: "t5", tanggal: "2026-07-08", jenis: "Pengeluaran", kategori: "Pestisida", keterangan: "Insektisida & fungisida", jumlah: 850000 },
    { id: "t6", tanggal: "2026-08-03", jenis: "Pengeluaran", kategori: "Transportasi", keterangan: "Sewa pikap angkut jagung", jumlah: 600000 },
    { id: "t7", tanggal: "2026-08-20", jenis: "Pengeluaran", kategori: "Pupuk", keterangan: "NPK Phonska 100 kg", jumlah: 1150000 },
    { id: "t8", tanggal: "2026-09-12", jenis: "Pemasukan", kategori: "Lainnya", keterangan: "Sewa traktor ke tetangga", jumlah: 750000 },
    { id: "t9", tanggal: "2026-09-25", jenis: "Pengeluaran", kategori: "Tenaga Kerja", keterangan: "Upah perawatan", jumlah: 1200000 },
    { id: "t10", tanggal: "2026-10-03", jenis: "Pengeluaran", kategori: "Transportasi", keterangan: "Ongkir tomat ke pembeli", jumlah: 350000 },
  ],
};

export const empty: DB = { lahan: [], jadwal: [], stok: [], panen: [], penjualan: [], transaksi: [] };
export type Profil = { nama: string; daerah: string; email: string };

let state: DB = empty;
let profil: Profil = { nama: "", daerah: "", email: "" };
let userId: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

/** Load the signed-in user's own data from Lovable Cloud. */
export async function loadUser(uid: string, email: string) {
  if (userId === uid) return;
  const { supabase } = await import("@/integrations/supabase/client");
  const [d, p] = await Promise.all([
    supabase.from("user_data").select("data").eq("user_id", uid).maybeSingle(),
    supabase.from("profiles").select("nama, daerah").eq("id", uid).maybeSingle(),
  ]);
  userId = uid;
  state = { ...empty, ...((d.data?.data as Partial<DB>) ?? {}) };
  profil = { nama: p.data?.nama ?? "", daerah: p.data?.daerah ?? "", email };
  notify();
}
export function clearUser() {
  userId = null;
  state = empty;
  profil = { nama: "", daerah: "", email: "" };
  notify();
}

function commit(next: DB) {
  state = next;
  notify();
  const uid = userId;
  if (!uid) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("user_data").upsert({ user_id: uid, data: state as never, updated_at: new Date().toISOString() });
  }, 400);
}

const sub = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export function useDB(): DB {
  return useSyncExternalStore(sub, () => state, () => empty);
}
export function useProfil(): Profil {
  return useSyncExternalStore(sub, () => profil, () => profil);
}
export async function saveProfil(nama: string, daerah: string) {
  if (!userId) return;
  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.from("profiles").update({ nama, daerah }).eq("id", userId);
  if (error) throw error;
  profil = { ...profil, nama, daerah };
  notify();
}

export function upsert<C extends Collection>(col: C, item: Partial<DB[C][number]> & { id?: string }) {
  const list = state[col] as Array<{ id: string }>;
  const next = item.id && list.some((x) => x.id === item.id)
    ? list.map((x) => (x.id === item.id ? { ...x, ...item } : x))
    : [{ ...item, id: id() } as { id: string }, ...list];
  commit({ ...state, [col]: next });
}
export function remove(col: Collection, itemId: string) {
  commit({ ...state, [col]: (state[col] as Array<{ id: string }>).filter((x) => x.id !== itemId) });
}
/** Fill the account with example data. */
export function resetData() {
  commit(seed);
}

export const rupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v || 0);
export const tgl = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";
export const num = (v: number) => new Intl.NumberFormat("id-ID").format(v || 0);

/** Unified ledger: manual transactions + sales as income */
export function ledger(db: DB): Transaksi[] {
  const sales: Transaksi[] = db.penjualan.map((p) => ({
    id: "sale-" + p.id,
    tanggal: p.tanggal,
    jenis: "Pemasukan",
    kategori: "Penjualan Panen",
    keterangan: `${p.produk} ${num(p.jumlahKg)} kg ke ${p.pembeli}`,
    jumlah: p.jumlahKg * p.hargaPerKg,
  }));
  return [...db.transaksi, ...sales].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}
export function totals(db: DB) {
  const l = ledger(db);
  const masuk = l.filter((t) => t.jenis === "Pemasukan").reduce((s, t) => s + t.jumlah, 0);
  const keluar = l.filter((t) => t.jenis === "Pengeluaran").reduce((s, t) => s + t.jumlah, 0);
  return { masuk, keluar, bersih: masuk - keluar };
}
export function monthly(db: DB, months = 6) {
  const l = ledger(db);
  const now = new Date();
  const out = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const rows = l.filter((t) => t.tanggal.startsWith(key));
    const masuk = rows.filter((t) => t.jenis === "Pemasukan").reduce((s, t) => s + t.jumlah, 0);
    const keluar = rows.filter((t) => t.jenis === "Pengeluaran").reduce((s, t) => s + t.jumlah, 0);
    out.push({ bulan: d.toLocaleDateString("id-ID", { month: "short" }), Pemasukan: masuk, Pengeluaran: keluar, Keuntungan: masuk - keluar });
  }
  return out;
}
