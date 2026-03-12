export const projectConfigs = {
    own_house: {
        title: 'Dream House',
        subtitle: 'Luxury custom-designed residence',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
        theme: 'card-theme-yellow',
        steps: [
            {
                id: 'plot_dimensions',
                title: 'Plot & Dimensions',
                type: 'split-selection',
                leftSide: {
                    label: 'Select Plot Size',
                    field: 'plot_size',
                    options: [
                        { value: 'full', label: 'Full Site', desc: 'Standard Plot (30x40 / 30x50)' },
                        { value: 'double', label: 'Double Site', desc: 'Large Plot (60x40+)' }
                    ]
                },
                rightSide: {
                    label: 'Select Dimensions',
                    field: 'dimensions',
                    dependsOn: 'plot_size',
                    optionsByParent: {
                        full: [
                            { value: '30x40', label: '30 × 40', desc: '1200 sq ft' },
                            { value: '30x50', label: '30 × 50', desc: '1500 sq ft' },
                            { value: '40x40', label: '40 × 40', desc: '1600 sq ft' },
                            { value: '40x50', label: '40 × 50', desc: '2000 sq ft' }
                        ],
                        double: [
                            { value: '40x60', label: '40 × 60', desc: '2400 sq ft' },
                            { value: '50x80', label: '50 × 80', desc: '4000 sq ft' },
                            { value: '60x80', label: '60 × 80', desc: '4800 sq ft' },
                            { value: '60x100', label: '60 × 100', desc: '6000 sq ft' }
                        ]
                    }
                }
            },
            {
                id: 'floor_selection',
                title: 'Building Height & Grade',
                type: 'floor-grade',
                floorField: 'floor',
                gradeField: 'structural_style',
                floorOptions: [
                    { value: 'G+1', label: 'G+1 Duplex', desc: 'Family Home', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=95' },
                    { value: 'G+2', label: 'G+2 Triplex', desc: 'Spacious Life', img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=95' },
                    { value: 'G+3', label: 'G+3 Mansion', desc: 'Grand Living', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=95' }
                ],
                gradeOptions: [
                    { value: 'Base', label: 'Base', desc: 'Essential Build', img: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1400&q=95' },
                    { value: 'Classic', label: 'Classic', desc: 'Timeless Quality', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=95' },
                    { value: 'Premium', label: 'Premium', desc: 'Modern Luxury', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=95' },
                    { value: 'Elite', label: 'Elite', desc: 'Ultimate Finish', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=95' }
                ]
            },
            {
                id: 'additional_details',
                title: 'Additional Details',
                type: 'complex-grid',
                sections: [
                    {
                        label: 'Family Size',
                        field: 'family_count',
                        type: 'number-custom',
                        hasCustom: false,
                        options: [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }]
                    },
                    { label: 'Grandparents Living With You?', field: 'grandparents_living', type: 'toggle' },
                    {
                        label: 'Number of Children',
                        field: 'children_count',
                        type: 'number-custom',
                        hasCustom: false,
                        options: [{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }]
                    },
                    {
                        label: 'Bedrooms Required',
                        field: 'bedrooms',
                        type: 'number-custom',
                        hasCustom: false,
                        optionsByPlotSize: {
                            full: [{ value: 3, label: '3 BHK' }, { value: 4, label: '4 BHK' }, { value: 5, label: '5 BHK' }],
                            double: [{ value: 5, label: '5 BHK' }, { value: 6, label: '6 BHK' }, { value: 8, label: '8 BHK' }]
                        },
                        options: [{ value: 3, label: '3 BHK' }, { value: 4, label: '4 BHK' }, { value: 5, label: '5 BHK' }]
                    },
                    { label: 'Lift / Elevator Required?', field: 'lift_required', type: 'toggle' },
                    { label: 'Pooja Room?', field: 'pooja_room', type: 'toggle' },
                    {
                        label: 'Vastu Factor - Main Entrance Direction',
                        field: 'vastu_direction',
                        type: 'number-custom',
                        hasCustom: false,
                        options: [
                            { value: 'north', label: 'North', desc: 'Prosperity & Wisdom' },
                            { value: 'south', label: 'South', desc: 'Wealth & Fame' },
                            { value: 'east', label: 'East', desc: 'Health & Energy' },
                            { value: 'west', label: 'West', desc: 'Stability & Support' }
                        ]
                    },
                    {
                        label: 'Zone Details',
                        field: 'zone_details',
                        type: 'number-custom',
                        hasCustom: false,
                        options: [
                            { value: 'A', label: 'Zone A', desc: 'Premium Location' },
                            { value: 'B', label: 'Zone B', desc: 'Standard Location' },
                            { value: 'C', label: 'Zone C', desc: 'Economy Location' }
                        ]
                    },
                    { label: 'Extra Guest Bedroom on Terrace?', field: 'terrace_guest_bedroom', type: 'toggle', budgetImpact: 2.25 },
                ]
            },
            {
                id: 'review_plan',
                title: 'Review Your Plan',
                type: 'review',
                summary: true,
                addons: [
                    { label: 'Compound Wall', field: 'include_compound_wall' },
                    { label: 'Rainwater Harvesting', field: 'include_rainwater_harvesting' },
                    { label: 'Car Parking Covering', field: 'include_car_parking' }
                ]
            },
            {
                id: 'interior_selection',
                title: 'Interior Selection',
                type: 'interior-select',
                sections: [
                    {
                        label: 'Interior Package',
                        field: 'interior_package',
                        options: [
                            {
                                value: 'none',
                                label: 'No Interior',
                                desc: 'Civil-ready handover only',
                                aiExplain: 'AI suggests this when you want minimum upfront spend and plan interiors later in phases.',
                                inclusions: ['Bare civil finish handover', 'No fixed wardrobes/modular units', 'No false ceiling or decor work']
                            },
                            {
                                value: 'base',
                                label: 'Base Interior',
                                desc: 'Essential interior package',
                                aiExplain: 'AI suggests Base for balanced cost and functionality with all daily-use essentials covered.',
                                inclusions: ['Basic modular kitchen setup', 'Standard wardrobe shutters in key bedrooms', 'Basic lighting and utility-ready electrical points']
                            },
                            {
                                value: 'semi',
                                label: 'Semi Interior',
                                desc: 'Enhanced comfort and finish',
                                aiExplain: 'AI suggests Semi when you want strong everyday comfort, better aesthetics and higher storage quality without moving to full luxury spend.',
                                inclusions: [
                                    // Removed upgraded modular kitchen for smart upgrades cleanup
                                    'Wardrobes in all bedrooms with loft storage',
                                    'Selective false ceiling with cove and decor lighting',
                                    'TV unit for living room and compact foyer storage',
                                    'Premium laminate finish and soft-close fittings in key modules',
                                    'Enhanced electrical points for appliances and workstations',
                                    'Mirror and vanity storage in master bathroom',
                                    'Designer dado tiles in kitchen and selected wet areas'
                                ]
                            },
                            {
                                value: 'full_furnished',
                                label: 'Full Furnished Interior',
                                desc: 'Move-in ready premium setup',
                                aiExplain: 'AI suggests Full Furnished for turnkey handover where every major interior element is planned for immediate move-in with premium finish quality.',
                                inclusions: [
                                    'Complete modular kitchen with pantry, utility units and appliances-ready planning',
                                    'Full-height wardrobes in all bedrooms with lofts and accessories',
                                    'TV units, study/workstation modules and foyer console storage',
                                    'Comprehensive false ceiling design across major spaces',
                                    'Layered premium lighting: ambient, task and accent circuits',
                                    'Vanity units, mirror cabinets and premium bathroom accessories',
                                    'Crockery/bar unit and dining-side storage where applicable',
                                    // Removed premium veneer/laminate upgrade for smart upgrades cleanup
                                    'Soft-close hardware package with high-duty runners and hinges',
                                    'Decor wall paneling/highlight surfaces in living and master bedroom',
                                    'Curtain pelmet/blind readiness with concealed channels',
                                    'Turnkey detailing coordination for cleaner handover finish'
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'project_specs',
                title: 'Project Specifications & Add-ons',
                type: 'addons',
                addons: [
                    { field: 'include_compound_wall', label: 'Compound Wall', desc: 'Boundary wall with gate', icon: '🧱', cost: '₹3L' },
                    { field: 'include_rainwater_harvesting', label: 'Rainwater Harvesting', desc: 'Eco-friendly water system', icon: '🌧️', cost: '₹60K' },
                    { field: 'include_car_parking', label: 'Car Parking Covering', desc: 'Dedicated car parking', icon: '🚗', cost: '₹55K' }
                ]
            },
            {
                id: 'cost_estimation',
                title: 'Cost Estimation',
                type: 'final-estimate'
            }
        ]
    },

    rental: {
        title: 'Rental Homes',
        subtitle: 'ROI-focused multi-unit properties',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        theme: 'card-theme-blue',
        steps: [
            {
                id: 'site_dimensions',
                title: 'Site Type & Plot Dimensions',
                type: 'split-selection',
                leftSide: {
                    label: 'Select Site Type',
                    field: 'site_type',
                    options: [
                        { value: 'half', label: 'Half Site', desc: 'Single bedroom repeated rental units' },
                        { value: 'full', label: 'Full Site', desc: 'Double bedroom rental units' },
                        { value: 'double', label: 'Double Site', desc: 'Multiple bedroom larger rental layouts' }
                    ]
                },
                rightSide: {
                    label: 'Select Plot Dimensions',
                    field: 'dimensions',
                    dependsOn: 'site_type',
                    optionsByParent: {
                        half: [
                            { value: '20x30', label: '20 × 30', desc: '600 sq ft' },
                            { value: '20x40', label: '20 × 40', desc: '800 sq ft' },
                            { value: '25x40', label: '25 × 40', desc: '1000 sq ft' },
                            { value: '30x30', label: '30 × 30', desc: '900 sq ft' }
                        ],
                        full: [
                            { value: '30x40', label: '30 × 40', desc: '1200 sq ft' },
                            { value: '30x50', label: '30 × 50', desc: '1500 sq ft' },
                            { value: '40x40', label: '40 × 40', desc: '1600 sq ft' },
                            { value: '40x50', label: '40 × 50', desc: '2000 sq ft' }
                        ],
                        double: [
                            { value: '40x60', label: '40 × 60', desc: '2400 sq ft' },
                            { value: '50x80', label: '50 × 80', desc: '4000 sq ft' },
                            { value: '60x80', label: '60 × 80', desc: '4800 sq ft' },
                            { value: '60x100', label: '60 × 100', desc: '6000 sq ft' }
                        ]
                    }
                }
            },
            {
                id: 'floor_selection',
                title: 'Floors & Grade',
                type: 'floor-grade',
                floorField: 'floors',
                gradeField: 'plan',
                floorOptions: [
                    { value: 'G+1', label: 'G+1', desc: 'Compact rental stack', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=95' },
                    { value: 'G+2', label: 'G+2', desc: 'Balanced rental density', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=95' },
                    { value: 'G+3', label: 'G+3', desc: 'Higher rental yield', img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=95' }
                ],
                gradeOptions: [
                    { value: 'Base', label: 'Base', desc: 'Base', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=90' },
                    { value: 'Classic', label: 'Classic', desc: 'Classic', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=90' },
                    { value: 'Premium', label: 'Premium', desc: 'Premium', img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=90' }
                ]
            },
            {
                id: 'additional_details',
                title: 'Additional Details',
                type: 'complex-grid',
                sections: [
                    {
                        label: 'Target Unit Count',
                        field: 'target_unit_count',
                        type: 'number-custom',
                        hasCustom: false,
                        options: [
                            { value: 2, label: '2 Units' },
                            { value: 4, label: '4 Units' },
                            { value: 6, label: '6 Units' },
                            { value: 8, label: '8 Units' }
                        ]
                    },
                    { label: 'External Staircase Only?', field: 'external_staircase_only', type: 'toggle' },
                    { label: 'Separate Meter Per Unit?', field: 'separate_meter_per_unit', type: 'toggle' }
                ]
            },
            {
                id: 'review',
                title: 'Review Your Plan',
                type: 'review'
            },
            {
                id: 'interior_selection',
                title: 'Interior Selection',
                type: 'interior-select',
                sections: [
                    {
                        label: 'Interior Package',
                        field: 'interior_package',
                        options: [
                            {
                                value: 'semi',
                                label: 'Semi Interior',
                                desc: 'Rental-ready package for repeated units',
                                aiExplain: 'AI suggests Semi for rental projects because it balances durability, tenant appeal and payback period.',
                                inclusions: [
                                    'Modular kitchen basic setup',
                                    'Wardrobe shutters in key bedrooms',
                                    'Utility lighting and essential electrical points',
                                    'Durable, low-maintenance finish selections'
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'project_specs',
                title: 'Project Specifications & Add-ons',
                type: 'addons',
                addons: [
                    { field: 'include_compound_wall', label: 'Compound Wall', desc: 'Boundary wall with gate', icon: '🧱', cost: '₹3L' },
                    { field: 'include_rainwater_harvesting', label: 'Rainwater Harvesting', desc: 'Eco-friendly water system', icon: '🌧️', cost: '₹60K' },
                    { field: 'include_car_parking', label: 'Car Parking Covering', desc: 'Dedicated car parking', icon: '🚗', cost: '₹55K' }
                ]
            },
            {
                id: 'final-estimate',
                title: 'Cost Estimation',
                type: 'final-estimate'
            }
        ],
        rentalLogic: {
            unitTypeBySite: {
                half: 'Single Bedroom',
                full: 'Double Bedroom',
                double: 'Multiple Bedroom'
            },
            unitDetails: {
                half: { bedrooms: 1, bathrooms: 1, kitchen: true, hall: 'Small Hall' },
                full: { bedrooms: 2, bathrooms: '1-2', kitchen: true, hall: 'Hall' },
                double: { bedrooms: '2-3', bathrooms: 2, kitchen: true, hall: 'Large Hall' }
            },
            planMultipliers: {
                Base: 1.0,
                Classic: 1.14,
                Premium: 1.28
            },
            floorBaseCosts: {
                half: { 'G+1': 2200000, 'G+2': 3000000, 'G+3': 3900000, extra: 750000 },
                full: { 'G+1': 2600000, 'G+2': 3500000, 'G+3': 4500000, extra: 800000 },
                double: { 'G+1': 3600000, 'G+2': 5000000, 'G+3': 6500000, extra: 800000 }
            },
            breakdownComponents: [
                'Excavation & Foundation',
                'RCC Structure',
                'Brickwork',
                'Plastering',
                'Flooring',
                'Plumbing',
                'Electrical',
                'Bathrooms',
                'Staircase',
                'Exterior Finish',
                'Terrace Waterproofing'
            ]
        }
    },
    commercial: {
        title: 'Commercial',
        subtitle: 'Office spaces and retail buildings',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        theme: 'card-theme-orange',
        steps: [
            { id: 'area_selection', field: 'total_sqft', title: 'Total Area', options: [{ value: 10000, label: '10,000 sqft', desc: 'Small Office' }, { value: 25000, label: '25,000 sqft', desc: 'Corporate Floor' }] }
        ]
    },
    villa: {
        title: 'Villa',
        subtitle: 'Premium standalone luxury residence',
        image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80',
        theme: 'card-theme-green',
        steps: [
            { id: 'floor_selection', field: 'floor', title: 'Floors', options: [{ value: 'G+1', label: 'G+1 Luxury', desc: 'Elegant Living' }, { value: 'G+2', label: 'G+2 Grand', desc: 'Grand Estate' }] }
        ]
    },
    interior: {
        title: 'Interior',
        subtitle: 'Dataset-driven interior style estimation',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
        theme: 'card-theme-red',
        steps: [
            {
                id: 'style_selection',
                field: 'style',
                title: 'Interior Style (Dataset)',
                options: [
                    { value: 'modern', label: 'Modern', desc: 'Clean and minimal' },
                    { value: 'contemporary', label: 'Contemporary', desc: 'Current design language' },
                    { value: 'scandinavian', label: 'Scandinavian', desc: 'Light and functional' },
                    { value: 'transitional', label: 'Transitional', desc: 'Classic + modern balance' },
                    { value: 'industrial', label: 'Industrial', desc: 'Raw and urban' },
                    { value: 'farmhouse', label: 'Farmhouse', desc: 'Warm and rustic comfort' },
                    { value: 'rustic', label: 'Rustic', desc: 'Natural textures and wood' },
                    { value: 'traditional', label: 'Traditional', desc: 'Timeless formal design' },
                    { value: 'victorian', label: 'Victorian', desc: 'Detailed ornamental style' },
                    { value: 'french-country', label: 'French Country', desc: 'Elegant provincial charm' },
                    { value: 'mid-century-modern', label: 'Mid-Century Modern', desc: 'Retro modern simplicity' },
                    { value: 'mediterranean', label: 'Mediterranean', desc: 'Warm earthy elegance' },
                    { value: 'coastal', label: 'Coastal', desc: 'Airy seaside feel' },
                    { value: 'craftsman', label: 'Craftsman', desc: 'Handcrafted detailing' },
                    { value: 'eclectic', label: 'Eclectic', desc: 'Curated mix of styles' },
                    { value: 'asian', label: 'Asian', desc: 'Zen-inspired harmony' },
                    { value: 'southwestern', label: 'Southwestern', desc: 'Desert tones and texture' },
                    { value: 'shabby-chic-style', label: 'Shabby Chic Style', desc: 'Soft vintage aesthetic' },
                    { value: 'tropical', label: 'Tropical', desc: 'Lush relaxed atmosphere' }
                ]
            },
            {
                id: 'finish_level',
                field: 'finish_level',
                title: 'Finish Level',
                options: [
                    { value: 'budget', label: 'Budget', desc: 'Cost-efficient setup' },
                    { value: 'standard', label: 'Standard', desc: 'Balanced quality and cost' },
                    { value: 'premium', label: 'Premium', desc: 'High-end material finish' }
                ]
            },
            {
                id: 'area_selection',
                field: 'total_sqft',
                title: 'Interior Area',
                options: [
                    { value: 800, label: '800 sqft', desc: 'Compact apartment' },
                    { value: 1200, label: '1,200 sqft', desc: 'Standard home' },
                    { value: 1800, label: '1,800 sqft', desc: 'Large family home' },
                    { value: 2500, label: '2,500 sqft', desc: 'Premium residence' }
                ]
            },
            {
                id: 'interior_addons',
                title: 'Interior Components',
                type: 'complex-grid',
                sections: [
                    { label: 'False Ceiling', field: 'include_false_ceiling', type: 'toggle' },
                    { label: 'Modular Kitchen', field: 'include_modular_kitchen', type: 'toggle' },
                    { label: 'Wardrobes & Storage', field: 'include_wardrobes', type: 'toggle' }
                ]
            },
            {
                id: 'final-estimate',
                title: 'Cost Estimation',
                type: 'final-estimate'
            }
        ]
    },
    exterior: {
        title: 'Exterior',
        subtitle: 'Dataset-driven facade and outdoor estimation',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
        theme: 'card-theme-white',
        steps: [
            {
                id: 'style_selection',
                field: 'style',
                title: 'Exterior Style (Dataset)',
                options: [
                    { value: 'modern', label: 'Modern', desc: 'Minimal geometric facade' },
                    { value: 'contemporary', label: 'Contemporary', desc: 'Current urban expression' },
                    { value: 'scandinavian', label: 'Scandinavian', desc: 'Simple clean elevations' },
                    { value: 'transitional', label: 'Transitional', desc: 'Classic-modern blend' },
                    { value: 'industrial', label: 'Industrial', desc: 'Bold raw materials' },
                    { value: 'farmhouse', label: 'Farmhouse', desc: 'Rural modern blend' },
                    { value: 'rustic', label: 'Rustic', desc: 'Stone and timber character' },
                    { value: 'traditional', label: 'Traditional', desc: 'Formal and symmetric' },
                    { value: 'victorian', label: 'Victorian', desc: 'Decorative heritage look' },
                    { value: 'french-country', label: 'French Country', desc: 'European countryside elegance' },
                    { value: 'mid-century-modern', label: 'Mid-Century Modern', desc: 'Horizontal clean volumes' },
                    { value: 'mediterranean', label: 'Mediterranean', desc: 'Arches and warm texture' },
                    { value: 'coastal', label: 'Coastal', desc: 'Bright and airy facade' },
                    { value: 'craftsman', label: 'Craftsman', desc: 'Strong artisan details' },
                    { value: 'eclectic', label: 'Eclectic', desc: 'Mixed personalized language' },
                    { value: 'asian', label: 'Asian', desc: 'Calm horizontal balance' },
                    { value: 'southwestern', label: 'Southwestern', desc: 'Earthy desert expression' },
                    { value: 'shabby-chic-style', label: 'Shabby Chic Style', desc: 'Soft vintage exterior' },
                    { value: 'tropical', label: 'Tropical', desc: 'Climate-ready airy skin' }
                ]
            },
            {
                id: 'area_selection',
                field: 'total_sqft',
                title: 'Exterior Area',
                options: [
                    { value: 1000, label: '1,000 sqft', desc: 'Compact frontage' },
                    { value: 1500, label: '1,500 sqft', desc: 'Standard plot envelope' },
                    { value: 2500, label: '2,500 sqft', desc: 'Large facade scope' },
                    { value: 4000, label: '4,000 sqft', desc: 'Premium full envelope' }
                ]
            },
            {
                id: 'exterior_components',
                title: 'Exterior Components',
                type: 'complex-grid',
                sections: [
                    { label: 'Compound Wall', field: 'include_compound_wall', type: 'toggle' },
                    { label: 'Waterproofing', field: 'include_waterproofing', type: 'toggle' },
                    { label: 'Main Gate', field: 'include_gate', type: 'toggle' },
                    { label: 'Elevation Treatment', field: 'include_elevation', type: 'toggle' },
                    { label: 'Landscaping', field: 'include_landscaping', type: 'toggle' }
                ]
            },
            {
                id: 'final-estimate',
                title: 'Cost Estimation',
                type: 'final-estimate'
            }
        ]
    }
};
