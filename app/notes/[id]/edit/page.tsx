"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type FormData = {
  title: string;
  content: string;
  isPublic: boolean;
};

export default function EditNotePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const noteId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      const res = await fetch(`/api/notes/${noteId}`);
      if (res.ok) {
        const data = await res.json();
        const { title, content, isPublic } = data;
        setInitialData({ title, content, isPublic });
        reset({ title, content, isPublic });
      } else {
        alert("Gagal memuat catatan.");
        router.push("/notes");
      }
    };

    fetchNote();
  }, [noteId, reset, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(`/notes/${noteId}/detail`);
      } else {
        const err = await res.json();
        alert("Gagal update: " + err.message);
      }
    } catch (e) {
      alert("Terjadi kesalahan saat update.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="p-6">Memuat...</div>;
  if (!session)
    return <div className="p-6">Silakan login terlebih dahulu.</div>;
  if (!initialData) return <div className="p-6">Memuat data catatan...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          href="/notes"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Beranda
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Edit Catatan</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Judul</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">Judul wajib diisi</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Isi Catatan</label>
          <textarea
            {...register("content", { required: true })}
            className="w-full p-2 border rounded min-h-[120px]"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">Isi catatan wajib diisi</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register("isPublic")} id="isPublic" />
          <label htmlFor="isPublic">Buat catatan ini publik</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
