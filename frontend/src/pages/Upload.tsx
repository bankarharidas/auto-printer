import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Upload: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [copies, setCopies] = useState(1);
    const [colorMode, setColorMode] = useState<'bw' | 'color'>('bw');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Basic validation
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File size exceeds 10MB limit.");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('copies', copies.toString());
        formData.append('color_mode', colorMode);

        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Navigate to status page with document ID
            navigate(`/status/${response.data._id}`);

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Upload Document</h2>
                    <p className="text-slate-400">Select your file and print options</p>
                </div>

                {/* File Selection Area */}
                <div
                    className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer
            ${file ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'}
          `}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.docx,.jpg,.jpeg"
                    />

                    {file ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-semibold">{file.name}</p>
                                <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="text-sm text-red-400 hover:text-red-300"
                            >
                                Remove File
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                                <UploadIcon className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xl font-semibold">Click to Upload</p>
                                <p className="text-sm text-slate-400">PDF, DOCX, JPG (Max 10MB)</p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Options */}
                {file && (
                    <div className="bg-slate-800 p-6 rounded-xl space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <label className="text-lg font-medium">Number of Copies</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setCopies(Math.max(1, copies - 1))}
                                    className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-xl font-bold"
                                >
                                    -
                                </button>
                                <span className="text-2xl font-bold w-8 text-center">{copies}</span>
                                <button
                                    onClick={() => setCopies(Math.min(100, copies + 1))}
                                    className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-lg font-medium">Color Mode</label>
                            <div className="flex bg-slate-700 p-1 rounded-lg">
                                <button
                                    onClick={() => setColorMode('bw')}
                                    className={`px-4 py-2 rounded-md transition-all ${colorMode === 'bw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Black & White
                                </button>
                                <button
                                    onClick={() => setColorMode('color')}
                                    className={`px-4 py-2 rounded-md transition-all ${colorMode === 'color' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Color
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3
            ${!file || isUploading
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500 text-white transform hover:-translate-y-1'
                        }
          `}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Check className="w-6 h-6" />
                            Upload & Send to Printer
                        </>
                    )}
                </button>

            </div>
        </div>
    );
};

export default Upload;
