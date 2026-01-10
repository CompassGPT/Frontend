import { useEffect, useState, useMemo, useCallback } from "react";
import { useBackend, BackendError } from "../hooks/useBackend";
import type {
  createModule,
  moduleDetail,
  ModuleResponse,
  Location,
  Tag,
  ModulesResponse,
} from "../types/api.types";
import type { TransformedModule } from "../types/api.types";

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

        const response = await backend.get<ModuleResponse>(`/modules/${id}`);

        setModule(response.module);
        console.log("Fetched module:", response.module);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof BackendError ? err.message : "Failed to fetch module"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // NOTE: backend is excluded because useBackend returns a stable memoized object
  }, [id]);

  return { module, isLoading, error };
}

export function useModulesList() {
  const backend = useBackend();
  const [modules, setModules] = useState<TransformedModule[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch modules and locations from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch modules and locations in parallel
        const [modulesResponse, locationsResponse] = await Promise.all([
          backend.get<ModulesResponse>("/modules"),
          backend.get<{ locations: Location[] }>("/modules/locations"),
        ]);

        // Transform backend Module to frontend format
        const transformed = modulesResponse.modules.map((m) => ({
          id: m.id,
          title: m.name,
          description: m.shortdescription,
          startDate: m.startDate,
          level: m.level,
          studiepunten: m.studyCredits,
          locatie:
            m.location.length > 0
              ? m.location.map((loc) => loc.name).join(", ")
              : "Onbekend",
        }));
        setModules(transformed);

        // Extract unique location names
        setLocations(locationsResponse.locations.map((loc) => loc.name));
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError("Kon modules niet laden. Probeer later opnieuw.");
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bepaal periode uit startDate (string format: "2025-09-02")
  const getPeriodeFromDate = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    const m = d.getMonth(); // 0-11
    if (m >= 8 && m <= 10) return "P1"; // sep-nov (8,9,10)
    if (m === 11 || m <= 1) return "P2"; // dec-feb (11,0,1)
    if (m >= 2 && m <= 3) return "P3"; // mrt-apr (2,3)
    return "P4"; // mei-aug (4,5,6,7)
  }, []);

  // Verrijk modules met periode
  const modulesWithPeriode = useMemo(
    () =>
      modules.map((m) => ({
        ...m,
        periode: getPeriodeFromDate(m.startDate),
      })),
    [getPeriodeFromDate, modules]
  );

  // Filter opties
  const filterOptions = useMemo(() => {
    const levelOpties = ["NLQF5", "NLQF6"];
    const ecOpties = [15, 30];
    const periodeOpties = ["P1", "P2", "P3", "P4"];
    const locatieOpties = locations;

    return { levelOpties, ecOpties, periodeOpties, locatieOpties };
  }, [locations]);

  // Filter modules
  const filterModules = useCallback(
    (
      modulesToFilter: typeof modulesWithPeriode,
      searchQuery: string,
      selectedPeriode: string[],
      selectedLocatie: string[],
      selectedLevel: string[],
      selectedEC: number[],
      showOnlyFavorites: boolean,
      favoriteIds: number[]
    ) => {
      return modulesToFilter.filter((module) => {
        if (showOnlyFavorites && !favoriteIds.includes(module.id)) {
          return false;
        }

        const matchesSearch =
          searchQuery === "" ||
          module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPeriode =
          selectedPeriode.length === 0 ||
          selectedPeriode.includes(module.periode);

        const matchesLocatie =
          selectedLocatie.length === 0 ||
          selectedLocatie.some((loc) => module.locatie.includes(loc));

        const matchesLevel =
          selectedLevel.length === 0 || selectedLevel.includes(module.level);

        const matchesEC =
          selectedEC.length === 0 || selectedEC.includes(module.studiepunten);

        return (
          matchesSearch &&
          matchesPeriode &&
          matchesLocatie &&
          matchesLevel &&
          matchesEC
        );
      });
    },
    []
  );

  return {
    modules: modulesWithPeriode,
    loading,
    error,
    filterOptions,
    filterModules,
    getPeriodeFromDate,
  };
}
export function useModuleCreate() {
  const backend = useBackend();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getModuleTags = useCallback(async (): Promise<Tag[]> => {
    try {
      console.log("Calling /modules/moduletags...");
      const response = await backend.get<{ moduleTags: Tag[] }>(
        "/modules/moduletags"
      );
      console.log("ModuleTags response:", response);
      return response.moduleTags;
    } catch (err) {
      console.error("Error fetching module tags:", err);
      return [];
    }
  }, [backend]);

  const getLocations = useCallback(async (): Promise<Location[]> => {
    try {
      console.log("Calling /modules/locations...");
      const response = await backend.get<{ locations: Location[] }>(
        "/modules/locations"
      );
      console.log("Locations response:", response);
      return response.locations;
    } catch (err) {
      console.error("Error fetching locations:", err);
      return [];
    }
  }, [backend]);

  const createModule = useCallback(
    async (module: createModule) => {
      try {
        setIsCreating(true);
        setError(null);
        module.location = module.location.map((loc) => ({
          id: loc.id,
          name: loc.name,
        }));
        module.moduleTags = module.moduleTags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
        console.log("Creating module with data:", module);
        const response = await backend.post<{ module: moduleDetail }>(
          "/modules",
          module
        );
        return response.module?.id || null;
      } catch (err) {
        console.error(err);
        setError(
          err instanceof BackendError ? err.message : "Failed to create module"
        );
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [backend]
  );

  const createModuleTag = useCallback(
    async (tag: string) => {
      try {
        if (!tag) return null;
        console.log("Creating module tags:", tag);
        const response = await backend.post<{ moduleTag: Tag }>(
          "/modules/moduletags",
          { tag }
        );
        console.log("ModuleTags response:", response);
        return response.moduleTag;
      } catch (err) {
        console.error("Error creating module tags:", err);
        return null;
      }
    },
    [backend]
  );

  return {
    isCreating,
    error,
    createModule,
    getModuleTags,
    getLocations,
    createModuleTag,
  };
}
