"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Dumbbell, Play, Edit2, Trash2 } from "lucide-react";
import { useAdminApi } from "@/hooks/useApi";
import type { Exercise } from "@workspace/admin-sdk";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const api = useAdminApi();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await api.getExercises();
        if (response.success) {
          setExercises(response.data || []);
        }
      } catch (err: any) {
        console.error("Failed to fetch exercises:", err);
        setError(err.message || "Failed to load exercise library");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscle_group?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Exercise Library</h1>
          <p className="text-slate-400 mt-1">Manage global exercise definitions and media</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-purple-900/20">
          <Plus className="w-5 h-5" />
          New Exercise
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
        <input
          type="text"
          placeholder="Search by name or muscle group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all backdrop-blur-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl h-64 animate-pulse" />
          ))
        ) : filteredExercises.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Dumbbell className="w-16 h-16 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-400">No exercises found in the library</p>
          </div>
        ) : (
          filteredExercises.map((ex) => (
            <div key={ex.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all group flex flex-col">
              {/* Media Preview Placeholder */}
              <div className="h-40 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                {ex.video_url ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Play className="w-12 h-12 text-white fill-current" />
                  </div>
                ) : null}
                <Dumbbell className="w-12 h-12 text-slate-700 group-hover:scale-110 transition-transform" />
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-slate-700">
                    {ex.muscle_group || "General"}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{ex.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 italic">
                  {ex.description || "No description provided for this exercise."}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-xs font-black text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
