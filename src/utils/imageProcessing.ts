import JSZip from 'jszip';

interface WatermarkSettings {
  text: string;
  transparency: number;
  fontSize: number;
  position: { x: number; y: number };
  angle: number;
}

export const processImages = async (
  images: File[],
  watermarkSettings: WatermarkSettings,
  onProgress: (progress: number) => void
): Promise<void> => {
  const zip = new JSZip();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to create canvas context');
  }

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const img = await createImageBitmap(image);

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    // Apply watermark
    ctx.save();
    ctx.globalAlpha = watermarkSettings.transparency;
    ctx.font = `${watermarkSettings.fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.translate(
      (watermarkSettings.position.x / 100) * canvas.width,
      (watermarkSettings.position.y / 100) * canvas.height
    );
    ctx.rotate((watermarkSettings.angle * Math.PI) / 180);
    ctx.fillText(watermarkSettings.text, 0, 0);
    ctx.restore();

    const watermarkedImage = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create image blob');
        }
      }, 'image/png');
    });

    if (images.length > 1) {
      zip.file(`watermarked_${image.name}`, watermarkedImage);
    } else {
      // For a single image, trigger direct download
      const url = URL.createObjectURL(watermarkedImage);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${image.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    onProgress(((i + 1) / images.length) * 100);
  }

  if (images.length > 1) {
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watermarked_images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};