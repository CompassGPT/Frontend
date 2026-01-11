import { useEffect, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { usePrediction } from "../hooks/usePrediction";
import { useBackend } from "../hooks/useBackend";

// --- Types ---
type QuestionType = "text" | "textarea" | "select" | "multiselect";

interface BaseQuestion {
  id: number;
  question: string;
  type: QuestionType;
  helperText?: string;
}

interface TextQuestion extends BaseQuestion {
  type: "text";
  placeholder?: string;
}

interface TextAreaQuestion extends BaseQuestion {
  type: "textarea";
  placeholder?: string;
}

interface SelectQuestion extends BaseQuestion {
  type: "select";
  options:
    | string[]
    | ((answers: Record<number, string | string[]>) => string[]);
}

interface MultiselectQuestion extends BaseQuestion {
  type: "multiselect";
  options:
    | string[]
    | ((answers: Record<number, string | string[]>) => string[]);
}

type Question =
  | TextQuestion
  | TextAreaQuestion
  | SelectQuestion
  | MultiselectQuestion;

const NONE_LABEL = "Geen van deze leerdoelen";

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Wat is de naam van je huidige studie?",
    type: "text",
    placeholder:
      "Bijvoorbeeld: Informatica, Verpleegkunde, Commerciële Economie...",
    helperText:
      "Dit helpt ons om modules te vinden die goed aansluiten bij jouw achtergrond",
  },
  {
    id: 2,
    question: "Hoeveel studiepunten wil je behalen met je VKM?",
    type: "multiselect",
    options: ["15", "30"],
    helperText: "Je kunt meerdere opties selecteren als je flexibel bent",
  },
  {
    id: 3,
    question: "In welke periode(s) wil je je VKM volgen?",
    type: "multiselect",
    // "P3" en "P4" zijn (nog) niet beschikbaar in het aanbod en blijven daarom uitgeschakeld.
    options: ["P1", "P2" /* "P3", "P4" */],
    helperText: "Selecteer alle periodes waarin je beschikbaar bent",
  },
  {
    id: 4,
    question: "Op welke locatie(s) kun je de module volgen?",
    type: "multiselect",
    options: ["Tilburg", "Breda", "Den Bosch", "Roosendaal"],
    helperText: "Meerdere locaties selecteren geeft je meer keuzemogelijkheden",
  },
  {
    id: 5,
    question: "Welke vaardigheden wil je ontwikkelen tijdens je VKM?",
    type: "multiselect",
    options: (_answers) => {
      return [
        "Onderzoek",
        "Samenwerken",
        "Creativiteit",
        "Leiderschap",
        NONE_LABEL,
      ];
    },
    helperText: "Deze vaardigheden helpen ons om passende modules te vinden",
  },
  {
    id: 6,
    question: "Welke onderwerpen interesseren je?",
    type: "multiselect",
    options: (_answers) => {
      return ["Technologie", "Zorg", "Economie", "Onderwijs"];
    },
    helperText: "Selecteer alle gebieden waar je meer over wilt leren",
  },
  {
    id: 7,
    question: "Beschrijf je interesses en wat je graag wilt leren",
    type: "textarea",
    placeholder:
      "Beschrijf zo uitgebreid mogelijk wat je interesseert. Bijvoorbeeld:\n\n• Ik ben geïnteresseerd in kunstmatige intelligentie en machine learning\n• Graag wil ik meer leren over duurzaamheid en milieuvraagstukken\n• Ik vind het leuk om met data te werken en inzichten te ontdekken\n\nHoe meer details je geeft, hoe beter we kunnen zoeken!",
    helperText:
      "💡 Tip: Hoe meer details je geeft, hoe beter we passende modules kunnen vinden. Schrijf gerust een paar zinnen!",
  },
  {
    id: 8,
    question: "Wat zijn je leerdoelen en wat wil je bereiken?",
    type: "textarea",
    placeholder:
      "Vertel ons wat je wilt bereiken met deze module. Bijvoorbeeld:\n\n• Ik wil leren hoe ik effectiever kan presenteren\n• Graag wil ik mijn kennis van projectmanagement verdiepen\n• Ik zoek een module waar ik praktijkervaring opdoe met echte klanten\n• Ik wil leren ondernemen en een eigen bedrijf starten\n\nDenk aan concrete vaardigheden, kennis of ervaring!",
    helperText:
      "💡 Tip: Wees specifiek over wat je wilt leren en bereiken. Dit helpt ons de beste match te vinden!",
  },
];

export function KeuzehulpPage() {
  const MAX_TEXT_CHARS = 200;
  const MAX_TEXTAREA_CHARS = 500;

  const navigate = useNavigate();

  // --- State ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>(
    () =>
      Object.fromEntries(
        QUESTIONS.map((q) => [q.id, q.type === "multiselect" ? [] : ""])
      )
  );
  const [charLimitError, setCharLimitError] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [savePreferencesError, setSavePreferencesError] = useState<
    string | null
  >(null);

  const { predictions, isLoading, error, getPredictions } = usePrediction();
  const backend = useBackend();

  useEffect(() => {
    if (!showResults || !predictions || predictions.predictions.length === 0) {
      return;
    }

    setSelectedModuleIds(predictions.predictions.map((p) => p.module.id));
  }, [showResults, predictions]);

  const selectModule = (moduleId: number) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );
  };

  const unselectModule = (moduleId: number) => {
    setSelectedModuleIds((prev) => prev.filter((id) => id !== moduleId));
  };

  const handleSubmitPreferences = async () => {
    if (isSavingPreferences) return;

    setIsSavingPreferences(true);
    setSavePreferencesError(null);

    try {
      // Build array of modules with their motivations
      const modules = selectedModuleIds
        .map((moduleId) => {
          const prediction = predictions?.predictions.find(
            (p) => p.module.id === moduleId
          );
          return {
            moduleId,
            motivation: prediction?.motivation || "",
          };
        })
        .filter((m) => typeof m.moduleId === "number" && m.moduleId > 0);

      await backend.post("/user/recommended", {
        modules,
      });
      navigate("/profile");
    } catch (e) {
      console.error("Failed to save recommendations:", e);
      setSavePreferencesError(
        e instanceof Error ? e.message : "Opslaan mislukt. Probeer opnieuw."
      );
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // --- Helpers ---
  const getTextAnswer = (answer: string | string[]): string => {
    return Array.isArray(answer) ? "" : answer;
  };

  const getArrayAnswer = (answer: string | string[]): string[] => {
    return Array.isArray(answer) ? answer : [];
  };

  const getOptions = (
    question: SelectQuestion | MultiselectQuestion
  ): string[] => {
    if (Array.isArray(question.options)) {
      return question.options;
    }
    return question.options(answers);
  };
  const currentQ = QUESTIONS[currentQuestion];
  const currentAnswer = answers[currentQ.id];
  const progress = (currentQuestion / (QUESTIONS.length - 1)) * 100;

  const updateAnswer = (val: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    if (charLimitError) setCharLimitError(false);
  };

  const toggleOption = (option: string) => {
    const selected = getArrayAnswer(currentAnswer);

    if (option === NONE_LABEL) {
      updateAnswer(selected.includes(NONE_LABEL) ? [] : [NONE_LABEL]);
      return;
    }

    const filtered = selected.filter((item) => item !== NONE_LABEL);
    const nextValue = filtered.includes(option)
      ? filtered.filter((item) => item !== option)
      : [...filtered, option];

    updateAnswer(nextValue);
  };

  // --- Navigation ---
  const handleNext = () => {
    // Clear any previous validation errors
    setValidationError(null);

    if (
      (currentQ.type === "text" || currentQ.type === "textarea") &&
      typeof currentAnswer === "string"
    ) {
      const maxChars =
        currentQ.type === "textarea"
          ? currentQ.id === 8
            ? MAX_TEXT_CHARS
            : MAX_TEXTAREA_CHARS
          : MAX_TEXT_CHARS;
      if (currentAnswer.length > maxChars) {
        setCharLimitError(true);
        return;
      }
    }
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && currentQ.type === "text") handleNext();
  };

  const handleComplete = async () => {
    // Clear any previous validation errors
    setValidationError(null);
    // Transform answers for API
    const getValues = (id: number) => answers[id];

    // Character-limit validation (Q8 leerdoelen uses same 200 char limit as Q1)
    const q8Raw = getValues(8);
    const q8Text = typeof q8Raw === "string" ? q8Raw : "";
    if (q8Text.length > MAX_TEXT_CHARS) {
      setCharLimitError(true);
      setValidationError("Leerdoelen mag maximaal 200 tekens bevatten");
      return;
    }

    // Validate required fields
    const currentStudy = String(getValues(1)).trim();
    const locationPrefs = Array.isArray(getValues(4))
      ? (getValues(4) as string[])
      : [];
    const periodPrefs = Array.isArray(getValues(3))
      ? (getValues(3) as string[])
      : [];
    const interests = Array.isArray(getValues(6))
      ? (getValues(6) as string[])
      : [];

    const learningGoalsArray: string[] = [];
    const q5Values = getValues(5);
    if (Array.isArray(q5Values)) {
      learningGoalsArray.push(...q5Values);
    }
    const q8Value = getValues(8);
    if (typeof q8Value === "string" && q8Value.trim()) {
      learningGoalsArray.push(q8Value);
    }

    // Validate minimum requirements
    if (currentStudy.length < 2) {
      setValidationError(
        "Voer alstublieft je huidige studie in (minimaal 2 tekens)"
      );
      return;
    }
    if (locationPrefs.length === 0) {
      setValidationError("Selecteer alstublieft minstens één locatievoorkeur");
      return;
    }
    if (learningGoalsArray.length === 0) {
      setValidationError("Voer alstublieft minstens één leerdoel in");
      return;
    }
    if (periodPrefs.length === 0) {
      setValidationError("Selecteer alstublieft minstens één periode");
      return;
    }
    if (interests.length === 0) {
      setValidationError("Selecteer alstublieft minstens één onderwerp");
      return;
    }

    const creditValues = getValues(2) as string[];
    if (creditValues.length === 0) {
      setValidationError(
        "Selecteer alstublieft minstens één studiepunten optie (15 of 30)"
      );
      return;
    }

    const has15 = creditValues.includes("15");
    const has30 = creditValues.includes("30");

    let creditRange: [number, number];
    if (has15 && has30) {
      creditRange = [15, 30];
    } else if (has30) {
      creditRange = [30, 30];
    } else {
      creditRange = [15, 15];
    }

    // Map credit selection to NLQF levels
    const levelPreference: string[] = [];
    if (has15) levelPreference.push("NLQF5");
    if (has30) levelPreference.push("NLQF6");

    // Debug log to verify data before sending
    console.log("Sending prediction request:", {
      currentStudy,
      interests,
      wantedStudyCreditRange: creditRange,
      locationPreference: locationPrefs,
      learningGoals: learningGoalsArray.filter((g) => g.trim()),
      levelPreference,
      preferredLanguage: "Nederlands",
      preferredPeriod: periodPrefs,
    });

    const request = {
      currentStudy,
      interests,
      wantedStudyCreditRange: creditRange,
      locationPreference: locationPrefs,
      learningGoals: learningGoalsArray.filter((g) => g.trim()),
      levelPreference,
      preferredLanguage: "Nederlands",
      preferredPeriod: periodPrefs,
    };

    setIsSubmitting(true);
    try {
      await getPredictions(request);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToQuestions = () => {
    setShowResults(false);
    setCurrentQuestion(0);
  };

  // If showing results, render results page
  if (showResults && predictions) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <div className="text-center py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
          <div className="container mx-auto px-4">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold rounded-full">
                Jouw Persoonlijke Aanbevelingen
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {predictions.predictions.length > 0
                ? `${predictions.predictions.length} Aanbevolen ${predictions.predictions.length === 1 ? "Module" : "Modules"}`
                : "Geen modules gevonden"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {predictions.predictions.length > 0
                ? "Op basis van jouw voorkeuren hebben we de beste matches geselecteerd. Lees hier kort over de modules en leg alvast vast of deze modules interessant lijken door het geven van een kruisje of vinkje!"
                : "Probeer je voorkeuren aan te passen of neem contact op met een studieadviseur"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Results Cards */}
          {predictions.predictions.length > 0 ? (
            <div className="space-y-4 mb-8">
              {predictions.predictions.map((p) =>
                (() => {
                  const isSelected = selectedModuleIds.includes(p.module.id);

                  return (
                    <div
                      key={p.module.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Match Score - Left side */}
                        <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                          <div className="bg-blue-600 text-white rounded-lg px-4 py-3 text-center min-w-20">
                            <div className="text-3xl font-bold">
                              {(p.score * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs opacity-90 mt-1">Match</div>
                          </div>
                        </div>

                        {/* Module Info */}
                        <div className="flex-1 min-w-0">
                          {/* Tags */}
                          <div className="flex gap-2 mb-3 flex-wrap">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                              {p.module.studyCredits} Studiepunten
                            </span>
                            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                              {p.module.level}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {p.module.name}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                            {p.module.shortdescription}
                          </p>

                          {/* Motivation */}
                          {p.motivation && (
                            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                              <p className="text-sm text-blue-900 dark:text-blue-200">
                                <span className="font-semibold">💡 Waarom deze module: </span>
                                {p.motivation}
                              </p>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>
                                {p.module.location
                                  .map((l) => l.name)
                                  .join(", ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {new Date(
                                  p.module.startDate
                                ).toLocaleDateString("nl-NL", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button - Right side */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-gray-700">
                          <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <button
                              type="button"
                              onClick={() => unselectModule(p.module.id)}
                              aria-pressed={!isSelected}
                              aria-label="Module afwijzen"
                              className={`h-10 w-10 grid place-items-center font-bold transition-colors ${
                                !isSelected
                                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}>
                              ✕
                            </button>
                            <button
                              type="button"
                              onClick={() => selectModule(p.module.id)}
                              aria-pressed={isSelected}
                              aria-label="Module selecteren"
                              className={`h-10 w-10 grid place-items-center font-bold transition-colors ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}>
                              ✓
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Geen modules gevonden
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Helaas hebben we geen modules gevonden die volledig voldoen aan
                jouw criteria. Probeer je voorkeuren aan te passen of neem
                contact op met een studieadviseur.
              </p>
              <button
                onClick={handleReturnToQuestions}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Opnieuw Proberen
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {predictions.predictions.length > 0 && (
            <div className="pt-4">
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleReturnToQuestions}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  ← Opnieuw Starten
                </button>
                <button
                  type="button"
                  onClick={handleSubmitPreferences}
                  disabled={isSavingPreferences}
                  className={`px-6 py-3 font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
                    isSavingPreferences
                      ? "bg-blue-400 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                  {isSavingPreferences && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {isSavingPreferences
                    ? "Opslaan..."
                    : "Geselecteerde aanbevelingen opslaan"}
                </button>
              </div>

              {savePreferencesError && (
                <div className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
                  {savePreferencesError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If loading, show loading state
  if (isLoading && showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Zoeken naar modules...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We zoeken de beste matches voor jou
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Regular questionnaire view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Keuzehulp</h1>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mt-8">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <p className="text-blue-600 font-bold text-sm mb-2 uppercase tracking-wider">
            Vraag {currentQuestion + 1} van {QUESTIONS.length}
          </p>
          <h2 className="text-2xl font-bold mb-3 dark:text-white">
            {currentQ.question}
          </h2>
          {currentQ.helperText && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {currentQ.helperText}
            </p>
          )}

          <div className="min-h-50">
            {currentQ.type === "text" && (
              <div className="space-y-2">
                <input
                  type="text"
                  autoFocus
                  className={`w-full p-4 rounded-xl border-2 transition-all outline-none bg-transparent dark:text-white ${
                    charLimitError
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                  }`}
                  placeholder={currentQ.placeholder}
                  value={getTextAnswer(currentAnswer)}
                  onChange={(e) => updateAnswer(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <div className="flex justify-between text-xs">
                  <span
                    className={
                      charLimitError ? "text-red-500" : "text-gray-400"
                    }>
                    {String(currentAnswer).length} / {MAX_TEXT_CHARS} tekens
                  </span>
                </div>
              </div>
            )}

            {currentQ.type === "textarea" && (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  rows={8}
                  className={`w-full p-4 rounded-xl border-2 transition-all outline-none bg-transparent dark:text-white resize-none ${
                    charLimitError
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                  }`}
                  placeholder={currentQ.placeholder}
                  value={getTextAnswer(currentAnswer)}
                  onChange={(e) => updateAnswer(e.target.value)}
                />
                <div className="flex justify-between text-xs gap-2">
                  <span
                    className={
                      charLimitError ? "text-red-500" : "text-gray-400"
                    }>
                    {String(currentAnswer).length} /{" "}
                    {currentQ.id === 8 ? MAX_TEXT_CHARS : MAX_TEXTAREA_CHARS}{" "}
                    tekens
                  </span>
                  <span className="text-gray-400">
                    {String(currentAnswer).length < 100
                      ? "💡 Meer details = betere aanbevelingen"
                      : String(currentAnswer).length < 200
                        ? "👍 Goed bezig!"
                        : "✨ Uitstekend!"}
                  </span>
                </div>
              </div>
            )}

            {(currentQ.type === "select" ||
              currentQ.type === "multiselect") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getOptions(currentQ).map((option) => {
                  const selectedOptions = getArrayAnswer(currentAnswer);
                  const isSelected = selectedOptions.includes(option);

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        currentQ.type === "select"
                          ? updateAnswer(option)
                          : toggleOption(option)
                      }
                      aria-pressed={isSelected}
                      className={`p-4 rounded-xl border-2 font-medium transition-all text-left ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:text-gray-300"
                      }`}>
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-8 border-t dark:border-gray-700">
            <button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
              className="px-8 py-3 rounded-xl font-semibold text-gray-500 disabled:opacity-0 transition-opacity">
              Vorige
            </button>
            <button
              onClick={
                currentQuestion === QUESTIONS.length - 1
                  ? handleComplete
                  : handleNext
              }
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all">
              {currentQuestion === QUESTIONS.length - 1 ? (
                <span className="inline-flex items-center gap-2">
                  {isSubmitting && (
                    <span
                      className="inline-block h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  <span>
                    {isSubmitting ? "Ophalen..." : "Bekijk Resultaat"}
                  </span>
                </span>
              ) : (
                "Volgende"
              )}
            </button>
          </div>
        </div>
        {/* Validation Error Display */}
        {validationError && (
          <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
              Validatie Fout:
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">
              {validationError}
            </p>
          </div>
        )}
        {/* Error Display */}
        {error && !showResults && (
          <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
              Fout bij het ophalen van aanbevelingen:
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
