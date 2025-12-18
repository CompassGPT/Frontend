import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useModuleCreate } from "../hooks/useModule";
import type { createModule } from "../types/api.types";

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

const locationOptions = ["Tilburg", "Breda", "Den Bosch", "Roosendaal"];
const tagOptions = ["Data", "AI", "Design", "Business", "Tech"];

export function CreateModulePage() {
	const { user } = useAuth();
	const { isCreating, error, createModule } = useModuleCreate();

	const [name, setName] = useState("");
	const [shortdescription, setShortdescription] = useState("");
	const [description, setDescription] = useState("");
	const [content, setContent] = useState("");
	const [learningOutcomes, setLearningOutcomes] = useState("");
	const [level, setLevel] = useState("NLQF5");
	const [studyCredits, setStudyCredits] = useState(15);
	const [availableSpots, setAvailableSpots] = useState(30);
	const [startDate, setStartDate] = useState("");
	const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [customTag, setCustomTag] = useState("");
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	if (user?.role === "STUDENT") {
		return <div className="p-8 text-center text-gray-900 dark:text-white">Niet geautoriseerd</div>;
	}

	const canSubmit = name.trim() !== "" && shortdescription.trim() !== "" && description.trim() !== "" && content.trim() !== "" && learningOutcomes.trim() !== "" && startDate.trim() !== "" && selectedLocations.length > 0;

	const toggleLocation = (loc: string) => {
		setSelectedLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]));
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
	};

	const addCustomTag = () => {
		const t = customTag.trim();
		if (!t) return;
		setSelectedTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
		setCustomTag("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSuccessMessage(null);

		const payload: createModule = {
			name,
			shortdescription,
			description,
			content,
			level,
			studyCredits,
			availableSpots,
			startDate,
			learningOutcomes,
			location: selectedLocations.map((name) => ({ id: slugify(name), name })),
			moduleTags: selectedTags.map((name) => ({ id: slugify(name), name })),
		};

		await createModule(payload);
		if (!error) {
			setSuccessMessage("Module succesvol aangemaakt.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
			<div className="container w-full mx-auto px-4 py-10 max-w-5xl">
				<div className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Nieuwe keuzemodule aanmaken</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">Vul de details in voor de nieuwe module. Locaties en tags zijn voorlopig lokale opties totdat de API beschikbaar is.</p>
				</div>

				{successMessage && (
					<div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-800 dark:text-green-300">
						{successMessage}
						<span className="ml-2">
							<Link className="underline" to="/modules">
								Terug naar overzicht
							</Link>
						</span>
					</div>
				)}

				{error && <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-300">{error}</div>}

				<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8">
					{/* Basisgegevens */}
					<section>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basisgegevens</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Naam</label>
								<input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Bijv. Data Science Essentials" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Niveau</label>
								<select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
									<option>NLQF5</option>
									<option>NLQF6</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Studiepunten (EC)</label>
								<select value={studyCredits} onChange={(e) => setStudyCredits(parseInt(e.target.value, 10))} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
									<option value={15}>15</option>
									<option value={30}>30</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Beschikbare plekken</label>
								<input type="number" min={0} value={availableSpots} onChange={(e) => setAvailableSpots(parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Startdatum</label>
								<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
							</div>
						</div>
					</section>

					{/* Beschrijvingen */}
					<section>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Beschrijvingen</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Korte beschrijving</label>
								<textarea value={shortdescription} onChange={(e) => setShortdescription(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Een korte samenvatting" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leerdoelen</label>
								<textarea value={learningOutcomes} onChange={(e) => setLearningOutcomes(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Wat leert de student?" />
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Volledige beschrijving</label>
								<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inhoud</label>
								<textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
							</div>
						</div>
					</section>

					{/* Locaties & Tags */}
					<section>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Locaties & Tags</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selecteer één of meer locaties</p>
								<div className="flex flex-wrap gap-2">
									{locationOptions.map((loc) => (
										<button type="button" key={loc} onClick={() => toggleLocation(loc)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedLocations.includes(loc) ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
											{loc}
										</button>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Kies tags of voeg een eigen tag toe</p>
								<div className="flex flex-wrap gap-2 mb-3">
									{tagOptions.map((tag) => (
										<button type="button" key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTags.includes(tag) ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
											{tag}
										</button>
									))}
								</div>
								<div className="flex gap-2">
									<input
										value={customTag}
										onChange={(e) => setCustomTag(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addCustomTag();
											}
										}}
										className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
										placeholder="Eigen tag toevoegen"
									/>
									<button type="button" onClick={addCustomTag} className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
										Voeg toe
									</button>
								</div>
								{selectedTags.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-2">
										{selectedTags.map((t) => (
											<span key={t} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
												{t}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Acties */}
					<div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
						<Link to="/modules" className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
							Annuleren
						</Link>
						<button type="submit" disabled={!canSubmit || isCreating} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${!canSubmit || isCreating ? "bg-blue-300 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
							{isCreating ? (
								<>
									<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									Aan het aanmaken...
								</>
							) : (
								<>Module aanmaken</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
