import { useState } from "react";

type Question =
  | {
      id: number;
      question: string;
      type: "text";
      placeholder?: string;
    }
  | {
      id: number;
      question: string;
      type: "select";
      options: string[];
    };

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Wat is de naam van je huidige studie?",
    type: "text",
    placeholder: "Typ je antwoord...",
  },
  {
    id: 2,
    question: "Hoeveel studiepunten wil je minimaal?",
    type: "select",
    options: ["15", "30", "Maakt niet uit"],
  },
  {
    id: 3,
    question: "Welke periode past het best voor je?",
    type: "select",
    options: ["P1", "P2", "P3", "P4"],
  },
  {
    id: 4,
    question: "Locatie voorkeur?",
    type: "select",
    options: ["Tilburg", "Breda", "Den Bosch", "Roosendaal"],
  },
];

export function KeuzehulpPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    new Array(QUESTIONS.length).fill(""),
  );

  const currentQ = QUESTIONS[currentQuestion];
  const progress =
    QUESTIONS.length <= 1
      ? 100
      : (currentQuestion / (QUESTIONS.length - 1)) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    // TODO: Send answers to backend or process them
    console.log("Answers:", answers);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pt-20 pb-12">
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Keuzehulp
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Heb je moeite met het kiezen van een keuzem module die goed bij jou
          past? Vrees niet! Keuzehulp is speciaal ontwikkeld om jou als student
          te helpen met het maken van deze keuze. Hieronder zie je je een
          vragenlijst met verschillende vragen over persoonlijke interesses.
          Keuzehulp neemt al je antwoorden op en werkt dit in een op maat
          gemaakte advies.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Voortgang
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentQuestion + 1}/{QUESTIONS.length }
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-colors">
          {/* Question Number */}
          <div className="mb-6">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {String(currentQuestion + 1).padStart(2, "0")}/
              {String(QUESTIONS.length).padStart(2, "0")}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {currentQ.question}
          </h2>

          {/* Input Field */}
          <div className="mb-12">
            {currentQ.type === "text" && (
              <input
                type="text"
                value={answers[currentQuestion]}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQ.placeholder}
                autoFocus
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 transition-colors"
              />
            )}

            {currentQ.type === "select" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
                      answers[currentQuestion] === option
                        ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Vorige
            </button>

            <button
              onClick={
                currentQuestion === QUESTIONS.length - 1
                  ? handleComplete
                  : handleNext
              }
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              {currentQuestion === QUESTIONS.length - 1
                ? "Voltooien"
                : "Volgende"}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 Tip: Antwoord eerlijk op alle vragen voor de beste aanbevelingen
          </p>
        </div>
      </div>
    </div>
  );
}
