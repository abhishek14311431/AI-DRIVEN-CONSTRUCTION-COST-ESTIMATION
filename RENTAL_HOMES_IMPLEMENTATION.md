# Rental Homes Implementation Guide

## Overview
This document describes the comprehensive rental homes flow implemented in the AI-Driven Construction Cost Estimation platform.

## User Flow

### 1. Project Type Selection
User selects **Rental Homes** from the project type options.

### 2. Site Type Selection
Three site types are available:

- **Half Site** - Single Bedroom Units
- **Full Site** - Double Bedroom Units  
- **Double Site** - Multiple Bedroom Units

### 3. Plot Dimensions

#### Half Site Dimensions:
- 20 × 30 (600 sq ft) - ₹22 Lakhs (G+1)
- 20 × 40 (800 sq ft) - ₹24 Lakhs (G+1)
- 25 × 40 (1000 sq ft) - ₹26 Lakhs (G+1)
- 30 × 30 (900 sq ft) - ₹25 Lakhs (G+1)

#### Full Site Dimensions:
- 30 × 40 (1200 sq ft) - ₹30 Lakhs (G+1)
- 30 × 50 (1500 sq ft) - ₹34 Lakhs (G+1)
- 40 × 40 (1600 sq ft) - ₹36 Lakhs (G+1)
- 40 × 50 (2000 sq ft) - ₹40 Lakhs (G+1)

#### Double Site Dimensions:
- 40 × 60 (2400 sq ft) - ₹48 Lakhs (G+1)
- 50 × 80 (4000 sq ft) - ₹65 Lakhs (G+1)
- 60 × 80 (4800 sq ft) - ₹72 Lakhs (G+1)
- 60 × 100 (6000 sq ft) - ₹85 Lakhs (G+1)

### 4. Floor Options

- **G+1** (as per base cost above)
- **G+2** (Base cost + ~38% increase)
- **G+3** (Base cost + ~75% increase)
- **Custom** (G+3 cost + ₹7.5-18L per extra floor based on site type)

### 5. Unit Type (Automatic Assignment)

Unit types are automatically determined by site type:

- **Half Site** → Single Bedroom (1 bed, 1 bath)
- **Full Site** → Double Bedroom (2 beds, 2 baths)
- **Double Site** → Multiple Bedroom (3 beds, 2 baths)

### 6. Staircase Type

All rental homes use **External Staircase** for independent tenant access.

### 7. Rental Plan Levels

Three plan levels with cost multipliers:

- **Base** (1.0x) - Standard Quality
  - Basic vitrified flooring
  - Standard bathroom tiles
  - Basic paint finish
  - Standard electrical fittings
  
- **Classic** (1.1x) - Enhanced Quality
  - Better quality flooring
  - Improved bathroom fittings
  - Enhanced paint finish
  - Better electrical fittings
  - Improved exterior finish
  
- **Premium** (1.2x) - Premium Quality
  - Premium flooring options
  - High-quality bathroom fittings
  - Premium paint finish
  - Premium electrical fittings
  - Designer exterior finish

### 8. Semi-Interior Finishing

All rental homes include semi-interior finishing (no luxury features):

**Included:**
- Basic vitrified or ceramic flooring
- Standard bathroom tiles
- Basic paint
- Basic electrical fittings
- External staircase

**Excluded:**
- Italian marble
- Designer elevation
- Smart home automation
- Premium interiors

## Cost Breakdown

The rental homes use a simplified 11-component breakdown:

1. **Excavation & Foundation** (12%)
2. **RCC Structure** (25%)
3. **Brickwork** (10%)
4. **Plastering** (8%)
5. **Flooring** (10%)
6. **Plumbing** (8%)
7. **Electrical** (7%)
8. **Bathrooms** (8%)
9. **Staircase** (5%)
10. **Exterior Finish** (4%)
11. **Terrace Waterproofing** (3%)

All components are sorted by cost in descending order in the output.

## Backend Implementation

### Files Modified:

1. **app/core/constants.py**
   - Added `RENTAL_SITE_TYPES` dictionary with all site configurations
   - Added `RENTAL_FLOOR_COSTS` with base costs for each site type and floor option
   - Added `RENTAL_EXTRA_FLOOR_COST` for custom floor calculations
   - Added `RENTAL_PLAN_MULTIPLIERS` for Base/Classic/Premium levels
   - Added `RENTAL_BREAKDOWN_RATIOS` for the simplified 11-component breakdown

2. **app/schemas/rental_schema.py**
   - Updated `RentalCreate` schema with new fields:
     - `site_type`: Half Site / Full Site / Double Site
     - `dimensions`: Plot dimensions
     - `floor`: G+1 / G+2 / G+3 / Custom
     - `custom_floors`: Number for custom floor selection
     - `plan`: Base / Classic / Premium
   - Updated `RentalResponse` schema with comprehensive output fields

3. **app/engines/rental_engine.py**
   - Completely rewritten estimation logic
   - Validates site type and dimensions
   - Calculates base cost from floor costs
   - Handles custom floor calculation (G+3 + extra floors)
   - Applies plan multiplier
   - Applies zone multiplier
   - Generates sorted breakdown
   - Returns comprehensive rental estimation data

## Frontend Implementation

### Files Modified:

1. **frontend/src/constants/projectConfigs.js**
   - Replaced rental configuration with comprehensive 6-step flow:
     - Site Type Selection
     - Plot Dimensions (dynamic based on site type)
     - Floor Selection (including custom option)
     - Plan Selection (with features list)
     - Review Rental Plan
     - Cost Estimation

2. **frontend/src/pages/ProjectWizard.jsx**
   - Added `dimension-selection` handler for dynamic dimension options
   - Added `plan-selection` handler for rental plan levels
   - Added `review-rental` handler for rental-specific review page
   - Enhanced default handler to support custom input fields for Custom floor option

## API Response Format

```json
{
  "project_type": "Rental Homes",
  "site_type": "Half Site",
  "dimensions": "20x40",
  "floor": "G+3",
  "unit_type": "Single Bedroom",
  "bedrooms": 1,
  "bathrooms": 1,
  "plan": "Base",
  "staircase_type": "External Staircase",
  "total_cost": 3850000,
  "breakdown": [
    {
      "component": "RCC Structure",
      "cost": 962500,
      "percentage": 25.0
    },
    {
      "component": "Excavation & Foundation",
      "cost": 462000,
      "percentage": 12.0
    },
    ...
  ]
}
```

## Design Principles

The rental homes module prioritizes:

1. **Simplicity** - Straightforward flow with automated decisions
2. **Repeated Units** - Support for identical floor layouts
3. **Lower Interior Cost** - Semi-interior finishing only
4. **Faster Construction** - Simplified specifications
5. **ROI Focus** - Investment property optimization

## Testing

To test the rental homes flow:

1. Start the backend server: `uvicorn app.main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to the application
4. Select "Rental Homes" from project types
5. Follow the complete flow through all steps
6. Verify the cost estimation and breakdown

### Sample API Test (using curl):

```bash
curl -X POST "http://localhost:8000/api/v1/rental/estimate" \
  -H "Content-Type: application/json" \
  -d '{
    "site_type": "Half Site",
    "dimensions": "20x40",
    "floor": "G+3",
    "plan": "Base",
    "zone": "C"
  }'
```

### Sample Custom Floor Test:

```bash
curl -X POST "http://localhost:8000/api/v1/rental/estimate" \
  -H "Content-Type: application/json" \
  -d '{
    "site_type": "Full Site",
    "dimensions": "30x40",
    "floor": "Custom",
    "custom_floors": 5,
    "plan": "Premium",
    "zone": "B"
  }'
```

## Future Enhancements

Potential improvements for rental homes:

1. Add ROI calculator based on rental rates
2. Support for mixed unit types (e.g., 1BHK + 2BHK on same property)
3. Commercial rental options
4. Parking space estimation
5. Property management cost estimation
6. Rental yield projections
7. Location-based rental rate suggestions

## Support

For issues or questions regarding the rental homes implementation, please contact the development team.

---

**Implementation Date:** March 2026  
**Version:** 1.0  
**Status:** Complete and Ready for Testing
