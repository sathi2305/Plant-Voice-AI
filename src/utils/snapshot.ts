/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Canvas Photo Snapshot Utility
 */

export const captureGardenSnapshot = (
  gardenName: string,
  moodName: string,
  stageName: string
): { success: boolean; dataUrl?: string } => {
  try {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      return { success: false };
    }

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return { success: false };

    // 1. Draw webgl canvas
    ctx.drawImage(canvas, 0, 0);

    // 2. Overlay elegant botanical watermark banner at bottom
    const barHeight = Math.max(60, Math.floor(exportCanvas.height * 0.09));
    const grad = ctx.createLinearGradient(0, exportCanvas.height - barHeight * 1.8, 0, exportCanvas.height);
    grad.addColorStop(0, 'rgba(11, 20, 16, 0)');
    grad.addColorStop(0.5, 'rgba(11, 20, 16, 0.75)');
    grad.addColorStop(1, 'rgba(11, 20, 16, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, exportCanvas.height - barHeight * 1.8, exportCanvas.width, barHeight * 1.8);

    // Text: Brand and Garden Name
    ctx.fillStyle = '#f4eee1';
    ctx.font = `600 ${Math.max(16, Math.floor(barHeight * 0.3))}px "Outfit", sans-serif`;
    ctx.fillText(`PlantVoice · ${gardenName}`, 36, exportCanvas.height - barHeight * 0.52);

    // Subtitle: Stage & Mood
    ctx.fillStyle = '#8fa89b';
    ctx.font = `400 ${Math.max(12, Math.floor(barHeight * 0.22))}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`${stageName}  ·  ${moodName} Atmosphere`, 36, exportCanvas.height - barHeight * 0.2);

    const dataUrl = exportCanvas.toDataURL('image/png');

    // Trigger browser download
    const link = document.createElement('a');
    link.download = `${gardenName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-snapshot.png`;
    link.href = dataUrl;
    link.click();

    return { success: true, dataUrl };
  } catch (err) {
    console.warn('Snapshot capture failed:', err);
    return { success: false };
  }
};
