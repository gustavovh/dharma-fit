import { z } from "zod";
import type {
  AdminUser,
  Release,
  Build,
  Setting,
  FeatureFlag,
  RemoteConfig,
  AuditLog,
  ErrorLog,
  Notification,
  DashboardStats,
  CreateAdminUser,
  CreateRelease,
  CreateBuild,
  UpdateSetting,
  UpdateFeatureFlag,
  CreateNotification,
  Athlete,
  Measurement,
  Exercise,
  Routine,
  CreateAthlete,
  CreateMeasurement,
} from "./types/index";

export interface ApiClientOptions {
  baseURL: string;
  token?: string;
  onTokenRefresh?: (newToken: string) => Promise<void>;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/**
 * Cliente API tipado para administración
 * Proporciona métodos type-safe para todas las operaciones administrativas
 */
export class AdminApiClient {
  private baseURL: string;
  private token: string | null = null;
  private onTokenRefresh?: (newToken: string) => Promise<void>;

  constructor(options: ApiClientOptions) {
    this.baseURL = options.baseURL;
    this.token = options.token || null;
    this.onTokenRefresh = options.onTokenRefresh;
  }

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options?.method || "GET";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...this.getHeaders(),
          ...(options?.headers || {}),
        },
        body:
          options?.body && method !== "GET"
            ? JSON.stringify(options.body)
            : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado - implementar refresh
          throw new Error("Unauthorized");
        }
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  // ========================================================================
  // AUTH ENDPOINTS
  // ========================================================================

  async login(email: string, password: string) {
    return this.request<{ access_token: string; refresh_token: string }>(
      "/api/admin/auth/login",
      {
        method: "POST",
        body: { email, password },
      }
    );
  }

  async logout() {
    return this.request("/api/admin/auth/logout", {
      method: "POST",
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ access_token: string }>(
      "/api/admin/auth/refresh",
      {
        method: "POST",
        body: { refresh_token: refreshToken },
      }
    );
  }

  async getCurrentUser() {
    return this.request<AdminUser>("/api/admin/auth/me");
  }

  // ========================================================================
  // DASHBOARD
  // ========================================================================

  async getDashboardStats() {
    return this.request<DashboardStats>("/api/admin/dashboard/stats");
  }

  // ========================================================================
  // RELEASES
  // ========================================================================

  async getReleases(params?: PaginationParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.sort) query.append("sort", params.sort);
    if (params?.order) query.append("order", params.order);

    return this.request<{ data: Release[]; pagination: any }>(
      `/api/admin/releases?${query.toString()}`
    );
  }

  async getRelease(id: string) {
    return this.request<Release>(`/api/admin/releases/${id}`);
  }

  async createRelease(data: CreateRelease) {
    return this.request<Release>("/api/admin/releases", {
      method: "POST",
      body: data,
    });
  }

  async updateRelease(id: string, data: Partial<Release>) {
    return this.request<Release>(`/api/admin/releases/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async publishRelease(id: string) {
    return this.request<Release>(`/api/admin/releases/${id}/publish`, {
      method: "POST",
    });
  }

  async rollbackRelease(id: string) {
    return this.request<Release>(`/api/admin/releases/${id}/rollback`, {
      method: "POST",
    });
  }

  async deleteRelease(id: string) {
    return this.request(`/api/admin/releases/${id}`, {
      method: "DELETE",
    });
  }

  // ========================================================================
  // BUILDS
  // ========================================================================

  async getBuilds(params?: PaginationParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    return this.request<{ data: Build[]; pagination: any }>(
      `/api/admin/builds?${query.toString()}`
    );
  }

  async getBuild(id: string) {
    return this.request<Build>(`/api/admin/builds/${id}`);
  }

  async createBuild(data: CreateBuild) {
    return this.request<Build>("/api/admin/builds", {
      method: "POST",
      body: data,
    });
  }

  async cancelBuild(id: string) {
    return this.request<Build>(`/api/admin/builds/${id}/cancel`, {
      method: "POST",
    });
  }

  async deleteBuild(id: string) {
    return this.request(`/api/admin/builds/${id}`, {
      method: "DELETE",
    });
  }

  // ========================================================================
  // SETTINGS
  // ========================================================================

  async getSettings() {
    return this.request<Record<string, Setting>>("/api/admin/settings");
  }

  async getSetting(key: string) {
    return this.request<Setting>(`/api/admin/settings/${key}`);
  }

  async updateSetting(key: string, data: UpdateSetting) {
    return this.request<Setting>(`/api/admin/settings/${key}`, {
      method: "PUT",
      body: data,
    });
  }

  // ========================================================================
  // FEATURE FLAGS
  // ========================================================================

  async getFeatureFlags() {
    return this.request<FeatureFlag[]>("/api/admin/feature-flags");
  }

  async getFeatureFlag(key: string) {
    return this.request<FeatureFlag>(`/api/admin/feature-flags/${key}`);
  }

  async updateFeatureFlag(key: string, data: UpdateFeatureFlag) {
    return this.request<FeatureFlag>(`/api/admin/feature-flags/${key}`, {
      method: "PUT",
      body: data,
    });
  }

  // ========================================================================
  // REMOTE CONFIG
  // ========================================================================

  async getRemoteConfigs() {
    return this.request<RemoteConfig[]>("/api/admin/remote-config");
  }

  async updateRemoteConfig(key: string, value: unknown) {
    return this.request<RemoteConfig>(`/api/admin/remote-config/${key}`, {
      method: "PUT",
      body: { value },
    });
  }

  // ========================================================================
  // USERS
  // ========================================================================

  async getUsers(params?: PaginationParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    return this.request<{ data: AdminUser[]; pagination: any }>(
      `/api/admin/users?${query.toString()}`
    );
  }

  // ========================================================================
  // GYM MANAGEMENT
  // ========================================================================

  async getAthletes() {
    return this.request<{ data: Athlete[] }>("/api/admin/gym/athletes");
  }

  async getAthlete(id: string) {
    return this.request<{ data: Athlete & { measurements: Measurement[] } }>(
      `/api/admin/gym/athletes/${id}`
    );
  }

  async createAthlete(data: CreateAthlete) {
    return this.request<{ data: Athlete }>("/api/admin/gym/athletes", {
      method: "POST",
      body: data,
    });
  }

  async getAthleteRoutines(id: string) {
    return this.request<{ data: Routine[] }>(`/api/admin/gym/athletes/${id}/routines`);
  }

  async addMeasurement(athleteId: string, data: CreateMeasurement) {
    return this.request<{ data: Measurement }>(
      `/api/admin/gym/athletes/${athleteId}/measurements`,
      {
        method: "POST",
        body: data,
      }
    );
  }

  async getExercises() {
    return this.request<{ data: Exercise[] }>("/api/admin/gym/exercises");
  }

  async getUser(id: string) {
    return this.request<AdminUser>(`/api/admin/users/${id}`);
  }

  async createUser(data: CreateAdminUser) {
    return this.request<AdminUser>("/api/admin/users", {
      method: "POST",
      body: data,
    });
  }

  async updateUser(id: string, data: Partial<AdminUser>) {
    return this.request<AdminUser>(`/api/admin/users/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
  }

  // ========================================================================
  // MONITORING
  // ========================================================================

  async getAuditLogs(params?: PaginationParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    return this.request<{ data: AuditLog[]; pagination: any }>(
      `/api/admin/monitoring/audit-logs?${query.toString()}`
    );
  }

  async getErrorLogs(params?: PaginationParams & { source?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.source) query.append("source", params.source);

    return this.request<{ data: ErrorLog[]; pagination: any }>(
      `/api/admin/monitoring/error-logs?${query.toString()}`
    );
  }

  // ========================================================================
  // NOTIFICATIONS
  // ========================================================================

  async getNotifications(params?: PaginationParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    return this.request<{ data: Notification[]; pagination: any }>(
      `/api/admin/notifications?${query.toString()}`
    );
  }

  async createNotification(data: CreateNotification) {
    return this.request<Notification>("/api/admin/notifications", {
      method: "POST",
      body: data,
    });
  }

  async sendNotification(id: string) {
    return this.request<Notification>(`/api/admin/notifications/${id}/send`, {
      method: "POST",
    });
  }
}

export default AdminApiClient;
