import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { upsert, remove, type Collection } from "@/lib/store";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "checkbox";
  options?: string[];
  required?: boolean;
};
export type Column = { label: string; render: (row: any) => ReactNode; className?: string };

type Props = {
  col: Collection;
  title: string;
  rows: any[];
  fields: Field[];
  columns: Column[];
  defaults: Record<string, any>;
  addLabel?: string;
  extraActions?: ReactNode;
};

export function CrudTable({ col, title, rows, fields, columns, defaults, addLabel = "Tambah", extraActions }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>(defaults);
  const [confirm, setConfirm] = useState<any>(null);

  const openNew = () => { setForm(defaults); setOpen(true); };
  const openEdit = (r: any) => { setForm(r); setOpen(true); };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, any> = { ...form };
    fields.forEach((f) => { if (f.type === "number") data[f.key] = Number(data[f.key]) || 0; });
    upsert(col, data as any);
    toast.success(form["id"] ? "Data diperbarui" : "Data ditambahkan");
    setOpen(false);
  };

  return (
    <section className="panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          {extraActions}
          <Button onClick={openNew} size="sm"><Plus className="size-4" /> {addLabel}</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              {columns.map((c) => <th key={c.label} className={`px-4 py-3 font-medium ${c.className ?? ""}`}>{c.label}</th>)}
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">Belum ada data.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                {columns.map((c) => <td key={c.label} className={`whitespace-nowrap px-4 py-3 ${c.className ?? ""}`}>{c.render(r)}</td>)}
                <td className="whitespace-nowrap px-4 py-2 text-right">
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(r)}><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => setConfirm(r)}><Trash2 className="size-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form["id"] ? "Edit" : addLabel} — {title}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="grid gap-4">
            {fields.map((f) => (
              <label key={f.key} className={f.type === "checkbox" ? "flex items-center gap-2 text-sm" : "grid gap-1.5 text-sm"}>
                {f.type !== "checkbox" && <span className="font-medium">{f.label}</span>}
                {f.type === "select" ? (
                  <select className="field" value={form[f.key] ?? ""} required={f.required !== false} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                    <option value="" disabled>Pilih…</option>
                    {f.options?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === "checkbox" ? (
                  <>
                    <input type="checkbox" className="size-4 accent-primary" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
                    {f.label}
                  </>
                ) : (
                  <input className="field" type={f.type ?? "text"} step="any" min={f.type === "number" ? 0 : undefined} required={f.required !== false}
                    value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                )}
              </label>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Hapus data ini?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Data yang dihapus tidak dapat dikembalikan.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>Batal</Button>
            <Button variant="destructive" onClick={() => { remove(col, confirm.id); setConfirm(null); toast.success("Data dihapus"); }}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: string; hint?: string | undefined; icon?: ReactNode }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        {icon && <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">{icon}</span>}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function PageHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">{desc}</p>
    </div>
  );
}
