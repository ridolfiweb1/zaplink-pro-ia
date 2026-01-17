
import React, { useState, useEffect } from 'react';
import { AppState, LinkHistoryItem } from './types';
import { generateWhatsAppLink, cleanPhoneNumber } from './utils/helpers';
import { suggestMessage } from './services/geminiService';
import Button from './components/Button';
import HistoryItem from './components/HistoryItem';
import { Phone } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<AppState>('input');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [history, setHistory] = useState<LinkHistoryItem[]>([]);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zaplink_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (item: LinkHistoryItem) => {
    const newHistory = [item, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('zaplink_history', JSON.stringify(newHistory));
  };

  const handleGenerate = () => {
    if (!phone || cleanPhoneNumber(phone).length < 10) {
      alert('Por favor, insira um número de telefone válido com DDD.');
      return;
    }

    const link = generateWhatsAppLink(phone, message);
    setGeneratedLink(link);

    const newItem: LinkHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      message,
      url: link,
      timestamp: Date.now()
    };

    saveToHistory(newItem);
    setViewState('result');
    setIsCopied(false);
  };

  const handleCopy = async (url: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(url);
      if (id) {
        setCopiedHistoryId(id);
        setTimeout(() => setCopiedHistoryId(null), 2000);
      } else {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const handleAISuggestion = async () => {
    setIsSuggesting(true);
    const suggestion = await suggestMessage(message);
    setMessage(suggestion);
    setIsSuggesting(false);
  };

  const resetForm = () => {
    setViewState('input');
    setPhone('');
    setMessage('');
    setGeneratedLink('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <header className="mb-8 text-center flex flex-col items-center">
          <div className="flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg shadow-black/[0.03] border border-white mb-6 group transition-all hover:scale-105 active:scale-95">
            <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Phone size={28} fill="currentColor" strokeWidth={0} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ZapLink Pro</h1>
          <p className="text-slate-500 mt-2 font-medium">Gere links profissionais para o seu WhatsApp</p>
        </header>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl shadow-black/5 p-6 md:p-8 mb-8 border border-white/20 transition-all duration-300">
          {viewState === 'input' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Número do WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium tracking-wide">+55</span>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700">Mensagem (opcional)</label>
                  <button
                    onClick={handleAISuggestion}
                    disabled={isSuggesting || !phone.trim()}
                    className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={!phone.trim() ? 'Preencha o número primeiro' : ''}
                  >
                    {isSuggesting ? 'Sugerindo...' : '✨ Sugestão IA'}
                  </button>
                </div>
                <textarea
                  placeholder={phone.trim() ? "Ex: Olá! Gostaria de fazer um orçamento." : "Preencha o número primeiro..."}
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!phone.trim()}
                  className="w-full px-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 transition-all resize-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <Button fullWidth onClick={handleGenerate}>
                Gerar Link
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="p-6 bg-emerald-50 rounded-[24px] border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">Link Gerado com Sucesso</p>
                <p className="text-slate-800 font-medium break-all text-sm mb-6 bg-white/50 p-4 rounded-xl border border-emerald-200/50">
                  {generatedLink}
                </p>

                <div className="flex flex-col gap-3">
                  <Button fullWidth onClick={() => handleCopy(generatedLink)}>
                    {isCopied ? (
                      <>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copiar Link
                      </>
                    )}
                  </Button>
                  <Button variant="outline" fullWidth onClick={() => window.open(generatedLink, '_blank')}>
                    Testar no WhatsApp
                  </Button>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors"
              >
                Gerar outro link
              </button>
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="w-full">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1 mb-4">Recentes</h2>
            <div className="space-y-1">
              {history.map((item) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  onCopy={() => handleCopy(item.url, item.id)}
                  isRecentlyCopied={copiedHistoryId === item.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <footer className="mt-12 text-center text-slate-400 text-xs pb-8 space-y-2">
          <p>© 2026 ZapLink Pro. Simples, Rápido e Moderno.</p>
          <p className="flex items-center justify-center gap-1">
            Desenvolvido por
            <a
              href="https://ridolfi.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              <img src="/ridolfi-logo.png" alt="Ridolfi" className="w-5 h-5 rounded" /> Ridolfi - Sistemas & IA
            </a>
          </p>
          <p>Nenhum dado é armazenado em nossos servidores.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
