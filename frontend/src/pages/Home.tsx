import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Info, User, Shield, X, QrCode } from 'lucide-react';
import QRCodeDisplay from '../components/QRCodeDisplay';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [showLoginMenu, setShowLoginMenu] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
            <div className="max-w-4xl w-full text-center space-y-12">

                {/* Header */}
                <div className="space-y-4 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Smart Print Kiosk
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Automatic Document Printing Machine. Secure, Fast, and Easy.
                    </p>
                </div>

                {/* Login Button */}
                <div className="flex justify-end max-w-2xl mx-auto">
                    <button
                        onClick={() => setShowLoginMenu(!showLoginMenu)}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-600 transition-all flex items-center gap-2"
                    >
                        <User className="w-5 h-5" />
                        <span>Login</span>
                    </button>
                </div>

                {/* Login Menu Modal */}
                {showLoginMenu && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowLoginMenu(false)}>
                        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Select Login Type</h2>
                                <button onClick={() => setShowLoginMenu(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* User Login */}
                                <button
                                    onClick={() => navigate('/user-login')}
                                    className="w-full p-6 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold">User Login</h3>
                                        <p className="text-sm text-blue-100 opacity-80">Access your documents</p>
                                    </div>
                                </button>

                                {/* Admin Login */}
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="w-full p-6 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold">Admin Login</h3>
                                        <p className="text-sm text-purple-100 opacity-80">Manage system & view reports</p>
                                    </div>
                                </button>

                                {/* Guest Mode */}
                                <button
                                    onClick={() => {
                                        setShowLoginMenu(false);
                                        navigate('/upload');
                                    }}
                                    className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all text-center"
                                >
                                    <p className="text-sm text-slate-300">Continue as Guest</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Action */}
                <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate('/upload')}
                        className="group relative p-8 bg-blue-600 rounded-2xl shadow-2xl hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center gap-4">
                            <Upload className="w-16 h-16 text-white" />
                            <span className="text-2xl font-bold">Upload Document</span>
                            <span className="text-sm text-blue-100 opacity-80">PDF, DOCX, JPG supported</span>
                        </div>
                    </button>

                    <div className="p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center justify-center gap-4 opacity-75">
                        <Info className="w-12 h-12 text-slate-400" />
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-slate-300">System Status</h3>
                            <p className="text-slate-400 mt-2">Machine Online</p>
                            <p className="text-xs text-slate-500 mt-4">Python Backend on Windows Embedded / Pi</p>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="max-w-md mx-auto mt-12">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                            <QrCode className="w-6 h-6 text-blue-400" />
                            Scan to Upload
                        </h3>
                        <QRCodeDisplay machineId="machine_01" machineName="Kiosk #1" />
                    </div>
                </div>

                {/* Footer */}
                <div className="text-slate-600 text-sm mt-12">
                    <p>© 2025 Automatic Document Printing Machine</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
