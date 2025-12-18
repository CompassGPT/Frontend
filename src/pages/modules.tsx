import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router";
import { useBackend } from "../hooks/useBackend";
import type { ModulesResponse } from "../types/api.types";
import { useAuth } from "../hooks/useAuth";

interface TransformedModule {
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

export function ModulesPage() {
	const backend = useBackend();
	const [modules, setModules] = useState<TransformedModule[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const modulesPerPage = 5;

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedPeriode, setSelectedPeriode] = useState<string[]>([]);
	const [selectedLocatie, setSelectedLocatie] = useState<string[]>([]);
	const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
	const [selectedEC, setSelectedEC] = useState<number[]>([]);
	const [favoriteModules, setFavoriteModules] = useState<string[]>([]);
	const [showMobileFilters, setShowMobileFilters] = useState(false);
	const { user } = useAuth();

	// Fetch modules from backend
	useEffect(() => {
		const fetchModules = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await backend.get<ModulesResponse>("/api/modules");
				// Transform backend Module to frontend format
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
				setModules(transformed);
			} catch (err) {
				console.error("Failed to fetch modules:", err);
				setError("Kon modules niet laden. Probeer later opnieuw.");
				setModules([]);
			} finally {
				setLoading(false);
			}
		};

		void fetchModules();
	}, [backend]);

	// Filter open/dicht state
	const [openFilters, setOpenFilters] = useState({
		periode: true,
		locatie: true,
		level: true,
		studiepunten: true,
	});

	const toggleFilter = (filter: keyof typeof openFilters) => {
		setOpenFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
	};

	const handleFilterToggle = (value: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
		if (selected.includes(value)) {
			setSelected(selected.filter((item) => item !== value));
		} else {
			setSelected([...selected, value]);
		}
	};

	const handleReset = () => {
		setSearchQuery("");
		setSelectedPeriode([]);
		setSelectedLocatie([]);
		setSelectedLevel([]);
		setSelectedEC([]);
		setCurrentPage(1);
	};

	const toggleFavorite = (moduleId: string) => {
		setFavoriteModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
	};

	// Bepaal periode uit startDate (string format: "2025-09-02")
	const getPeriodeFromDate = (dateStr: string) => {
		const d = new Date(dateStr);
		const m = d.getMonth(); // 0-11
		if (m >= 8 && m <= 10) return "P1"; // sep-nov (8,9,10)
		if (m === 11 || m <= 1) return "P2"; // dec-feb (11,0,1)
		if (m >= 2 && m <= 3) return "P3"; // mrt-apr (2,3)
		return "P4"; // mei-aug (4,5,6,7)
	};

	// Afgeleide opties
	const levelOpties = ["NLQF5", "NLQF6"];
	const ecOpties = [15, 30];

	// Verrijk modules met periode
	const modulesWithPeriode = useMemo(
		() =>
			modules.map((m) => ({
				...m,
				periode: getPeriodeFromDate(m.startDate),
			})),
		[modules]
	);

	// Filter modules
	const filteredModules = modulesWithPeriode.filter((module) => {
		const matchesSearch = searchQuery === "" || module.title.toLowerCase().includes(searchQuery.toLowerCase()) || module.description.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesPeriode = selectedPeriode.length === 0 || selectedPeriode.includes(module.periode);

		const matchesLocatie = selectedLocatie.length === 0 || selectedLocatie.some((loc) => module.locatie.includes(loc));
		const matchesLevel = selectedLevel.length === 0 || selectedLevel.includes(module.level);
		const matchesEC = selectedEC.length === 0 || selectedEC.includes(module.studiepunten);

		return matchesSearch && matchesPeriode && matchesLocatie && matchesLevel && matchesEC;
	});

	// Pagination
	const totalPages = Math.ceil(filteredModules.length / modulesPerPage);
	const startIndex = (currentPage - 1) * modulesPerPage;
	const paginatedModules = filteredModules.slice(startIndex, startIndex + modulesPerPage);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
			{/* Header */}
			<div className="text-center py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Keuzemodules</h1>
				<p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">Via keuzemodules krijg je de vrijheid om een deel van je opleiding zelf samen te stellen en kun je jezelf straks beter profileren op de arbeidsmarkt. Via deze pagina kun je zoeken en filteren op alle keuzemodules die Avans te bieden heeft.</p>
			</div>

			{/* Loading state */}
			{loading && (
				<div className="flex justify-center items-center py-20">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			)}

			{/* Error state */}
			{error && (
				<div className="container mx-auto px-4 py-8">
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-300 transition-colors">{error}</div>
				</div>
			)}

			{/* Main content */}
			{!loading && !error && (
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Mobile Filter Backdrop */}
						{showMobileFilters && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)} />}

						{/* Sidebar met filters */}
						<aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md max-h-[85vh] z-50 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl overflow-y-auto lg:static lg:transform-none lg:w-72 lg:max-h-none lg:bg-transparent lg:p-0 lg:overflow-visible lg:shadow-none lg:rounded-none" : "hidden lg:block"}`}>
							<div className="flex justify-between items-center mb-4 lg:hidden">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
								<button type="button" aria-label="Sluit filters" onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="space-y-4">
								<button onClick={handleReset} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									Reset filters
								</button>

								{/* Niveau filter */}
								<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
									<button onClick={() => toggleFilter("level")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
										<h3 className="font-semibold text-gray-900 dark:text-white">Niveau</h3>
										<svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openFilters.level ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									<div className={`transition-all duration-200 ease-in-out ${openFilters.level ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
										<div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-700">
											{levelOpties.map((lvl) => (
												<label key={lvl} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
													<input type="checkbox" checked={selectedLevel.includes(lvl)} onChange={() => handleFilterToggle(lvl, selectedLevel, setSelectedLevel)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
													<span className="text-gray-900 dark:text-white">{lvl}</span>
												</label>
											))}
										</div>
									</div>
								</div>

								{/* Studiepunten filter */}
								<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
									<button onClick={() => toggleFilter("studiepunten")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
										<h3 className="font-semibold text-gray-900 dark:text-white">Studiepunten (EC)</h3>
										<svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openFilters.studiepunten ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									<div className={`transition-all duration-200 ease-in-out ${openFilters.studiepunten ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
										<div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-700">
											{ecOpties.map((ec) => (
												<label key={ec} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
													<input type="checkbox" checked={selectedEC.includes(ec)} onChange={() => setSelectedEC((prev) => (prev.includes(ec) ? prev.filter((e) => e !== ec) : [...prev, ec]))} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
													<span className="text-gray-900 dark:text-white">{ec} EC</span>
												</label>
											))}
										</div>
									</div>
								</div>

								{/* Periode filter */}
								<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
									<button onClick={() => toggleFilter("periode")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
										<h3 className="font-semibold text-gray-900 dark:text-white">Periode</h3>
										<svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openFilters.periode ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									<div className={`transition-all duration-200 ease-in-out ${openFilters.periode ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
										<div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-700">
											{["P1", "P2", "P3", "P4"].map((periode) => (
												<label key={periode} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
													<input type="checkbox" checked={selectedPeriode.includes(periode)} onChange={() => handleFilterToggle(periode, selectedPeriode, setSelectedPeriode)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
													<span className="text-gray-900 dark:text-white">{periode}</span>
												</label>
											))}
										</div>
									</div>
								</div>

								{/* Locatie filter */}
								<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
									<button onClick={() => toggleFilter("locatie")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
										<h3 className="font-semibold text-gray-900 dark:text-white">Locatie</h3>
										<svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openFilters.locatie ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									<div className={`transition-all duration-200 ease-in-out ${openFilters.locatie ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
										<div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-700">
											{["Tilburg", "Breda", "Den Bosch", "Roosendaal"].map((locatie) => (
												<label key={locatie} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
													<input type="checkbox" checked={selectedLocatie.includes(locatie)} onChange={() => handleFilterToggle(locatie, selectedLocatie, setSelectedLocatie)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
													<span className="text-gray-900 dark:text-white">{locatie}</span>
												</label>
											))}
										</div>
									</div>
								</div>

								<button onClick={() => setShowMobileFilters(false)} className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors lg:hidden">
									Toon {filteredModules.length} resultaten
								</button>
							</div>
						</aside>

						{/* Main content */}
						<main className="flex-1">
							{/* Search bar */}
							<div className="flex flex-col sm:flex-row gap-3 mb-6">
								<input type="text" placeholder="Zoek op keuzemodule naam" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" />
								<button onClick={() => setShowMobileFilters(!showMobileFilters)} className="lg:hidden px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
									</svg>
									Filters
								</button>
							</div>

							{/* Results info and favorites button */}
							<div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										{startIndex + 1} - {Math.min(startIndex + modulesPerPage, filteredModules.length)} van {filteredModules.length} keuzemodules
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filteredModules.length === 0 ? "Geen resultaten met deze filters" : "Selecteer een module om meer te zien"}</p>
								</div>
								<button className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
									</svg>
									Toon favorieten ({favoriteModules.length})
								</button>
							</div>

							{/* Active filters display */}
							{(selectedPeriode.length > 0 || selectedLocatie.length > 0 || selectedLevel.length > 0 || selectedEC.length > 0) && (
								<div className="mb-6 flex flex-wrap gap-2">
									{selectedPeriode.map((periode) => (
										<div key={periode} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
											{periode}
											<button onClick={() => setSelectedPeriode(selectedPeriode.filter((p) => p !== periode))} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Filter verwijderen">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
									{selectedLocatie.map((locatie) => (
										<div key={locatie} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
											{locatie}
											<button onClick={() => setSelectedLocatie(selectedLocatie.filter((l) => l !== locatie))} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Filter verwijderen">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
									{selectedLevel.map((lvl) => (
										<div key={lvl} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
											{lvl}
											<button onClick={() => setSelectedLevel(selectedLevel.filter((l) => l !== lvl))} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Filter verwijderen">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
									{selectedEC.map((ec) => (
										<div key={ec} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
											{ec} EC
											<button onClick={() => setSelectedEC(selectedEC.filter((e) => e !== ec))} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Filter verwijderen">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
								</div>
							)}

							{/* Module cards */}
							<div className="space-y-4">
								{filteredModules.length === 0 ? (
									<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors">
										<p className="text-gray-500 dark:text-gray-400">Geen modules gevonden met de huidige filters.</p>
									</div>
								) : (
									paginatedModules.map((module) => (
										<div key={module.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col sm:flex-row gap-5 transition-colors">
											{/* Module afbeelding placeholder */}
											<div className="w-full sm:w-36 h-48 sm:h-28 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-gray-700 transition-colors">
												<span className="text-gray-400 dark:text-gray-500 text-sm">Plaatje</span>
											</div>

											{/* Module info */}
											<div className="flex-1 min-w-0">
												{/* Tags */}
												<div className="flex gap-2 mb-2 flex-wrap">
													<span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">{module.periode}</span>
													<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">{module.studiepunten} Studiepunten</span>
													<span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">{module.level}</span>
												</div>

												{/* Titel */}
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{module.title}</h3>

												{/* Beschrijving */}
												<p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{module.description}</p>
											</div>

											{/* Locatie en acties rechts */}
											<div className="flex flex-col sm:items-end justify-between gap-3 flex-shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-gray-700 mt-2 sm:mt-0">
												<div className="flex items-center sm:justify-end gap-2 text-sm text-gray-600 dark:text-gray-400">
													<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s7-4.5 7-11.5A7 7 0 005 9.5C5 16.5 12 21 12 21z" />
													</svg>
													<span className="font-medium text-gray-700 dark:text-white">{module.locatie}</span>
												</div>

												<div className="flex flex-wrap sm:flex-nowrap items-center sm:items-end gap-2">
													<Link to={`/modules/${module.id}`} className="flex-1 sm:flex-none text-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">
														Meer info
													</Link>
													<button className="flex-1 sm:flex-none justify-center px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 whitespace-nowrap" type="button">
														Aanmelden
														<span className="hidden sm:inline"> via Osiris</span>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0-7L10 14" />
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14h14" />
														</svg>
													</button>
													<button onClick={() => toggleFavorite(module.id)} className={`p-2 rounded-lg transition-colors ${favoriteModules.includes(module.id) ? "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400" : "border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"}`} title={favoriteModules.includes(module.id) ? "Verwijder van favorieten" : "Voeg toe aan favorieten"}>
														<svg className="w-5 h-5" fill={favoriteModules.includes(module.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
															<path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
														</svg>
													</button>
												</div>
											</div>
										</div>
									))
								)}
							</div>

							{/* Pagination */}
							{filteredModules.length > modulesPerPage && (
								<div className="flex justify-center items-center gap-2 mt-8">
									<button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
										Vorige
									</button>

									<div className="flex items-center gap-1">
										{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
											<button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${currentPage === page ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-900 dark:border-gray-600" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
												{page}
											</button>
										))}
									</div>

									<button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
										Volgende
									</button>
								</div>
							)}

							{/* Create Module Button when user is not a student */}
							{user?.role !== "STUDENT" && (
								<div className="flex justify-center mt-8">
									<Link to="/modules/create" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
										</svg>
										Nieuwe keuzemodule aanmaken
									</Link>
								</div>
							)}
						</main>
					</div>
				</div>
			)}
		</div>
	);
}
