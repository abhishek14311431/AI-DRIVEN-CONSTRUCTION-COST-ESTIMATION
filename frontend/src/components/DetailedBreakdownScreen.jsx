import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetailedBreakdownScreen({ onBack, tier, estimateData, selectedData }) {
    const baseTotal = Number(estimateData?.breakdown?.total_cost || 0);

    return (
        <motion.div className="min-h-screen bg-black text-white p-6 relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-black to-purple-900/40 fixed" />

            <div className="relative z-10 max-w-5xl mx-auto py-8 lg:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <button onClick={onBack} className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all text-white/70 backdrop-blur-md">
                        <LucideIcons.ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-white font-serif tracking-tight">
                            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Cost Audit</span>
                        </h1>
                        <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] font-bold mt-2">Precision Pin-to-Pin Breakdown</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Audit Ref: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">
                            Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Main Table */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <LucideIcons.Calculator className="w-6 h-6 text-green-400" />
                        <h3 className="text-2xl font-black tracking-tight">Full Project Breakdown</h3>
                    </div>

                    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                        <div className="p-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <div>
                                <h4 className="text-lg font-bold">Estimated Total Budget</h4>
                                <p className="text-white/40 text-xs">Calculated based on current market rates</p>
                            </div>
                            <p className="text-4xl font-black text-white">₹{baseTotal.toLocaleString('en-IN')}</p>
                        </div>

                        <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <div className="space-y-3">
                                {estimateData?.breakdown?.pin_to_pin_details?.map((item, i) => {


                                    const IconComponent = LucideIcons[item.icon] || LucideIcons.FileText;

                                    return (
                                        <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-green-500/10 transition-colors">
                                                    <IconComponent className="w-5 h-5 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/30 uppercase font-black tracking-widest">{item.category}</p>
                                                    <p className="text-base font-bold text-white">{item.item}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white tracking-tight">₹{item.amount.toLocaleString('en-IN')}</p>
                                                <p className="text-[10px] text-white/20 font-bold uppercase">Audit Verified</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-8 bg-green-500/10 flex items-center justify-between border-t border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-green-500 text-black">
                                    <LucideIcons.Download className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Comprehensive Specification List</p>
                                    <p className="text-xs text-white/40 italic">Ready for structural execution</p>
                                </div>
                            </div>
                            <button className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all">
                                DOWNLOAD PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
