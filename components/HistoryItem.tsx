
import React from 'react';
import { LinkHistoryItem } from '../types';
import { formatDisplayPhone } from '../utils/helpers';
import { MessageSquare, Phone, Copy, Check } from 'lucide-react';

interface HistoryItemProps {
  item: LinkHistoryItem;
  onCopy: (url: string) => void;
  isRecentlyCopied: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onCopy, isRecentlyCopied }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Phone size={14} />
          <span>{formatDisplayPhone(item.phone)}</span>
        </div>
        <button 
          onClick={() => onCopy(item.url)}
          className={`p-2 rounded-xl transition-colors ${isRecentlyCopied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
        >
          {isRecentlyCopied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="flex items-start gap-2">
        <MessageSquare size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
        <p className="text-slate-700 text-sm line-clamp-2 italic">
          "{item.message || 'Sem mensagem'}"
        </p>
      </div>
    </div>
  );
};

export default HistoryItem;

// Mock icons if lucide-react is not available, but let's assume it's standard for this build.
// Using SVG icons directly for robustness.
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
