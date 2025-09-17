import React from 'react';
import type { PlaceResult } from '../types';

interface BusinessCardProps {
  result: PlaceResult;
}

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const width = `${score * 10}%`;
  const color = score >= 8 ? 'bg-emerald-500' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width }}></div>
    </div>
  );
};

const GbpStatus: React.FC<{ verified: boolean }> = ({ verified }) => {
    const text = verified ? 'GBP登録済み' : 'GBP未登録の可能性';
    const styles = verified 
        ? 'bg-green-100 text-green-800' 
        : 'bg-orange-100 text-orange-800';
    const icon = verified ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
          <path fillRule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
    );

    return (
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${styles} flex-shrink-0`}>
            {icon}
            {text}
        </span>
    );
};

const BusinessCard: React.FC<BusinessCardProps> = ({ result }) => {
  const { place, analysis, translatedReview, gbpVerified } = result;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-shadow hover:shadow-2xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold text-slate-900 pr-2">{place.displayName.text}</h3>
          <GbpStatus verified={gbpVerified} />
        </div>
        
        <div className="flex items-center text-sm text-slate-500">
            <p>{place.formattedAddress}</p>
             {place.googleMapsUri && (
                <a 
                  href={place.googleMapsUri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Googleマップで開く"
                  className="ml-2 text-indigo-600 hover:text-indigo-800 flex items-center flex-shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-0.5"><path d="m10.22 3.22.015.015.015-.015a3.5 3.5 0 0 1 4.95 0l.015.015.015-.015a3.5 3.5 0 0 1 4.95 4.95l-.015.015-.015-.015a3.5 3.5 0 0 1-4.95 4.95l-7 7a3.5 3.5 0 0 1-4.95-4.95l.015-.015.015.015a3.5 3.5 0 0 1 4.95-4.95l7-7Zm-2.12 2.12-5.585 5.585a1.5 1.5 0 0 0 2.12 2.122l5.585-5.585a1.5 1.5 0 0 0-2.12-2.122Z" /></svg>
                    <span>Map</span>
                </a>
            )}
        </div>
        
        <div className="flex items-center space-x-4 mt-4 text-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400 mr-1">
              <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.755 4.14.602c.725.105 1.015.992.49 1.503l-2.995 2.919.707 4.123c.124.723-.63.1.28l-3.702-1.946-3.702 1.946c-.63.33-.86-.557-.737-1.28l.707-4.123-2.995-2.919c-.525-.511-.235-1.398.49-1.503l4.14-.602 1.83-3.755Z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{place.rating ?? 'N/A'}</span>
            <span className="text-slate-500 ml-1">({place.userRatingCount ?? 0}件)</span>
          </div>
        </div>

        {place.reviewSummary && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 italic">"{place.reviewSummary.text}"</p>
            {translatedReview && (
              <p className="text-sm text-indigo-700 mt-2 pt-2 border-t border-slate-200">
                <span className="font-semibold">翻訳:</span> "{translatedReview}"
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-50/70 p-6 border-t border-slate-200">
        <h4 className="text-lg font-semibold mb-3">MEO分析レポート</h4>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">MEOスコア</span>
                <span className="text-sm font-bold text-slate-800">{analysis.meoScore} / 10</span>
            </div>
            <ScoreBar score={analysis.meoScore} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                    <h5 className="font-semibold text-green-700 mb-2">強み</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {analysis.strengths.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-red-700 mb-2">改善点</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {analysis.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
