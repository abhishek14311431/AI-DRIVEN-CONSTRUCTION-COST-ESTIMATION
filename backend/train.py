from __future__ import annotations

import argparse
import logging
import os
from pathlib import Path
from typing import List, Tuple

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split

from features import prepare_features


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


def load_dataset(csv_path: Path) -> pd.DataFrame:
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV file not found: {csv_path}")
    return pd.read_csv(csv_path)


def build_feature_matrix(df: pd.DataFrame) -> Tuple[List[List[float]], List[float]]:
    X: List[List[float]] = []
    y: List[float] = []

    required_target = "cost_adjustment"
    if required_target not in df.columns:
        raise ValueError(f"CSV must contain target column '{required_target}'")

    for _, row in df.iterrows():
        row_dict = row.to_dict()
        try:
            features = prepare_features(row_dict)
        except Exception as exc:
            logger.warning("Skipping row due to feature preparation error: %s", exc)
            continue

        try:
            target = float(row_dict[required_target])
        except Exception:
            logger.warning("Skipping row due to invalid target value: %s", row_dict.get(required_target))
            continue

        X.append(features)
        y.append(target)

    if not X:
        raise ValueError("No valid rows found to build feature matrix")

    return X, y


def train_and_save_model(
    X: List[List[float]],
    y: List[float],
    output_path: Path,
    n_estimators: int = 100,
    test_size: float = 0.2,
    random_state: int = 42,
) -> None:
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    model = RandomForestRegressor(n_estimators=n_estimators, random_state=random_state)
    model.fit(X_train, y_train)

    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)

    train_r2 = r2_score(y_train, y_train_pred)
    test_r2 = r2_score(y_test, y_test_pred)

    logger.info("Training R2: %.4f", train_r2)
    logger.info("Testing R2:  %.4f", test_r2)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output_path)
    logger.info("Model saved to %s", output_path)


def main() -> None:
    parser = argparse.ArgumentParser(description="Train RandomForestRegressor for cost adjustment")
    parser.add_argument("--csv", required=True, help="Path to input CSV dataset")
    parser.add_argument(
        "--output",
        default=str(Path(__file__).resolve().parent / "saved_models" / "cost_regressor.pkl"),
        help="Path to save trained model",
    )
    parser.add_argument("--n-estimators", type=int, default=100)
    parser.add_argument("--test-size", type=float, default=0.2)

    args = parser.parse_args()

    csv_path = Path(args.csv)
    output_path = Path(args.output)

    try:
        df = load_dataset(csv_path)
        X, y = build_feature_matrix(df)
        train_and_save_model(
            X, y, output_path, n_estimators=args.n_estimators, test_size=args.test_size
        )
    except Exception as exc:
        logger.error("Training failed: %s", exc)
        raise


if __name__ == "__main__":
    main()
