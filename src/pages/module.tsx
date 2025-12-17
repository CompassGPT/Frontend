import { useParams } from "react-router";
import { useModule } from "../hooks/useModule";
import { useState } from "react";
import keuzemoduleFallback from "../images/keuzemodule_fallback_16-9.webp";

export function ModulePage() {
	const { id } = useParams<{ id: string }>();

	const { module, isLoading, error } = useModule(id || "");
	const [favoriteModules, setFavoriteModules] = useState<string[]>([]);

	const toggleFavorite = (moduleId: string) => {
		setFavoriteModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
	};

	if (isLoading) {
		return <div>Loading module...</div>;
	}

	if (error) {
		return <div>Error loading module: {error}</div>;
	}

	if (!module) {
		return <div>Module not found.</div>;
	}

	return (
		<div className="w-full py-8 px-6 mx-auto">
			<div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
				<div className="p-6 m-4 sm:m-8 lg:m-10 w-full lg:w-5/6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
					<h1 className="text-2xl font-bold">{module.name}</h1>
					<div className="mt-4">
						<h2 className="text-lg font-semibold">Dit is wat je gaat leren</h2>
						<p>{module.learningOutcomes}</p>
					</div>
					<div className="flex flex-nowrap gap-2 mt-4 p-4 items-center">
						<button className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-full border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2" type="button">
							Aanmelden via Osiris
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0-7L10 14" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14h14" />
							</svg>
						</button>
						<button onClick={() => toggleFavorite(module.id)} className={`p-2 rounded-lg transition-colors ${favoriteModules.includes(module.id) ? "bg-red-50 text-red-500" : "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}`} title={favoriteModules.includes(module.id) ? "Verwijder van favorieten" : "Voeg toe aan favorieten"}>
							<svg className="w-5 h-5" fill={favoriteModules.includes(module.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
								<path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
							</svg>
						</button>
					</div>
				</div>
				<div className="p-6 m-4 sm:m-8 lg:m-10 w-full lg:w-5/6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
					<div className="flex flex-col md:flex-row gap-6">
						<div className="mb-4 w-full md:w-1/2">
							<img src={keuzemoduleFallback} alt="Afbeelding van de module" className="w-full h-auto rounded object-cover" />
						</div>
						<div className="flex-1 place-self-center space-y-2">
							<h2 className="text-lg font-semibold">Waar en wanneer?</h2>
							<p>
								{module.startDate} {module.location.map((location) => location.name).join(", ")}
							</p>
							<h2 className="text-lg font-semibold">Beschrijving</h2>
							<p>{module.description}</p>
						</div>
					</div>
					<div className="mt-4">
						<h2 className="text-lg font-semibold">Inhoud van de module</h2>
						<p>{module.content}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
