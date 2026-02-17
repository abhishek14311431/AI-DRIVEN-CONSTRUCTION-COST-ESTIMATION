from __future__ import annotations

import argparse
import logging
from pathlib import Path
from typing import List, Tuple

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from features import prepare_features


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


def load_dataset(csv_path: Path) -> pd.DataFrame:
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV file not found: {csv_path}")
    return pd.read_csv(csv_path)


def build_feature_matrix(df: pd.DataFrame, target_col: str = "recommended_tier") -> Tuple[List[List[float]], List[str]]:
    X: List[List[float]] = []
    y: List[str] = []

    if target_col not in df.columns:
        raise ValueError(f"CSV must contain target column '{target_col}'")

    for _, row in df.iterrows():
        row_dict = row.to_dict()
        try:
            features = prepare_features(row_dict)
        except Exception as exc:
            logger.debug("Skipping row due to feature preparation error: %s", exc)
            continue

        label = row_dict.get(target_col)
        if label is None or (isinstance(label, float) and pd.isna(label)):
            logger.debug("Skipping row due to missing target: %s", label)
            continue

        X.append(features)
        y.append(str(label))

    if not X:
        raise ValueError("No valid rows found to build feature matrix")

    return X, y


def train_and_save_classifier(
    X: List[List[float]],
    y_text: List[str],
    output_path: Path,
    n_estimators: int = 100,
    test_size: float = 0.2,
    random_state: int = 42,
) -> None:
    le = LabelEncoder()
    y = le.fit_transform(y_text)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    clf = RandomForestClassifier(n_estimators=n_estimators, random_state=random_state)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    logger.info("Classifier accuracy (test): %.4f", acc)

    output_dir = output_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    joblib.dump(clf, output_path)
    le_path = output_dir / "tier_label_encoder.pkl"
    joblib.dump(le, le_path)

    logger.info("Classifier saved to %s", output_path)
    logger.info("Label encoder saved to %s", le_path)


def main() -> None:
    parser = argparse.ArgumentParser(description="Train RandomForestClassifier for tier recommendation")
    parser.add_argument("--csv", required=True, help="Path to input CSV dataset")
    parser.add_argument(
        "--output",
        default=str(Path(__file__).resolve().parent / "saved_models" / "tier_classifier.pkl"),
        help="Path to save trained classifier",
    )
    parser.add_argument("--n-estimators", type=int, default=100)
    parser.add_argument("--test-size", type=float, default=0.2)

    args = parser.parse_args()

    csv_path = Path(args.csv)
    output_path = Path(args.output)

    try:
        df = load_dataset(csv_path)
        X, y_text = build_feature_matrix(df, target_col="recommended_tier")
        train_and_save_classifier(
            X, y_text, output_path, n_estimators=args.n_estimators, test_size=args.test_size
        )
    except Exception as exc:
        logger.error("Training failed: %s", exc)
        raise


if __name__ == "__main__":
    main()
