import { useState } from "react";
import { useBackend, BackendError } from "./useBackend";
import type { PredictionRequest, PredictionResponse } from "../types/api.types";

/**
 * Hook for getting AI-powered module predictions
 */
export function usePrediction() {
  const backend = useBackend();
  const [predictions, setPredictions] = useState<PredictionResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get module predictions based on student preferences
   */
  const getPredictions = async (
    request: PredictionRequest
  ): Promise<PredictionResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await backend.post<PredictionResponse>(
        "/api/ai/predict",
        request
      );

      setPredictions(response);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof BackendError ? err.message : "Failed to get predictions";
      setError(errorMessage);
      console.error("Prediction error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear predictions and reset state
   */
  const clearPredictions = () => {
    setPredictions(null);
    setError(null);
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  return {
    predictions,
    isLoading,
    error,
    getPredictions,
    clearPredictions,
    clearError,
  };
}
