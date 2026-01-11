import { X, Plus, Search, MapPin, Tag as TagIcon, Check } from "lucide-react";
import type { createModule, Location, Tag } from "../types/api.types";
import CustomDatePicker from "../components/DatePicker";
import { useModuleCreate } from "../hooks/useModule";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { format, startOfToday } from "date-fns";

export function CreateModulePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    isCreating,
    error,
    createModule,
    getModuleTags,
    getLocations,
    createModuleTag,
  } = useModuleCreate();

  // Form fields
  const [name, setName] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [level, setLevel] = useState("NLQF5");
  const [studyCredits, setStudyCredits] = useState(15);
  const [availableSpots, setAvailableSpots] = useState(30);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // UI state
  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Load locations and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [locationsData, tagsData] = await Promise.all([
          getLocations(),
          getModuleTags(),
        ]);
        setLocations(Array.isArray(locationsData) ? locationsData : []);
        setTags(Array.isArray(tagsData) ? tagsData : []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLocations([]);
        setTags([]);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [getLocations, getModuleTags]);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(e.target as Node) &&
        !tagInputRef.current?.contains(e.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (user?.role === "STUDENT") {
    return (
      <div className="p-8 text-center text-gray-900 dark:text-white">
        Niet geautoriseerd
      </div>
    );
  }

  const isStartDateInPast = startDate && new Date(startDate) < new Date();
  const canSubmit =
    name.trim() !== "" &&
    shortdescription.trim() !== "" &&
    description.trim() !== "" &&
    content.trim() !== "" &&
    learningOutcomes.trim() !== "" &&
    startDate !== null &&
    selectedLocations.length > 0 &&
    !isStartDateInPast;

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const unselectedTags = filteredTags.filter(
    (tag) => !selectedTags.includes(tag.id)
  );

  const selectedTagObjects = tags.filter((tag) =>
    selectedTags.includes(tag.id)
  );

  const toggleLocation = (locId: number) => {
    setSelectedLocations((prev) =>
      prev.includes(locId)
        ? prev.filter((id) => id !== locId)
        : [...prev, locId]
    );
  };

  const addTag = (tagId: number) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags((prev) => [...prev, tagId]);
    }
    setTagSearch("");
    setShowTagDropdown(false);
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  const createNewTag = async () => {
    const trimmedTag = tagSearch.trim();
    if (!trimmedTag) return;

    // Check if tag already exists
    const existingTag = tags.find(
      (t) => t.name.toLowerCase() === trimmedTag.toLowerCase()
    );
    if (existingTag) {
      addTag(existingTag.id);
      return;
    }

    try {
      setIsCreatingTag(true);
      await createModuleTag(trimmedTag);

      // Refresh tags
      const tagsData = await getModuleTags();
      const newTags = Array.isArray(tagsData) ? tagsData : [];
      setTags(newTags);

      // Select the newly created tag
      const createdTag = newTags.find(
        (t) => t.name.toLowerCase() === trimmedTag.toLowerCase()
      );
      if (createdTag) {
        addTag(createdTag.id);
      }
    } catch (err) {
      console.error("Failed to create tag:", err);
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate) return;

    const payload: createModule = {
      name,
      shortdescription,
      description,
      content,
      level,
      studyCredits,
      availableSpots,
      startDate: format(startDate, "yyyy-MM-dd"),
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
    }
  };

  const shortDescLength = shortdescription.length;
  const descLength = description.length;
  const contentLength = content.length;
  const learningLength = learningOutcomes.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container w-full mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link
              to="/modules"
              className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Modules
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Nieuwe module</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nieuwe keuzemodule aanmaken
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Vul alle details in om een nieuwe module aan te maken.
          </p>
        </div>

        {/* Loading State */}
        {loadingData && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-800 dark:text-blue-300 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Gegevens laden...
          </div>
        )}

        {/* Date Validation */}
        {isStartDateInPast && startDate && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-300">
            ⚠️ De startdatum kan niet in het verleden liggen.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  1
                </span>
              </div>
              Basisinformatie
            </h2>

            <div className="space-y-4">
              {/* Module Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modulenaam *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Bijv. Data Science Essentials"
                  required
                />
              </div>

              {/* Grid for smaller fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Niveau *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                    <option value="NLQF5">NLQF5</option>
                    <option value="NLQF6">NLQF6</option>
                  </select>
                </div>

                {/* Study Credits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Studiepunten *
                  </label>
                  <select
                    value={studyCredits}
                    onChange={(e) =>
                      setStudyCredits(parseInt(e.target.value, 10))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                    <option value={15}>15 EC</option>
                    <option value={30}>30 EC</option>
                  </select>
                </div>

                {/* Available Spots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Beschikbare plekken *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={availableSpots}
                    onChange={(e) =>
                      setAvailableSpots(parseInt(e.target.value, 10) || 0)
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Startdatum *
                  </label>
                  <CustomDatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    placeholder="Selecteer een startdatum"
                    minDate={startOfToday()}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Locations & Tags Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  2
                </span>
              </div>
              Locaties & Tags
            </h2>

            <div className="space-y-6">
              {/* Locations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Locaties *{" "}
                    <span className="text-xs text-gray-500">
                      (selecteer minimaal één)
                    </span>
                  </label>
                </div>
                {loadingData ? (
                  <div className="text-sm text-gray-500">Laden...</div>
                ) : locations.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    Geen locaties beschikbaar
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {locations.map((loc) => (
                      <button
                        type="button"
                        key={loc.id}
                        onClick={() => toggleLocation(loc.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                          selectedLocations.includes(loc.id)
                            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300"
                            : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}>
                        {selectedLocations.includes(loc.id) && (
                          <Check className="w-4 h-4 inline mr-1" />
                        )}
                        {loc.name}
                      </button>
                    ))}
                  </div>
                )}
                {selectedLocations.length === 0 && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Selecteer minimaal één locatie
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TagIcon className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags{" "}
                    <span className="text-xs text-gray-500">(optioneel)</span>
                  </label>
                </div>

                {/* Selected Tags */}
                {selectedTagObjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTagObjects.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => removeTag(tag.id)}
                          className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag Search Input */}
                <div className="relative" ref={tagDropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={tagSearch}
                      onChange={(e) => {
                        setTagSearch(e.target.value);
                        setShowTagDropdown(true);
                      }}
                      onFocus={() => setShowTagDropdown(true)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Zoek of voeg tags toe..."
                    />
                  </div>

                  {/* Dropdown */}
                  {showTagDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {unselectedTags.length > 0 ? (
                        <div className="p-2">
                          {unselectedTags.map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => addTag(tag.id)}
                              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors">
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      ) : tagSearch.trim() ? (
                        <div className="p-4">
                          <button
                            type="button"
                            onClick={createNewTag}
                            disabled={isCreatingTag}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                            {isCreatingTag ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Aanmaken...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Tag "{tagSearch}" aanmaken
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          Typ om te zoeken of een nieuwe tag aan te maken
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  3
                </span>
              </div>
              Beschrijvingen
            </h2>

            <div className="space-y-4">
              {/* Short Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Korte beschrijving *
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {shortDescLength} karakters
                  </span>
                </div>
                <textarea
                  value={shortdescription}
                  onChange={(e) => setShortdescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Een korte samenvatting voor in het overzicht..."
                  required
                />
              </div>

              {/* Full Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Volledige beschrijving *
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {descLength} karakters
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Uitgebreide beschrijving van de module..."
                  required
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Inhoud *
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {contentLength} karakters
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Wat wordt er behandeld in deze module..."
                  required
                />
              </div>

              {/* Learning Outcomes */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Leerdoelen *
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {learningLength} karakters
                  </span>
                </div>
                <textarea
                  value={learningOutcomes}
                  onChange={(e) => setLearningOutcomes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Wat leert de student na afloop..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-300">
              <strong>Fout:</strong> {error}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              to="/modules"
              className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={!canSubmit || isCreating}
              className="flex-1 sm:flex-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Module aanmaken...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Module aanmaken
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
