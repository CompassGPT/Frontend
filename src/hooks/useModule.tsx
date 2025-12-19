import { useEffect, useState } from "react";
import { useBackend, BackendError } from "../hooks/useBackend";
import type { createModule, moduleDetail, ModuleResponse } from "../types/api.types";

export function useModule(id: string) {
	const backend = useBackend();
	const [module, setModule] = useState<moduleDetail | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		const fetchModule = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await backend.get<ModuleResponse>(`/api/modules/${id}`);

				setModule(response.module); // ✅ correct
				console.log("Fetched module:", response.module);
			} catch (err) {
				console.error(err);
				setError(err instanceof BackendError ? err.message : "Failed to fetch module");
			} finally {
				setIsLoading(false);
			}
		};

		fetchModule();
	}, [backend, id]);

	return { module, isLoading, error };
}
export function useModuleCreate() {
	const backend = useBackend();
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getModuleTags = async () => {
		try {
			console.log("Calling /api/moduletags...");
			const response = await backend.get<{ moduleTags: { id: string; name: string }[] }>("/api/moduletags");
			console.log("ModuleTags response:", response);
			return response;
		} catch (err) {
			console.error("Error fetching module tags:", err);
			return [];
		}
	};

	const getLocations = async () => {
		try {
			console.log("Calling /api/locations...");
			const response = await backend.get<{ locations: { id: string; name: string }[] }>("/api/locations");
			console.log("Locations response:", response);
			return response;
		} catch (err) {
			console.error("Error fetching locations:", err);
			return [];
		}
	};

	const createModule = async (module: createModule) => {
		try {
			setIsCreating(true);
			setError(null);
			const response = await backend.post<{ module: moduleDetail }>("/api/modules", module);
			return response.module?.id || null;
		} catch (err) {
			console.error(err);
			setError(err instanceof BackendError ? err.message : "Failed to create module");
			return null;
		} finally {
			setIsCreating(false);
		}
	};

	const createModuleTag = async (tag: string) => {
		try {
			console.log("Creating module tags:", tag);
			const response = await backend.post<{ moduleTags: { id: string; name: string } }>("/api/moduletags", { tag });
			console.log("ModuleTags response:", response);
			return response;
		} catch (err) {
			console.error("Error creating module tags:", err);
			return null;
		}
	};

	return { isCreating, error, createModule, getModuleTags, getLocations, createModuleTag };
}
