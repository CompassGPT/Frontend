import { useMemo, useState } from "react";
import { Link } from "react-router";

// Mock data voor modules
const mockModules = [
  {
    id: "1",
    title: "Titel van module",
    description:
      "Beschrijving van module - bldsaldsa d saiodsa dsaiohf dsfdsiofds fdsijfds f fidshfds nfdshif sfjdsiohfjds fdsfdsifdsjhio fisdohf dsfhidsof bdsfjdsofhds fdsopifds fdsoipfjds fds dsadasdsadsadsa dsadsadsadsadsadsafnioefew fewofew bf dfsafdsfdspn fdsopinfds",
    startDate: "2025-09-02",
    level: "Beginner",
    studiepunten: 3,
    locatie: "Tilburg",
    image: null,
  },
  {
    id: "2",
    title: "Web Development Advanced",
    description:
      "Leer geavanceerde webontwikkeling met moderne frameworks en tools. Deze module behandelt React, TypeScript, en backend development.",
    startDate: "2025-12-01",
    level: "Gevorderd",
    studiepunten: 5,
    locatie: "Breda",
    image: null,
  },
  {
    id: "3",
    title: "Data Science Basics",
    description:
      "Introductie tot data science met Python. Leer data analyse, visualisatie en machine learning basics.",
    startDate: "2026-03-03",
    level: "Beginner",
    studiepunten: 4,
    locatie: "Den Bosch",
    image: null,
  },
];

// Filter opties
const periodeOpties = ["P1", "P2", "P3", "P4"];
const locatieOpties = ["Tilburg", "Breda", "Den Bosch", "Roosendaal"];

export function ModulesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState<string[]>([]);
  const [selectedLocatie, setSelectedLocatie] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedEC, setSelectedEC] = useState<number[]>([]);
  const [favoriteModules, setFavoriteModules] = useState<string[]>([]);

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

  const handleFilterToggle = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
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
  };

  const toggleFavorite = (moduleId: string) => {
    setFavoriteModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Bepaal periode uit startDate
  const getPeriodeFromDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const m = d.getMonth(); // 0-11
    if (m === 8 || m === 9 || m === 10) return "P1"; // sep-nov
    if (m === 11 || m === 0 || m === 1) return "P2"; // dec-feb
    if (m === 2 || m === 3) return "P3"; // mrt-apr
    return "P4"; // mei-aug
  };

  // Afgeleide opties
  const levelOpties = useMemo(
    () => Array.from(new Set(mockModules.map((m) => m.level))).sort(),
    []
  );
  const ecOpties = useMemo(
    () =>
      Array.from(new Set(mockModules.map((m) => m.studiepunten))).sort(
        (a, b) => a - b
      ),
    []
  );

  // Verrijk modules met periode
  const modulesWithPeriode = useMemo(
    () =>
      mockModules.map((m) => ({
        ...m,
        periode: getPeriodeFromDate(m.startDate),
      })),
    []
  );

  // Filter modules
  const filteredModules = modulesWithPeriode.filter((module) => {
    const matchesSearch =
      searchQuery === "" ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPeriode =
      selectedPeriode.length === 0 || selectedPeriode.includes(module.periode);

    const matchesLocatie =
      selectedLocatie.length === 0 || selectedLocatie.includes(module.locatie);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center py-12 bg-white border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Keuzemodules</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Via keuzemodules krijg je de vrijheid om een deel van je opleiding
          zelf samen te stellen en kun je jezelf straks beter profileren op de
          arbeidsmarkt. Via deze pagina kun je zoeken en filteren op alle
          keuzemodules die Avans te bieden heeft.
        </p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar met filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="space-y-4">
              {/* Niveau filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFilter("level")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">Niveau</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFilters.level ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    openFilters.level
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
                    {levelOpties.map((lvl) => (
                      <label
                        key={lvl}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLevel.includes(lvl)}
                          onChange={() =>
                            handleFilterToggle(lvl, selectedLevel, setSelectedLevel)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              

              {/* Studiepunten filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFilter("studiepunten")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">Studiepunten (EC)</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFilters.studiepunten ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    openFilters.studiepunten
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
                    {ecOpties.map((ec) => (
                      <label
                        key={ec}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEC.includes(ec)}
                          onChange={() =>
                            setSelectedEC((prev) =>
                              prev.includes(ec)
                                ? prev.filter((e) => e !== ec)
                                : [...prev, ec]
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{ec} EC</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              

              {/* Periode filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFilter("periode")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">Periode</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFilters.periode ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    openFilters.periode
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
                    {periodeOpties.map((periode) => (
                      <label
                        key={periode}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPeriode.includes(periode)}
                          onChange={() =>
                            handleFilterToggle(
                              periode,
                              selectedPeriode,
                              setSelectedPeriode
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{periode}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Locatie filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFilter("locatie")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">Locatie</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFilters.locatie ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    openFilters.locatie
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
                    {locatieOpties.map((locatie) => (
                      <label
                        key={locatie}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocatie.includes(locatie)}
                          onChange={() =>
                            handleFilterToggle(
                              locatie,
                              selectedLocatie,
                              setSelectedLocatie
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{locatie}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Search bar */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Zoek op keuzemodule naam"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Zoeken
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Results info and favorites button */}
            <div className="flex gap-3 mb-6 justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredModules.length} {filteredModules.length === 1 ? "module" : "modules"} gevonden
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredModules.length === 0 ? "Geen resultaten met deze filters" : "Selecteer een module om meer te zien"}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                Toon favorieten ({favoriteModules.length})
              </button>
            </div>

            {/* Active filters display */}
            {(selectedPeriode.length > 0 || selectedLocatie.length > 0 || selectedLevel.length > 0 || selectedEC.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                
                {selectedPeriode.map((periode) => (
                  <div key={periode} className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                    {periode}
                    <button
                      onClick={() => setSelectedPeriode(selectedPeriode.filter((p) => p !== periode))}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Filter verwijderen"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedLocatie.map((locatie) => (
                  <div key={locatie} className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                    {locatie}
                    <button
                      onClick={() => setSelectedLocatie(selectedLocatie.filter((l) => l !== locatie))}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Filter verwijderen"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedLevel.map((lvl) => (
                  <div key={lvl} className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                    {lvl}
                    <button
                      onClick={() => setSelectedLevel(selectedLevel.filter((l) => l !== lvl))}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Filter verwijderen"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedEC.map((ec) => (
                  <div key={ec} className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                    {ec} EC
                    <button
                      onClick={() => setSelectedEC(selectedEC.filter((e) => e !== ec))}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Filter verwijderen"
                    >
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
                <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
                  <p className="text-gray-500">
                    Geen modules gevonden met de huidige filters.
                  </p>
                </div>
              ) : (
                filteredModules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex gap-5"
                  >
                    {/* Module afbeelding placeholder */}
                    <div className="w-36 h-28 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200">
                      <span className="text-gray-400 text-sm">Plaatje</span>
                    </div>

                    {/* Module info */}
                    <div className="flex-1 min-w-0">
                      {/* Tags */}
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {module.periode}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {module.studiepunten} Studiepunten
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          {module.level}
                        </span>
                      </div>

                      {/* Titel */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {module.title}
                      </h3>

                      {/* Beschrijving */}
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {module.description}
                      </p>
                    </div>

                    {/* Locatie en acties rechts */}
                    <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0 text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 21s7-4.5 7-11.5A7 7 0 005 9.5C5 16.5 12 21 12 21z"
                          />
                        </svg>
                        <span className="font-medium text-gray-700">{module.locatie}</span>
                      </div>

                      <div className="flex items-end gap-2">
                        <Link
                          to={`/modules/${module.id}`}
                          className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Meer info
                        </Link>
                        <button
                          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          type="button"
                        >
                          Aanmelden via Osiris
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 3h7v7m0-7L10 14"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5v14h14"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleFavorite(module.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            favoriteModules.includes(module.id)
                              ? "bg-red-50 text-red-500"
                              : "border border-red-500 text-red-500 hover:bg-red-50"
                          }`}
                          title={
                            favoriteModules.includes(module.id)
                              ? "Verwijder van favorieten"
                              : "Voeg toe aan favorieten"
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill={favoriteModules.includes(module.id) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
