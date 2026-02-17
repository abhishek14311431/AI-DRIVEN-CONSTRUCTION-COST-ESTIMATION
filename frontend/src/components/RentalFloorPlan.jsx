import { motion } from 'framer-motion';
import { ArrowLeft, Home, Building, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function RentalFloorPlan({ onBack, selectedData, onNext }) {
    const [selectedFloors, setSelectedFloors] = useState(() => {
        const f = selectedData?.floors;
        if (!f) return null;
        if (typeof f === 'number') return 'custom';
        if (!['g+1', 'g+2', 'g+3', 'custom'].includes(String(f).toLowerCase())) return 'custom';
        return String(f).toLowerCase();
    });
    const [selectedPlan, setSelectedPlan] = useState(selectedData?.plan || null);
    const [customFloors, setCustomFloors] = useState(() => {
        const f = selectedData?.floors;
        if (!f) return '';
        if (typeof f === 'number') return String(f);
        if (!['g+1', 'g+2', 'g+3', 'custom'].includes(String(f).toLowerCase())) return String(f);
        return '';
    });

    const floorOptions = [
        { id: 'g+1', name: 'G+1', description: 'Ground + 1 Floor', color: 'from-teal-400 to-teal-600' },
        { id: 'g+2', name: 'G+2', description: 'Ground + 2 Floors', color: 'from-cyan-400 to-cyan-600' },
        { id: 'g+3', name: 'G+3', description: 'Ground + 3 Floors', color: 'from-sky-400 to-sky-600' },
        { id: 'custom', name: 'Custom', description: 'Enter floors', color: 'from-indigo-400 to-indigo-600' }
    ];

    const planOptions = [
        {
            id: 'base',
            name: 'Base',
            description: 'Cost Effective',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop',
            icon: Home,
            color: 'from-orange-400 to-orange-600',
            borderColor: 'border-orange-400'
        },
        {
            id: 'classic',
            name: 'Classic',
            description: 'Standard Finish',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
            icon: Building,
            color: 'from-emerald-400 to-emerald-600',
            borderColor: 'border-emerald-400'
        },
        {
            id: 'premium',
            name: 'Premium',
            description: 'High Value Finish',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop',
            icon: Sparkles,
            color: 'from-violet-400 to-violet-600',
            borderColor: 'border-violet-400'
        }
    ];

    const handleNext = () => {
        const floors = selectedFloors === 'custom' ? customFloors : selectedFloors;
        onNext({ ...selectedData, floors: floors, plan: selectedPlan });
    };

    const canProceed = (selectedFloors && selectedPlan) && (selectedFloors !== 'custom' || customFloors);

    return (
        <motion.div
            className="min-h-screen relative overflow-hidden p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center fixed"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop')",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 fixed" />

            <div className="relative z-10 w-full max-w-[90%] mx-auto pb-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 pt-4"
                >
                    <motion.button
                        onClick={onBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-white/80 font-medium hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md mb-4 md:mb-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </motion.button>

                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 text-center drop-shadow-2xl font-serif">
                        Rental Project Details
                    </h1>
                    <div className="w-24 hidden md:block" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden"
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Project Snapshot */}
                    <div className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1 bg-black/20 rounded-2xl border border-white/5">
                            {/* Basic Project Info */}
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-blue-400/80 uppercase tracking-widest font-bold mb-1">Project</p>
                                <p className="text-lg font-bold text-white tracking-wide">{selectedData?.projectType || 'Rental'}</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-blue-400/80 uppercase tracking-widest font-bold mb-1">Plot Size</p>
                                <p className="text-lg font-bold text-white tracking-wide capitalize">{selectedData?.plotSize?.replace('-', ' ')}</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-blue-400/80 uppercase tracking-widest font-bold mb-1">Dimensions</p>
                                <p className="text-lg font-bold text-white tracking-wide">{selectedData?.dimensions}</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-blue-400/80 uppercase tracking-widest font-bold mb-1">Parking</p>
                                <p className="text-lg font-bold text-white tracking-wide">{selectedData?.answers?.parking || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Floor Selection Column */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400">
                                    <Building className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Rental Units</h3>
                                    <p className="text-white/40 text-sm">Maximize your vertical space</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {floorOptions.map((floor) => (
                                    <motion.div
                                        key={floor.id}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        onClick={() => setSelectedFloors(floor.id)}
                                        className={`cursor-pointer group relative p-6 rounded-2xl transition-all duration-300 border ${selectedFloors === floor.id ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div>
                                                <h4 className={`text-xl font-bold mb-1 ${selectedFloors === floor.id ? 'text-white' : 'text-white/80'}`}>{floor.name}</h4>
                                                <p className="text-white/50 text-sm">{floor.description}</p>
                                            </div>
                                            {selectedFloors === floor.id && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {selectedFloors === 'custom' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pt-2"
                                >
                                    <input
                                        type="number"
                                        placeholder="Enter number of floors"
                                        value={customFloors}
                                        onChange={(e) => setCustomFloors(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl text-white text-lg font-medium bg-black/40 border-2 border-white/10 focus:outline-none focus:border-teal-500/50 focus:bg-black/60 transition-all placeholder:text-white/20"
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Plan Selection Column */}
                        <div className="flex-[2] space-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 text-violet-400">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Construction Grade</h3>
                                    <p className="text-white/40 text-sm">Balance cost and durability</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {planOptions.map((plan) => (
                                    <motion.div
                                        key={plan.id}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`cursor-pointer group relative overflow-hidden rounded-2xl border transition-all duration-300 h-full flex flex-col ${selectedPlan === plan.id ? `border-${plan.color.split('-')[1]}-500 shadow-xl shadow-${plan.color.split('-')[1]}-500/10` : 'border-white/5 hover:border-white/20 bg-black/20'}`}
                                    >
                                        <div className="h-48 relative overflow-hidden rounded-t-xl">
                                            <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-20 group-hover:opacity-30 transition-opacity z-10`}></div>
                                            <img src={plan.image} alt={plan.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        </div>

                                        <div className="flex-1 p-5 flex flex-col justify-center relative bg-gradient-to-t from-black/80 to-black/40">
                                            <div className="flex items-center gap-2 mb-1">
                                                <plan.icon className={`w-4 h-4 text-${plan.color.split('-')[1]}-400`} />
                                                <h4 className={`text-lg font-bold text-white`}>{plan.name}</h4>
                                            </div>
                                            <p className="text-white/50 text-sm">{plan.description}</p>
                                            {selectedPlan === plan.id && (
                                                <motion.div
                                                    layoutId="rental-outline"
                                                    className={`absolute inset-0 border-2 rounded-2xl border-${plan.color.split('-')[1]}-500 pointer-events-none`}
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(100, 200, 255, 0.3)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            disabled={!canProceed}
                            className={`px-10 py-5 rounded-2xl text-black font-bold text-lg tracking-wide shadow-2xl transition-all duration-300 flex items-center gap-3 ${canProceed ? 'bg-gradient-to-r from-blue-300 to-blue-500' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                        >
                            Next Step
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
