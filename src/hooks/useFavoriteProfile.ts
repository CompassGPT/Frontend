import { useState, useEffect, useMemo } from "react";
import { useBackend } from "./useBackend";
import { useFavorites } from "./useFavorites";
import type { ModulesResponse } from "../types/api.types";

export interface TransformedModule {
	id: string;
	title: string;
	description: string;
	startDate: string;
	level: string;
	studiepunten: number;
	locatie: string;
	image: null;
	periode?: string;
}

export function useFavoriteModules() {
	const backend = useBackend();
	const { favoriteIds, isLoading: isLoadingIds } = useFavorites();
	const [allModules, setAllModules] = useState<TransformedModule[]>([]);
	const [isLoadingModules, setIsLoadingModules] = useState(true);

	useEffect(() => {
		const fetchModules = async () => {
			try {
				setIsLoadingModules(true);
				const response = await backend.get<ModulesResponse>("/api/modules");
				const transformed = response.modules.map((m) => ({
					id: m.id,
					title: m.name,
					description: m.shortdescription,
					startDate: m.startDate,
					level: m.level,
					studiepunten: m.studyCredits,
					locatie: m.location.length > 0 ? m.location.map((loc) => loc.name).join(", ") : "Onbekend",
					image: null,
				}));
				setAllModules(transformed);
			} catch (err) {
				console.error("Failed to fetch modules:", err);
			} finally {
				setIsLoadingModules(false);
			}
		};

		fetchModules();
	}, [backend]);

	const favoriteModules = useMemo(() => {
		return allModules.filter((m) => favoriteIds.includes(m.id));
	}, [allModules, favoriteIds]);

	return { favoriteModules, isLoading: isLoadingModules || isLoadingIds };
}
