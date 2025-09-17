import React, { useState, useCallback } from 'react';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import LoadingSpinner from './components/LoadingSpinner';
import { searchPlaces } from './services/placesService';
import { analyzePlaceMEO, translateText } from './services/analysisService';
import { checkGbpRegistration } from './services/gbpService'; // 判定ロジックを外部サービスからインポート
import type { Place, PlaceResult } from './types';

const App: React.FC = () => {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (textQuery: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const places = await searchPlaces(textQuery);
      if (places.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const analysisPromises = places.map(async (place: Place) => {
        // Step 1: GBP登録状況をチェック (外部サービスを呼び出す)
        const isGbpVerified = await checkGbpRegistration(place.googleMapsUri);

        // Step 2: GBPの状況をインプットとしてMEO分析を実行
        const analysis = await analyzePlaceMEO(place, isGbpVerified);
        
        // Step 3: 必要であればレビューを翻訳
        let translatedReview: string | undefined = undefined;
        if (place.reviewSummary && place.reviewSummary.languageCode !== 'ja') {
          translatedReview = await translateText(place.reviewSummary.text);
        }

        return { place, analysis, translatedReview, gbpVerified: isGbpVerified };
      });

      const settledResults = await Promise.all(analysisPromises);
      setResults(settledResults);

    } catch (err) {
      console.error('An error occurred during search and analysis:', err);
      setError('データの取得または分析中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">MEO対策 競合分析ツール</h1>
          <p className="mt-1 text-sm text-slate-500">
            指定した地域の競合店舗を分析し、MEO営業のヒントを得ましょう。
          </p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="max-w-xl mx-auto mb-8">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
            
            {isLoading && (
              <div className="text-center">
                <LoadingSpinner />
                <p className="text-slate-600">競合店舗を分析中... (最大1分程度かかる場合があります)</p>
              </div>
            )}

            {error && (
              <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {!isLoading && hasSearched && results.length === 0 && !error && (
              <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-md">
                指定された条件に一致する店舗が見つかりませんでした。
              </div>
            )}
            
            {!isLoading && results.length > 0 && <ResultsList results={results} />}
          </div>
        </div>
      </main>
       <footer className="bg-white mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>&copy; 2024 MEO Analysis Tool. For demonstration purposes only.</p>
          <p className="mt-1">Powered by Google Places API & Gemini API</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
