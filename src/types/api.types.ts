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

export interface Module {
	id: string;
	name: string;
	shortdescription: string;
	studyCredits: number;
	level: string;
	location: { id: string; name: string }[];
	startDate: string;
}

export interface ModulesResponse {
	modules: Module[];
}
export interface moduleDetail {
	id: string;
	name: string;
	description: string;
	content: string;
	level: string;
	studyCredits: number;
	location: { id: string; name: string }[];
	moduleTags: { id: string; name: string }[];
	learningOutcomes: string;
	availableSpots: number;
	startDate: string;
}
export interface ModuleResponse {
	module: moduleDetail;
}

export interface Module {
	id: string;
	name: string;
	shortdescription: string;
	studyCredits: number;
	level: string;
	location: { id: string; name: string }[];
	startDate: string;
}

export interface ModulesResponse {
	modules: Module[];
}
export interface createModule {
	name: string;
	description: string;
	content: string;
	level: string;
	studyCredits: number;
	location: { id: string; name: string }[];
	moduleTags: { id: string; name: string }[];
	learningOutcomes: string;
	availableSpots: number;
	startDate: string;
	shortdescription: string;
}
