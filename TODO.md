# TODO: Fix Upgrade Pricing Calculation Logic

## Task: Fix the upgrade pricing calculation logic to correctly calculate final cost based on selected tier.

### Steps:
- [ ] 1. Fix `backend/engines/breakdown_engine.py` - Implement proper tier multiplier logic
- [ ] 2. Fix `backend/main.py` - Read actual selected_tier from payload
- [ ] 3. Fix `frontend/src/components/EstimateScreen.jsx` - Send correct selected tier

### Expected Behavior:
- Base Project Cost: ₹65,18,616
- Classic Upgrade (+15%): +₹11,73,351
- Final Cost: ₹76,91,967
- Base cost must remain constant and visible
- Upgrade cost = Base Cost × (Tier Multiplier - 1)
