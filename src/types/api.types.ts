export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

/**
 * Module related types
 */
export interface Module {
  id: number;
  name: string;
  shortdescription: string;
  studyCredits: number;
  level: string;
  location: { id: number; name: string }[];
  startDate: string;
}

export interface ModulesResponse {
  modules: Module[];
}

export interface moduleDetail {
  id: number;
  name: string;
  description: string;
  content: string;
  level: string;
  studyCredits: number;
  location: { id: number; name: string }[];
  moduleTags: { id: number; name: string }[];
  learningOutcomes: string;
  availableSpots: number;
  startDate: string;
}

export interface ModuleResponse {
  module: moduleDetail;
}

export interface createModule {
  name: string;
  description: string;
  content: string;
  level: string;
  studyCredits: number;
  location: { id: number; name: string }[];
  moduleTags: { id: number; name: string }[];
  learningOutcomes: string;
  availableSpots: number;
  startDate: string;
  shortdescription: string;
}

/**
 * Meta data types
 */
export interface Location {
  id: number;
  name: string;
}

export interface LocationsResponse {
  locations: Location[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface TagsResponse {
  tags: Tag[];
}

/**
 * User favorites type
 */
export interface UserFavorite {
  id: number;
  userId: string;
  moduleId: number;
  createdAt: string;
}

export interface FavoritesResponse {
  favorites: UserFavorite[];
}

/**
 * Frontend-friendly module shape used across lists and favorites
 */
export interface TransformedModule {
  id: number;
  title: string;
  description: string;
  startDate: string;
  level: string;
  studiepunten: number;
  locatie: string;
  periode?: string;
}

/**
 * Prediction / Keuzehulp Types
 */
export interface PredictionRequest {
  currentStudy: string;
  interests: string[];
  wantedStudyCreditRange: [number, number];
  locationPreference: string[];
  learningGoals: string[];
  levelPreference: string[];
  preferredLanguage: string;
  preferredPeriod: string[]; // Merged from KeuzeHulpForm branch
}

export interface ModulePrediction {
  module: Module;
  score: number;
  motivation: string;
}

export interface PredictionResponse {
  predictions: ModulePrediction[];
}
