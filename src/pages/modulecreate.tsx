import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useModuleCreate } from "../hooks/useModule";
import type { createModule } from "../types/api.types";

type Location = { id: string; name: string };
type Tag = { id: string; name: string };

export function CreateModulePage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { isCreating, error, createModule, getModuleTags, getLocations, createModuleTag } = useModuleCreate();

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

	const [locations, setLocations] = useState<Location[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loadingData, setLoadingData] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoadingData(true);
				console.log("Fetching locations and tags...");
				const [locationsData, tagsData] = await Promise.all([getLocations(), getModuleTags()]);
				console.log("Locations data:", locationsData);
				console.log("Tags data:", tagsData);
				const resolvedLocations = Array.isArray(locationsData) ? locationsData : (locationsData as any)?.locations ?? [];
				setLocations(resolvedLocations);
				// tagsData may be returned as an array or as an object like { moduleTags: Tag[] }
				const resolvedTags = (Array.isArray(tagsData) ? tagsData : (tagsData as any)?.moduleTags) ?? [];
				setTags(resolvedTags);
			} catch (err) {
				console.error("Failed to fetch locations/tags:", err);
				setLocations([]);
				setTags([]);
			} finally {
				setLoadingData(false);
			}
		};
		void fetchData();
	}, []);

	if (user?.role === "STUDENT") {
		return <div className="p-8 text-center text-gray-900 dark:text-white">Niet geautoriseerd</div>;
	}

	const isStartDateInPast = startDate && new Date(startDate) < new Date();
	const canSubmit = name.trim() !== "" && shortdescription.trim() !== "" && description.trim() !== "" && content.trim() !== "" && learningOutcomes.trim() !== "" && startDate.trim() !== "" && selectedLocations.length > 0 && !isStartDateInPast;

	const toggleLocation = (locId: string) => {
		setSelectedLocations((prev) => (prev.includes(locId) ? prev.filter((l) => l !== locId) : [...prev, locId]));
	};

	const toggleTag = (tagId: string) => {
		setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
	};

	const addCustomTag = async () => {
		const trimmedTag = customTag.trim();
		if (trimmedTag === "") return;

		// Check if tag already exists
		const existingTag = tags.find((t) => t.name.toLowerCase() === trimmedTag.toLowerCase());
		if (existingTag) {
			// Tag already exists, just select it
			if (!selectedTags.includes(existingTag.id)) {
				setSelectedTags((prev) => [...prev, existingTag.id]);
			}
			setCustomTag("");
			return;
		}

		setCustomTag("");

		// Create the new tag
		await createModuleTag(trimmedTag);

		// Refresh tags to get the new tag with its ID
		const tagsData = await getModuleTags();
		const resolvedTags = (Array.isArray(tagsData) ? tagsData : (tagsData as any)?.moduleTags) ?? [];
		setTags(resolvedTags);

		// Find the newly created tag and select it
		const createdTag = resolvedTags.find((t: Tag) => t.name.toLowerCase() === trimmedTag.toLowerCase());
		if (createdTag && !selectedTags.includes(createdTag.id)) {
			setSelectedTags((prev) => [...prev, createdTag.id]);
		}
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
			location: selectedLocations.map((id) => {
				const loc = locations.find((l) => l.id === id);
				return { id, name: loc?.name || "" };
			}),
			moduleTags: selectedTags.map((id) => {
				const tag = tags.find((t) => t.id === id);
				return { id, name: tag?.name || "" };
			}),
		};

		const createdModuleId = await createModule(payload);
		if (createdModuleId && !error) {
			navigate(`/modules/${createdModuleId}`);
		} else {
			setSuccessMessage("Module succesvol aangemaakt.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
			<div className="container w-full mx-auto px-4 py-10 max-w-5xl">
				<div className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Nieuwe keuzemodule aanmaken</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">Vul de details in voor de nieuwe module.</p>
				</div>

				{loadingData && (
					<div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-800 dark:text-blue-300 flex items-center gap-3">
						<div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
						Locaties en tags worden geladen...
					</div>
				)}

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

				{isStartDateInPast && startDate && <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-300">⚠️ De startdatum kan niet in het verleden liggen. Kies een toekomstige datum.</div>}

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
									{(!locations || locations.length === 0) && !loadingData && <p className="text-sm text-gray-500 dark:text-gray-400">Geen locaties beschikbaar</p>}
									{locations?.map((loc) => (
										<button type="button" key={loc.id} onClick={() => toggleLocation(loc.id)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedLocations.includes(loc.id) ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
											{loc.name}
										</button>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Kies tags of voeg een eigen tag toe</p>
								<div className="flex flex-wrap gap-2 mb-3">
									{(!tags || tags.length === 0) && !loadingData && <p className="text-sm text-gray-500 dark:text-gray-400">Geen tags beschikbaar</p>}
									{tags?.map((tag) => (
										<button type="button" key={tag.id} onClick={() => toggleTag(tag.id)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTags.includes(tag.id) ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
											{tag.name}
										</button>
									))}
								</div>
								<div className="flex flex-col sm:flex-row gap-2">
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
									<button type="button" onClick={addCustomTag} className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 w-full sm:w-auto">
										Voeg toe
									</button>
								</div>
								{selectedTags.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-2">
										{selectedTags.map((tagId) => {
											const tag = tags.find((t) => t.id === tagId);
											return (
												<span key={tagId} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
													{tag?.name || tagId}
												</span>
											);
										})}
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
