import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import WatermarkControls from './components/WatermarkControls';
import ImagePreview from './components/ImagePreview';
import { Download, Loader2, HelpCircle } from 'lucide-react';
import { processImages } from './utils/imageProcessing';

function App() {
  const [images, setImages] = useState<File[]>([]);
  const [watermarkSettings, setWatermarkSettings] = useState({
    text: 'Sample',
    transparency: 0.5,
    fontSize: 24,
    position: { x: 50, y: 50 },
    angle: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completionMessage, setCompletionMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleImageUpload = (acceptedFiles: File[]) => {
    setImages(acceptedFiles);
    setCompletionMessage('');
  };

  const handleWatermarkChange = (newSettings: Partial<typeof watermarkSettings>) => {
    setWatermarkSettings({ ...watermarkSettings, ...newSettings });
  };

  const handleProcessImages = async () => {
    setProcessing(true);
    setProgress(0);
    setCompletionMessage('');

    try {
      await processImages(images, watermarkSettings, (progress) => {
        setProgress(progress);
      });
      setCompletionMessage('処理が完了しました！画像にウォーターマークが追加されました。');
    } catch (error) {
      console.error('Error processing images:', error);
      setCompletionMessage('画像の処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">画像ウォーターマークアプリ</h1>
        
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <HelpCircle className="mr-2" />
          使い方を{showInstructions ? '隠す' : '表示'}
        </button>

        {showInstructions && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">使い方：</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>1枚または複数の画像を選択またはドラッグ＆ドロップしてアップロードします。</li>
              <li>ウォーターマークの設定（テキスト、透明度、フォントサイズ、位置、角度）を調整します。</li>
              <li>「処理してダウンロード」ボタンをクリックして、ウォーターマークを追加します。</li>
              <li>1枚の画像の場合は直接ダウンロードされ、複数の画像の場合はZIPファイルでダウンロードされます。</li>
              <li>ウォーターマークのテキストは自由に変更できます。プリセットから選択するか、カスタムテキストを入力してください。</li>
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUploader onUpload={handleImageUpload} />
            <WatermarkControls settings={watermarkSettings} onChange={handleWatermarkChange} />
          </div>
          <div>
            <ImagePreview images={images} watermarkSettings={watermarkSettings} />
          </div>
        </div>

        <div className="mt-6">
          {processing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin mb-2" />
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <span>処理中... {progress.toFixed(0)}%</span>
            </div>
          ) : (
            <button
              onClick={handleProcessImages}
              disabled={images.length === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center w-full"
            >
              <Download className="mr-2" />
              {images.length > 1 ? '処理してZIPでダウンロード' : '処理して画像をダウンロード'}
            </button>
          )}
        </div>

        {completionMessage && (
          <div className="mt-4 text-center text-green-600 font-semibold">
            {completionMessage}
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-sm text-gray-600">
        Created by <a href="https://valuer.work/?p=4017" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">masaru21</a>
      </footer>
    </div>
  );
}

export default App;