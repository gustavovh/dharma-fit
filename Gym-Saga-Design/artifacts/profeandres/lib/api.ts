import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:3001"; // En Android real usaría la IP de la máquina

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await AsyncStorage.getItem("atleta_token");
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API Error");
  }

  return data;
}

export const gymApi = {
  login: (email: string, password: string) => 
    apiFetch<any>("/api/atleta/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
    
  getRoutines: (athleteId: string) => 
    apiFetch<any>(`/api/atleta/routines/${athleteId}`),
    
  getProfile: (athleteId: string) => 
    apiFetch<any>(`/api/atleta/profile/${athleteId}`),
    
  markComplete: (routineExerciseId: string, completed: boolean) =>
    apiFetch<any>("/api/atleta/routines/complete", {
      method: "POST",
      body: JSON.stringify({ routineExerciseId, completed }),
    }),
};
