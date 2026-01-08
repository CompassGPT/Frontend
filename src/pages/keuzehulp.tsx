import { useState, type KeyboardEvent } from "react";
import { usePrediction } from "../hooks/usePrediction";

// --- Types ---
type QuestionType = "text" | "select" | "multiselect";

interface Question {
  id: number;
  question: string;
  type: QuestionType;
  placeholder?: string;
  options?: string[]; // Made optional for text type
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Wat is de naam van je huidige studie?",
    type: "text",
    placeholder: "Typ je antwoord...",
  },
  {
    id: 2,
    question: "Uit hoeveel studiepunten wil je dat je VKM bestaat?",
    type: "multiselect",
    options: ["15", "30"],
  },
  {
    id: 3,
    question: "In welke periode wil je je VKM volgen?",
    type: "multiselect",
    options: ["P1", "P2" /* "P3", "P4" */],
  },
  {
    id: 4,
    question: "Heb je een locatievoorkeur voor je VKM?",
    type: "multiselect",
    options: ["Tilburg", "Breda", "Den Bosch", "Roosendaal"],
  },
  {
    id: 5,
    question: "Welke vaardigheden zou je graag willen ontwikkelen?",
    type: "multiselect",
    options: ["Onderzoek", "Samenwerken", "Creativiteit", "Leiderschap"],
  },
  {
    id: 6,
    question: "Welke onderwerpen spreken je aan?",
    type: "multiselect",
    options: ["Technologie", "Zorg", "Economie", "Onderwijs"],
  },
  {
    id: 7,
    question: "In het kort: Welke interesses spelen mee?",
    type: "text",
    placeholder: "Bijv. 'Software en AI'",
  },
  {
    id: 8,
    question: "Wat hoop je vooral te leren?",
    type: "text",
    placeholder: "Bijv. 'Beter ondernemen'",
  },
];

export function KeuzehulpPage() {
  const MAX_TEXT_CHARS = 200;
  const NONE_LABEL = "Geen van deze leerdoelen";

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

  const { predictions, isLoading, error, getPredictions } = usePrediction();

  // --- Helpers ---
  const currentQ = QUESTIONS[currentQuestion];
  const currentAnswer = answers[currentQ.id];
  const progress = (currentQuestion / (QUESTIONS.length - 1)) * 100;

  const updateAnswer = (val: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    if (charLimitError) setCharLimitError(false);
  };

  const toggleOption = (option: string) => {
    const selected = Array.isArray(currentAnswer) ? [...currentAnswer] : [];

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

    if (currentQ.type === "text" && typeof currentAnswer === "string") {
      if (currentAnswer.length > MAX_TEXT_CHARS) {
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
      setValidationError("Voer alstublieft je huidige studie in (minimaal 2 tekens)");
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

    await getPredictions(request);
  };

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
          <h2 className="text-2xl font-bold mb-8 dark:text-white">
            {currentQ.question}
          </h2>

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
                  value={String(currentAnswer)}
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

            {(currentQ.type === "select" ||
              currentQ.type === "multiselect") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options?.map((option) => {
                  const isSelected = Array.isArray(currentAnswer)
                    ? currentAnswer.includes(option)
                    : currentAnswer === option;

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        currentQ.type === "select"
                          ? updateAnswer(option)
                          : toggleOption(option)
                      }
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
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all">
              {currentQuestion === QUESTIONS.length - 1
                ? "Bekijk Resultaat"
                : "Volgende"}
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
        
                {/* Results logic remains the same... */}        {isLoading && (
          <div className="mt-12 text-center text-blue-600 dark:text-blue-400 font-semibold">
            Bezig met laden...
          </div>
        )}
        {error && (
          <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
              Fout bij het ophalen van aanbevelingen:
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">
              {error}
            </p>
          </div>
        )}
        {predictions &&
          predictions.predictions.length === 0 &&
          !isLoading &&
          !error && (
            <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                Geen modules gevonden
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Helaas hebben we geen modules gevonden die volledig voldoen aan
                jouw criteria. Probeer je voorkeuren aan te passen of neem
                contact op met een docent.
              </p>
            </div>
          )}
        {predictions && predictions.predictions.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
              Aanbevolen modules
            </h3>
            <div className="grid gap-4">
              {predictions.predictions.map((p) => (
                <div
                  key={p.module.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {p.module.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                        {p.module.shortdescription}
                      </p>
                    </div>
                    <div className="ml-6 text-right shrink-0">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {(p.score * 100).toFixed(0)}%
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Match
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
                    <span className="flex items-center gap-2">
                      📚 {p.module.studyCredits} pt
                    </span>
                    <span className="flex items-center gap-2">
                      📍 {p.module.location.map((l) => l.name).join(", ")}
                    </span>
                    <span className="flex items-center gap-2">
                      🎓 {p.module.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
