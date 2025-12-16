import { useParams } from "react-router";
import { useModule } from "../hooks/useModule";

export function ModulePage() {
	const { id } = useParams<{ id: string }>();

	const { module, isLoading, error } = useModule(id || "");

	if (isLoading) {
		return <div>Loading module...</div>;
	}

	if (error) {
		return <div>Error loading module: {error}</div>;
	}

	if (!module) {
		return <div>Module not found.</div>;
	}

	if (module) {
		return <h1>{module.name}</h1>;
	}
}
