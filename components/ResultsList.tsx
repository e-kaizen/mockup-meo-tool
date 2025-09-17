
import React from 'react';
import type { PlaceResult } from '../types';
import BusinessCard from './BusinessCard';

interface ResultsListProps {
  results: PlaceResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">分析結果</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result) => (
          <BusinessCard key={result.place.id} result={result} />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
