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
  Dumbbell,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useAdminApi } from "@/hooks/useApi";
import type { Athlete, Measurement, Routine, Exercise } from "@workspace/admin-sdk";
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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [savingRoutine, setSavingRoutine] = useState(false);
  const [routineError, setRoutineError] = useState<string | null>(null);
  const [observations, setObservations] = useState<Array<{ id: string; type: string; content: string; date: string }>>([]);
  const [observationText, setObservationText] = useState("");
  const [observationType, setObservationType] = useState<"Nota" | "Alerta" | "Progreso">("Progreso");
  const [savingObservation, setSavingObservation] = useState(false);
  const [observationError, setObservationError] = useState<string | null>(null);
  const [routineForm, setRoutineForm] = useState({
    name: "",
    day_of_week: 1,
    exercises: [{ exercise_id: "", sets: 3, reps: "12" }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useAdminApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [athleteRes, routinesRes, exercisesRes, observationsRes] = await Promise.all([
          api.getAthlete(id),
          api.getAthleteRoutines(id),
          api.getExercises(),
          api.getAthleteObservations(id),
        ]);

        setAthlete((athleteRes as any).data || null);
        setRoutines((routinesRes as any).data || []);
        setExercises((exercisesRes as any).data || []);
        setObservations((observationsRes as any).data || []);
      } catch (err: any) {
        console.error("Failed to fetch athlete data:", err);
        setError(err.message || "Failed to load athlete profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, id]);

  const updateRoutineExercise = (index: number, field: string, value: string) => {
    setRoutineForm((prev) => {
      const nextItems = [...prev.exercises];
      const current = { ...nextItems[index] } as any;
      current[field] = field === "sets" ? Number(value) : value;
      nextItems[index] = current;
      return { ...prev, exercises: nextItems };
    });
  };

  const addRoutineExercise = () => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { exercise_id: "", sets: 3, reps: "12" }],
    }));
  };

  const removeRoutineExercise = (index: number) => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleAssignRoutine = async () => {
    try {
      setRoutineError(null);
      setSavingRoutine(true);

      if (!routineForm.name.trim()) {
        setRoutineError("Routine name is required");
        return;
      }

      if (routineForm.exercises.some((x) => !x.exercise_id)) {
        setRoutineError("Select an exercise for each row");
        return;
      }

      await api.createAthleteRoutine(id, {
        name: routineForm.name,
        day_of_week: Number(routineForm.day_of_week),
        exercises: routineForm.exercises.map((ex, idx) => ({
          exercise_id: ex.exercise_id,
          sets: Number(ex.sets),
          reps: ex.reps,
          order: idx,
        })),
      } as any);

      const routinesRes = await api.getAthleteRoutines(id);
      setRoutines((routinesRes as any).data || []);
      setRoutineForm({
        name: "",
        day_of_week: 1,
        exercises: [{ exercise_id: "", sets: 3, reps: "12" }],
      });
    } catch (err: any) {
      setRoutineError(err?.message || "Failed to assign routine");
    } finally {
      setSavingRoutine(false);
    }
  };

  const handleCreateObservation = async () => {
    try {
      if (!observationText.trim()) {
        setObservationError("Escribe una observacion para enviar feedback.");
        return;
      }

      setSavingObservation(true);
      setObservationError(null);

      await api.createAthleteObservation(id, {
        type: observationType,
        content: observationText.trim(),
      });

      const observationsRes = await api.getAthleteObservations(id);
      setObservations((observationsRes as any).data || []);
      setObservationText("");
      setObservationType("Progreso");
    } catch (err: any) {
      setObservationError(err?.message || "No se pudo enviar la observacion.");
    } finally {
      setSavingObservation(false);
    }
  };

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

            <div className="mt-6 border-t border-slate-700/60 pt-6 space-y-4">
              <h4 className="text-sm font-black tracking-widest uppercase text-slate-400">Assign New Routine</h4>

              {routineError && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-semibold">
                  {routineError}
                </div>
              )}

              <input
                value={routineForm.name}
                onChange={(e) => setRoutineForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Routine name"
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />

              <select
                value={routineForm.day_of_week}
                onChange={(e) => setRoutineForm((prev) => ({ ...prev, day_of_week: Number(e.target.value) }))}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={7}>Sunday</option>
              </select>

              <div className="space-y-2">
                {routineForm.exercises.map((row, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <select
                      value={row.exercise_id}
                      onChange={(e) => updateRoutineExercise(index, "exercise_id", e.target.value)}
                      className="col-span-6 bg-slate-800/70 border border-slate-700 rounded-xl py-2 px-2 text-xs text-white"
                    >
                      <option value="">Select exercise</option>
                      {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                    <input
                      value={row.sets}
                      type="number"
                      min={1}
                      onChange={(e) => updateRoutineExercise(index, "sets", e.target.value)}
                      className="col-span-2 bg-slate-800/70 border border-slate-700 rounded-xl py-2 px-2 text-xs text-white"
                      placeholder="Sets"
                    />
                    <input
                      value={row.reps}
                      onChange={(e) => updateRoutineExercise(index, "reps", e.target.value)}
                      className="col-span-3 bg-slate-800/70 border border-slate-700 rounded-xl py-2 px-2 text-xs text-white"
                      placeholder="Reps"
                    />
                    <button
                      type="button"
                      onClick={() => removeRoutineExercise(index)}
                      className="col-span-1 text-xs text-red-400 hover:text-red-300"
                      disabled={routineForm.exercises.length === 1}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addRoutineExercise}
                className="w-full py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 hover:bg-slate-700"
              >
                Add Exercise Row
              </button>

              <button
                type="button"
                onClick={handleAssignRoutine}
                disabled={savingRoutine}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/40 text-white text-sm font-bold"
              >
                {savingRoutine ? "Saving..." : "Assign Routine"}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-700/60 pt-6 space-y-4">
              <h4 className="text-sm font-black tracking-widest uppercase text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Coach Feedback
              </h4>

              {observationError && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-semibold">
                  {observationError}
                </div>
              )}

              <select
                value={observationType}
                onChange={(e) => setObservationType(e.target.value as "Nota" | "Alerta" | "Progreso")}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white"
              >
                <option value="Progreso">Progreso</option>
                <option value="Nota">Nota</option>
                <option value="Alerta">Alerta</option>
              </select>

              <textarea
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Ej: Muy buen ritmo hoy. Mantener tecnica y subir 2.5kg la proxima sesion."
                className="w-full h-24 bg-slate-800/70 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white"
              />

              <button
                type="button"
                onClick={handleCreateObservation}
                disabled={savingObservation}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900/40 text-white text-sm font-bold"
              >
                {savingObservation ? "Enviando..." : "Enviar Observacion"}
              </button>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {observations.map((observation) => (
                  <div key={observation.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-blue-300">{observation.type}</span>
                      <span className="text-[11px] text-slate-500">{new Date(observation.date).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">{observation.content}</p>
                  </div>
                ))}
                {!observations.length && (
                  <p className="text-xs text-slate-500">Sin feedbacks enviados para este atleta.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
