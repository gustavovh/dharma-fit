"use client";

import { useEffect, useState, use } from "react";
import { 
  ArrowLeft, 
  Activity, 
  Target, 
  Calendar, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Weight,
  Dumbbell
} from "lucide-react";
import Link from "next/link";
import { useAdminApi } from "@/hooks/useApi";
import type { Athlete, Measurement, Routine } from "@workspace/admin-sdk";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function AthleteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [athlete, setAthlete] = useState<(Athlete & { measurements: Measurement[] }) | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useAdminApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [athleteRes, routinesRes] = await Promise.all([
          api.getAthlete(id),
          api.getAthleteRoutines(id)
        ]);

        if (athleteRes.success) {
          setAthlete(athleteRes.data || null);
        }
        if (routinesRes.success) {
          setRoutines(routinesRes.data || []);
        }
      } catch (err: any) {
        console.error("Failed to fetch athlete data:", err);
        setError(err.message || "Failed to load athlete profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 animate-pulse">Loading athlete profile...</p>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="p-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl inline-block">
          <p className="text-red-400 font-bold text-lg">Athlete not found</p>
          <Link href="/athletes" className="text-blue-400 hover:underline mt-4 inline-block">Back to list</Link>
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = athlete.measurements
    .map(m => ({
      date: new Date(m.date).toLocaleDateString("es-ES", { day: '2-digit', month: 'short' }),
      weight: parseFloat(m.weight_kg),
      fat: m.body_fat_pct ? parseFloat(m.body_fat_pct) : null
    }))
    .reverse();

  return (
    <div className="space-y-8 pb-12">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <Link 
          href="/athletes" 
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">{athlete.name}</h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
              athlete.plan_status === 'activa' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {athlete.plan_status}
            </span>
          </div>
          <p className="text-slate-400 font-medium">{athlete.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Chart */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Progress Tracking
                </h3>
                <p className="text-sm text-slate-500">Weight history over time</p>
              </div>
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-700">
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Weight</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{athlete.weight_kg || "--"}</span>
                <span className="text-xs text-slate-500 font-bold">kg</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Body Fat</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{athlete.body_fat_pct || "--"}</span>
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
              <span className="text-sm font-bold text-green-400 capitalize">{athlete.plan_status}</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Joined</p>
              <span className="text-sm font-bold text-white">{new Date(athlete.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Routines */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-500" />
                Routines
              </h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-bold">Manage All</button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {routines.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 italic">No routines assigned yet</p>
                  <button className="mt-4 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-500/30">
                    Create Routine
                  </button>
                </div>
              ) : (
                routines.map((r) => (
                  <div key={r.id} className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl hover:border-blue-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{r.name}</p>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Day {r.day_of_week}</span>
                    </div>
                    <div className="space-y-2">
                      {r.exercises.slice(0, 3).map((ex) => (
                        <div key={ex.id} className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 truncate max-w-[120px]">{ex.name}</span>
                          <span className="text-slate-500 font-mono">{ex.sets}x{ex.reps}</span>
                        </div>
                      ))}
                      {r.exercises.length > 3 && (
                        <p className="text-[10px] text-slate-600 font-bold italic pt-1">
                          + {r.exercises.length - 3} more exercises
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20">
              Update Training Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
