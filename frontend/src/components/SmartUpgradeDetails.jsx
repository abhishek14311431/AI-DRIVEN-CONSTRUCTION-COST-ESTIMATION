import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, CheckCircle, Info, Zap, Shield, Sparkles, Building, Layers, DollarSign, ChevronRight, X, AlertCircle } from 'lucide-react';

export default function SmartUpgradeDetails({ onBack, estimateData, selectedData, onSelectTier }) {
    const [confirmingTier, setConfirmingTier] = useState(null);
    const currentTier = estimateData?.breakdown?.selected_tier || "Basic";
    const baseTotal = Number(estimateData?.breakdown?.total_cost || 0);

    const allTiers = ["Classic", "Premium", "Luxury"];
    const suggestions = estimateData?.upgrade_suggestions || [];

    const getTierTotal = (tierName) => {
        const suggestion = suggestions.find(s => s.tier === tierName);
        return suggestion ? baseTotal + Number(suggestion.upgrade_cost) : baseTotal;
    };

    const getUpgradeCost = (tierName) => {
        const suggestion = suggestions.find(s => s.tier === tierName);
        return suggestion ? Number(suggestion.upgrade_cost) : 0;
    };

    const getBenefits = (tierName) => {
        const tier_features = {
            "Classic": [
                "Premium Granite Flooring (Exotic Polish)",
                "Granite Stairs with Double Molding & Nosing",
                "Seasoned Teak Wood Main Door Frame",
                "Branded CP & Sanitary (Hindware/Parryware)",
                "Modular Kitchen Carcass (Standard PVC/Marine)",
                "Living Room False Ceiling with LED integration"
            ],
            "Premium": [
                "High-Grade Indian Marble (Makrana/Wonder)",
                "App-controlled Smart Lighting & Security",
                "Full Teak Wood Door Frames for all rooms",
                "Silk-Texture Asian Paints Royale (Feature Walls)",
                "Kohler/Jaquar Contemporary Series Sanitary",
                "Wall-Hung Closets with Single-Lever Divertors",
                "Designer Modular Kitchen with High-End Carcass",
                "WPC & Exotic Stone Cladding for Elevation"
            ],
            "Luxury": [
                "Imported Italian Statuario Marble (Seamless Book-match)",
                "Full Ecosystem Home Automation (Voice/App/Sensors)",
                "Imported European Oak Wood Flooring (Master Suites)",
                "Exotic Stone Wall Paneling with Cove Lighting",
                "German-engineered Häcker Kitchen Suite",
                "Integrated Bosch/Siemens High-End Appliances",
                "Automated Toto/Duravit Hygienic Bath Systems",
                "Thermostatic Rain-Showers with Body Jets",
                "Acoustic-Treated Private Cinema / Theater Room",
                "4K Laser Projection & 7.1 Surround Wiring",
                "Full Veneer Teak Doors with Designer Hardware",
                "Concealed Centralized VRV/VRF Air Conditioning",
                "Triple-Glazed Acoustic Window Systems (Aero-grade)",
                "Solar Power Integration with Smart Dashboard"
            ]
        };
        return tier_features[tierName] || [];
    };

    const getXAIDetail = (tierName) => {
        const details = {
            "Classic": "Direct upgrade to natural stone and branded mechanical fixtures for 15+ years of durability.",
            "Premium": "Engineered for luxury living with natural Indian marbles and pre-integrated smart automation.",
            "Luxury": "The ultimate architectural statement. Imported materials and a complete tech-integrated lifestyle."
        };
        return details[tierName] || "";
    };

    return (
        <motion.div
            className="min-h-screen relative overflow-hidden p-6 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 fixed" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-black to-purple-900/40 fixed" />

            <div className="relative z-10 w-full max-w-7xl mx-auto py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <motion.button
                        onClick={onBack}
                        whileHover={{ scale: 1.05, x: -5 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white/70 font-bold hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
                    >
                        <ArrowLeft className="w-5 h-5" /> Go Back
                    </motion.button>

                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-serif mb-2">
                            Upgrade Matrix
                        </h1>
                        <p className="text-white/40 tracking-[0.3em] uppercase text-xs font-bold">ROI & Value Enhancement Analysis</p>
                    </div>

                    <div className="w-32 hidden md:block" />
                </div>

                {/* 3-Column Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {allTiers.map((tier, idx) => (
                        <motion.div
                            key={tier}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative flex flex-col h-full group"
                        >
                            {/* Card Glow */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-b ${tier === 'Luxury' ? 'from-yellow-400/30 via-orange-500/10 to-transparent' :
                                    tier === 'Premium' ? 'from-purple-500/30 via-pink-500/10 to-transparent' :
                                        'from-blue-500/30 via-indigo-500/10 to-transparent'
                                } rounded-[3rem] blur opacity-20 group-hover:opacity-100 transition duration-700`} />

                            <div className="relative flex flex-col h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 overflow-hidden">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className={`text-4xl font-black ${tier === 'Luxury' ? 'text-yellow-400' :
                                                tier === 'Premium' ? 'text-purple-400' :
                                                    'text-blue-400'
                                            }`}>{tier}</h3>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Tier Level {idx + 1}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${tier === 'Luxury' ? 'text-yellow-400' :
                                            tier === 'Premium' ? 'text-purple-400' :
                                                'text-blue-400'
                                        }`}>
                                        {tier === 'Luxury' ? <Sparkles className="w-6 h-6" /> :
                                            tier === 'Premium' ? <Shield className="w-6 h-6" /> :
                                                <Zap className="w-6 h-6" />}
                                    </div>
                                </div>

                                {/* Cost Block */}
                                <div className="space-y-4 mb-8">
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                                        <span className="text-white/30 text-[10px] uppercase font-black tracking-widest block mb-2">Final Investment</span>
                                        <p className="text-3xl font-black text-white tracking-tighter">₹{getTierTotal(tier).toLocaleString('en-IN')}</p>
                                        <p className="text-green-400 text-xs font-bold mt-1">+₹{getUpgradeCost(tier).toLocaleString('en-IN')} added value</p>
                                    </div>
                                </div>

                                {/* Features List (The main content) */}
                                <div className="flex-grow space-y-4 mb-10 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                                    <p className="text-white/60 text-[10px] uppercase font-black tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
                                        <Layers className="w-3 h-3" />
                                        {getBenefits(tier).length} Key Specification Increases
                                    </p>
                                    {getBenefits(tier).map((benefit, bIdx) => (
                                        <motion.div
                                            key={bIdx}
                                            className="flex gap-4 group/item"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (idx * 0.1) + (bIdx * 0.03) }}
                                        >
                                            <div className="mt-1 flex-shrink-0">
                                                <CheckCircle className={`w-4 h-4 ${tier === 'Luxury' ? 'text-yellow-400' :
                                                        tier === 'Premium' ? 'text-purple-400' :
                                                            'text-blue-400'
                                                    } opacity-40 group-hover/item:opacity-100 transition-opacity`} />
                                            </div>
                                            <span className="text-sm text-white/70 leading-relaxed font-medium group-hover/item:text-white transition-colors">
                                                {benefit}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer Action */}
                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <p className="text-[10px] text-white/30 italic leading-snug">
                                        {getXAIDetail(tier)}
                                    </p>
                                    <button
                                        onClick={() => setConfirmingTier(tier)}
                                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl ${tier === 'Luxury' ? 'bg-yellow-400 text-black hover:bg-yellow-300' :
                                                tier === 'Premium' ? 'bg-purple-500 text-white hover:bg-purple-400 shadow-purple-900/20' :
                                                    'bg-white text-black hover:bg-white/90 shadow-white/5'
                                            }`}
                                    >
                                        Upgrade to {tier}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Intelligent ROI Banner */}
                <motion.div
                    className="mt-16 p-10 rounded-[3rem] bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/10 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-8">
                        <div className="p-5 rounded-3xl bg-white/5 flex items-center justify-center">
                            <TrendingUp className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white">Market ROI Projection</h4>
                            <p className="text-white/40 text-sm max-w-xl">AI predicts an appreciation delta of 1.4x for {selectedData?.projectType} within 24 months based on {selectedData?.zone} market trends.</p>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <span className="text-[10px] uppercase font-black text-blue-400 tracking-widest block mb-1">Projected Resale Boost</span>
                        <span className="text-5xl font-black text-white tracking-tighter">+22%</span>
                    </div>
                </motion.div>
            </div>

            {/* Confirmation Overlay */}
            <AnimatePresence>
                {confirmingTier && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                        >
                            <button
                                onClick={() => setConfirmingTier(null)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/40"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center">
                                <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                                <h3 className="text-3xl font-black text-white mb-2">Confirm Upgrade?</h3>
                                <p className="text-white/50 mb-8 leading-relaxed">
                                    Do you want to finalize the <span className="text-white font-bold">{confirmingTier} Edition</span>? This will calculate the full pin-to-pin technical cost breakdown.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => onSelectTier(confirmingTier)}
                                        className="w-full py-5 rounded-2xl bg-white text-black font-black text-xl hover:bg-white/90 transition-all"
                                    >
                                        YES, PROCEED
                                    </button>
                                    <button
                                        onClick={() => setConfirmingTier(null)}
                                        className="w-full py-5 rounded-2xl bg-white/5 text-white/50 font-bold hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        NOT NOW, GO BACK
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
