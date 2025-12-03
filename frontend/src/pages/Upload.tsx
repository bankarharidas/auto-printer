import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload as UploadIcon, Printer, Home, FileText, Combine } from 'lucide-react';
import axios from 'axios';

const Upload: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const machineId = searchParams.get('machine_id');

    const [files, setFiles] = useState<File[]>([]);
    const [copies, setCopies] = useState(1);
    const [colorMode, setColorMode] = useState<'bw' | 'color'>('bw'); // Default B&W
    const [mergeFiles, setMergeFiles] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Validate each file
            for (const file of selectedFiles) {
                if (file.size > 10 * 1024 * 1024) {
                    setError("Each file must be less than 10MB");
                    return;
                }
            }

            setFiles(prev => [...prev, ...selectedFiles]);
            setError(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError("Please select at least one file");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            if (mergeFiles && files.length > 1) {
                // Merge multiple files
                const formData = new FormData();
                files.forEach(file => formData.append('files', file));
                formData.append('copies', copies.toString());
                formData.append('color_mode', colorMode);
                if (machineId) formData.append('machine_id', machineId);

                const response = await axios.post('http://localhost:8000/merge-and-upload', formData);
                navigate(`/status/${response.data._id}`);
            } else {
                // Upload single file or multiple separate files
                const formData = new FormData();
                formData.append('file', files[0]);
                formData.append('copies', copies.toString());
                formData.append('color_mode', colorMode);
                if (machineId) formData.append('machine_id', machineId);

                const response = await axios.post('http://localhost:8000/upload', formData);
                navigate(`/status/${response.data._id}`);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Upload & Print</h2>
                        <p className="text-slate-400 text-sm">PDF, DOCX, JPG supported</p>
                        {machineId && (
                            <p className="text-blue-400 text-sm mt-1">Connected to Machine: {machineId}</p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </button>
                </div>

                {/* File Upload Area */}
                <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                    <label className="block">
                        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.docx,.jpg,.jpeg"
                                multiple
                            />
                            <UploadIcon className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                            <p className="text-lg font-semibold mb-1">Click to select files</p>
                            <p className="text-sm text-slate-400">PDF, DOCX, JPG (max 10MB each)</p>
                        </div>
                    </label>

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-slate-700 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-red-400 hover:text-red-300 text-sm px-3 py-1 hover:bg-slate-600 rounded transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Print Options */}
                <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Print Options</h3>

                    {/* Copies */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Number of Copies</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={copies}
                            onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Color Mode */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Print Mode</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setColorMode('bw')}
                                className={`p-4 rounded-lg border-2 transition ${colorMode === 'bw'
                                    ? 'border-blue-500 bg-blue-500/20'
                                    : 'border-slate-600 hover:border-slate-500'
                                    }`}
                            >
                                <p className="font-semibold">⚫ Black & White</p>
                                <p className="text-xs text-slate-400 mt-1">Default</p>
                            </button>
                            <button
                                onClick={() => setColorMode('color')}
                                className={`p-4 rounded-lg border-2 transition ${colorMode === 'color'
                                    ? 'border-blue-500 bg-blue-500/20'
                                    : 'border-slate-600 hover:border-slate-500'
                                    }`}
                            >
                                <p className="font-semibold">🌈 Color</p>
                                <p className="text-xs text-slate-400 mt-1">Premium</p>
                            </button>
                        </div>
                    </div>

                    {/* Merge Option */}
                    {files.length > 1 && (
                        <div className="border-t border-slate-700 pt-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={mergeFiles}
                                    onChange={(e) => setMergeFiles(e.target.checked)}
                                    className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                                />
                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        <Combine className="w-4 h-4" />
                                        Merge all files into one document
                                    </p>
                                    <p className="text-xs text-slate-400">Combine {files.length} files before printing</p>
                                </div>
                            </label>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                        {error}
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isUploading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
                >
                    {isUploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Printer className="w-5 h-5" />
                            Upload & Print
                        </>
                    )}
                </button>

            </div>
        </div>
    );
};

export default Upload;
