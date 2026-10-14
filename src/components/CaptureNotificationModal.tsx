/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Snapshot Confirmation Modal
 */

import React from 'react';
import { X, CheckCircle2, Download, Image as ImageIcon } from 'lucide-react';

interface CaptureNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataUrl?: string;
  gardenName: string;
}

export const CaptureNotificationModal: React.FC<CaptureNotificationModalProps> = ({
  isOpen,
  onClose,
  dataUrl,
  gardenName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="capture-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#0d1712] border border-emerald-900/60 rounded-2xl shadow-2xl p-6 text-emerald-100">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 id="capture-modal-title" className="text-base font-display font-semibold text-white">
            Garden Photo Captured!
          </h2>
        </div>

        <p className="text-xs text-emerald-300/80 mb-4">
          A clean snapshot of <strong>{gardenName}</strong> has been downloaded to your device with current mood and growth stage markers.
        </p>

        {dataUrl && (
          <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/40 max-h-56 flex items-center justify-center">
            <img src={dataUrl} alt="Captured Garden Snapshot" className="w-full h-auto object-contain" />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium transition-colors cursor-pointer"
          >
            Return to Garden
          </button>
        </div>
      </div>
    </div>
  );
};
