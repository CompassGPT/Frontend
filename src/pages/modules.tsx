import { useState } from "react";
import { Link } from "react-router";

// Mock data voor modules
const mockModules = [
  {
    id: "1",
    title: "Titel van module",
    description:
      "Beschrijving van module - bldsaldsa d saiodsa dsaiohf dsfdsiofds fdsijfds f fidshfds nfdshif sfjdsiohfjds fdsfdsifdsjhio fisdohf dsfhidsof bdsfjdsofhds fdsopifds fdsoipfjds fds dsadasdsadsadsa dsadsadsadsadsadsafnioefew fewofew bf dfsafdsfdspn fdsopinfds",
    periode: "P1",
    studiepunten: 3,
    taal: "Nederlands",
    locatie: "Tilburg",
    image: null,
  },
  {
    id: "2",
    title: "Web Development Advanced",
    description:
      "Leer geavanceerde webontwikkeling met moderne frameworks en tools. Deze module behandelt React, TypeScript, en backend development.",
    periode: "P2",
    studiepunten: 5,
    taal: "Engels",
    locatie: "Breda",
    image: null,
  },
  {
    id: "3",
    title: "Data Science Basics",
    description:
      "Introductie tot data science met Python. Leer data analyse, visualisatie en machine learning basics.",
    periode: "P1",
    studiepunten: 4,
    taal: "Nederlands",
    locatie: "Den Bosch",
    image: null,
  },
];

// Filter opties
const taalOpties = ["Engels", "Nederlands"];
const periodeOpties = ["P1", "P2", "P3", "P4"];
const locatieOpties = ["Tilburg", "Breda", "Den Bosch", "Roosendaal"];

export function ModulesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaal, setSelectedTaal] = useState<string[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string[]>([]);
  const [selectedLocatie, setSelectedLocatie] = useState<string[]>([]);

  // Filter open/dicht state
  const [openFilters, setOpenFilters] = useState({
    taal: true,
    periode: true,
    locatie: true,
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
    setSelectedTaal([]);
    setSelectedPeriode([]);
    setSelectedLocatie([]);
  };

  // Filter modules
  const filteredModules = mockModules.filter((module) => {
    const matchesSearch =
      searchQuery === "" ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTaal =
      selectedTaal.length === 0 || selectedTaal.includes(module.taal);

    const matchesPeriode =
      selectedPeriode.length === 0 || selectedPeriode.includes(module.periode);

    const matchesLocatie =
      selectedLocatie.length === 0 || selectedLocatie.includes(module.locatie);

    return matchesSearch && matchesTaal && matchesPeriode && matchesLocatie;
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
              {/* Taal filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFilter("taal")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">Taal</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFilters.taal ? "rotate-180" : ""
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
                    openFilters.taal
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-4 pb-4 space-y-2">
                    {taalOpties.map((taal) => (
                      <label
                        key={taal}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTaal.includes(taal)}
                          onChange={() =>
                            handleFilterToggle(taal, selectedTaal, setSelectedTaal)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{taal}</span>
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
                  <div className="px-4 pb-4 space-y-2">
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
                  <div className="px-4 pb-4 space-y-2">
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
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          {module.taal}
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

                    {/* Actie knop */}
                    <div className="flex items-end flex-shrink-0">
                      <Link
                        to={`/modules/${module.id}`}
                        className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Zie meer
                      </Link>
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
