"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

type FormData = {
  title: string;
  content: string;
  isPublic: boolean;
};

export default function CreateNotePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/notes");
      } else {
        const err = await res.json();
        alert("Gagal membuat catatan: " + err.message);
      }
    } catch (e) {
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="p-6 text-center">Silahkan login terlebih dahulu.</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Buat Catatan Baru</h1>
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
          {loading ? "Menyimpan..." : "Simpan Catatan"}
        </button>
      </form>
    </div>
  );
}
