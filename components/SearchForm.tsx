import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (textQuery: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [textQuery, setTextQuery] = useState('新宿の居酒屋');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textQuery.trim()) {
      onSearch(textQuery);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="textQuery" className="block text-sm font-medium text-slate-700 mb-1">
            場所とキーワード
          </label>
          <input
            type="text"
            id="textQuery"
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder="例: 渋谷駅周辺のカフェ"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !textQuery.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '分析中...' : '分析を開始'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
