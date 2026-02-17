from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import numpy as np

from features import prepare_features


MODEL_DIR = Path(__file__).resolve().parent / "saved_models"
TIER_DIRS = {
    "Basic": MODEL_DIR / "base",
    "Classic": MODEL_DIR / "classic",
    "Premium": MODEL_DIR / "premium",
    "Luxury": MODEL_DIR / "luxury",
}
REGRESSOR_PATH = MODEL_DIR / "cost_regressor.pkl"
CLASSIFIER_PATH = MODEL_DIR / "tier_classifier.pkl"
LABEL_ENCODER_PATH = MODEL_DIR / "tier_label_encoder.pkl"


_regressor: Any | None = None
_classifier: Any | None = None
_label_encoder: Any | None = None
_tier_regressors: dict[str, Any] = {}


def _load_regressor() -> Any:
    global _regressor
    if _regressor is None:
        if not REGRESSOR_PATH.exists():
            raise FileNotFoundError(f"Regressor model not found at: {REGRESSOR_PATH}")
        _regressor = joblib.load(REGRESSOR_PATH)
    return _regressor


def _load_classifier_and_encoder() -> tuple[Any, Any]:
    global _classifier, _label_encoder
    if _classifier is None:
        if not CLASSIFIER_PATH.exists():
            raise FileNotFoundError(f"Classifier model not found at: {CLASSIFIER_PATH}")
        _classifier = joblib.load(CLASSIFIER_PATH)
    if _label_encoder is None:
        if not LABEL_ENCODER_PATH.exists():
            raise FileNotFoundError(f"Label encoder not found at: {LABEL_ENCODER_PATH}")
        _label_encoder = joblib.load(LABEL_ENCODER_PATH)
    return _classifier, _label_encoder


def predict_adjustment(input_data: dict) -> float:
    """
    Predict the cost adjustment using the trained regressor.

    Args:
        input_data: Dictionary containing keys required by `prepare_features`.

    Returns:
        Predicted cost adjustment as a float.
    """
    model = _load_regressor()
    features = prepare_features(input_data)
    X = np.array(features, dtype=float).reshape(1, -1)
    pred = model.predict(X)
    return float(pred[0])


def predict_tier(input_data: dict) -> str:
    """
    Predict the recommended tier using the trained classifier.

    Args:
        input_data: Dictionary containing keys required by `prepare_features`.

    Returns:
        Predicted tier label as a string.
    """
    clf, le = _load_classifier_and_encoder()
    features = prepare_features(input_data)
    X = np.array(features, dtype=float).reshape(1, -1)
    pred_idx = clf.predict(X)
    label = le.inverse_transform(pred_idx)
    return str(label[0])
