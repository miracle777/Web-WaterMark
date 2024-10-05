import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Image, Text } from 'react-konva';

interface ImagePreviewProps {
  images: File[];
  watermarkSettings: {
    text: string;
    transparency: number;
    fontSize: number;
    position: { x: number; y: number };
    angle: number;
  };
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, watermarkSettings }) => {
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      const url = URL.createObjectURL(images[0]);
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(400 / img.width, 400 / img.height);
        setDimensions({
          width: img.width * scale,
          height: img.height * scale,
        });
        setImageObj(img);
        setError(null);
      };
      img.onerror = () => {
        setError("Failed to load image. Please try again with a different image.");
      };
      img.src = url;
      imageRef.current = img;

      return () => {
        URL.revokeObjectURL(url);
        if (imageRef.current) {
          imageRef.current.onload = null;
          imageRef.current.onerror = null;
        }
      };
    }
  }, [images]);

  if (error) {
    return <div className="h-64 flex items-center justify-center bg-gray-100 rounded text-red-500">{error}</div>;
  }

  if (!imageObj) {
    return <div className="h-64 flex items-center justify-center bg-gray-100 rounded">No image selected</div>;
  }

  // Calculate the scale factor for the preview
  const scaleFactor = dimensions.width / imageObj.width;

  return (
    <div className="border rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Preview</h3>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          <Image
            image={imageObj}
            width={dimensions.width}
            height={dimensions.height}
          />
          <Text
            text={watermarkSettings.text}
            fontSize={watermarkSettings.fontSize * scaleFactor}
            fill={`rgba(255, 255, 255, ${watermarkSettings.transparency})`}
            x={watermarkSettings.position.x * (dimensions.width / 100)}
            y={watermarkSettings.position.y * (dimensions.height / 100)}
            rotation={watermarkSettings.angle}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default ImagePreview;