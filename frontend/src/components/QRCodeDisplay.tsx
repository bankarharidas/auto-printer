import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
    machineId: string;
    machineName: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ machineId, machineName }) => {
    // Construct the URL for the upload page
    // In production, this would be the public URL of the app
    const uploadUrl = `${window.location.origin}/upload?machine_id=${machineId}`;

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Scan to Upload</h3>
            <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-100">
                <QRCodeSVG
                    value={uploadUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                />
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
                Scan this QR code to upload files directly to <span className="font-medium text-indigo-600">{machineName}</span>
            </p>
            <div className="mt-2 text-xs text-gray-400 break-all text-center">
                {uploadUrl}
            </div>
        </div>
    );
};

export default QRCodeDisplay;
