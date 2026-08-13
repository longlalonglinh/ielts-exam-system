import React, { useState, useRef } from 'react';
import { HighlightingTool, Question } from '../../types';
import { Paintbrush, Eraser, MoveHorizontal, CheckCircle } from 'lucide-react';

interface ReadingModuleProps {
  passageTitle?: string;
  passageText: string;
  questions: Question[];
  userAnswers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}

export const ReadingModule: React.FC<ReadingModuleProps> = ({
  passageTitle,
  passageText,
  questions,
  userAnswers,
  onAnswerChange
}) => {
  const [leftWidth, setLeftWidth] = useState(50); // 50% split default
  const [isResizing, setIsResizing] = useState(false);
  const [activeColor, setActiveColor] = useState<'yellow' | 'green' | 'blue'>('yellow');
  const [highlights, setHighlights] = useState<HighlightingTool[]>([]);
  const passageContainerRef = useRef<HTMLDivElement | null>(null);

  // Handle Resizer Drag
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth >= 20 && newWidth <= 80) {
      setLeftWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Multi-color highlighter logic
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 2) return;

    const colorHexMap = {
      yellow: '#fef08a', // Tailwind yellow-200
      green: '#86efac',  // Tailwind green-300
      blue: '#93c5fd',   // Tailwind blue-300
    };

    const newHighlight: HighlightingTool = {
      id: 'hl_' + Date.now(),
      text: selectedText,
      color: activeColor,
      color_hex: colorHexMap[activeColor],
    };

    setHighlights((prev) => [...prev, newHighlight]);
    selection.removeAllRanges(); // clear selection box
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const clearAllHighlights = () => {
    setHighlights([]);
  };

  // Helper to render passage with highlighted spans
  const renderHighlightedPassage = () => {
    if (highlights.length === 0) {
      return <div className="whitespace-pre-wrap leading-relaxed text-[#2D1E4B] font-serif text-base font-medium">{passageText}</div>;
    }

    // Replace highlighted terms safely
    let htmlContent = passageText;
    highlights.forEach((hl) => {
      const regex = new RegExp(`(${hl.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      htmlContent = htmlContent.replace(
        regex,
        `<mark style="background-color: ${hl.color_hex}; color: #0f172a; padding: 2px 4px; border-radius: 4px; font-weight: 600;">$1</mark>`
      );
    });

    return (
      <div
        className="whitespace-pre-wrap leading-relaxed text-[#2D1E4B] font-serif text-base font-medium"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  return (
    <div
      className="flex flex-col md:flex-row h-[calc(100vh-10rem)] bg-white rounded-3xl border border-purple-100/80 overflow-hidden shadow-xl shadow-purple-950/5 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      
      {/* LEFT COLUMN: PASSAGE & MULTI-COLOR HIGHLIGHTER */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="h-full flex flex-col bg-[#F8F6FC] border-r border-purple-100 overflow-hidden"
      >
        {/* Toolbar Header */}
        <div className="p-3.5 bg-white border-b border-purple-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Paintbrush className="w-4 h-4 text-[#6B51A5]" />
            <span className="text-xs font-extrabold text-[#3C2A63] uppercase tracking-wider">Multi-Color Highlighter:</span>
            
            {/* Color Pickers */}
            <div className="flex items-center space-x-1.5 ml-2">
              <button
                type="button"
                onClick={() => setActiveColor('yellow')}
                className={`w-6 h-6 rounded-full bg-yellow-300 border-2 transition ${
                  activeColor === 'yellow' ? 'border-[#3C2A63] scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                title="Highlight Vàng"
              />
              <button
                type="button"
                onClick={() => setActiveColor('green')}
                className={`w-6 h-6 rounded-full bg-green-400 border-2 transition ${
                  activeColor === 'green' ? 'border-[#3C2A63] scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                title="Highlight Lục"
              />
              <button
                type="button"
                onClick={() => setActiveColor('blue')}
                className={`w-6 h-6 rounded-full bg-blue-400 border-2 transition ${
                  activeColor === 'blue' ? 'border-[#3C2A63] scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                title="Highlight Lam"
              />
            </div>
          </div>

          {highlights.length > 0 && (
            <button
              onClick={clearAllHighlights}
              className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition"
            >
              <Eraser className="w-3 h-3" />
              Xóa {highlights.length} Highlight
            </button>
          )}
        </div>

        {/* Scrollable Passage Content */}
        <div
          ref={passageContainerRef}
          onMouseUp={handleTextSelection}
          className="flex-1 p-6 overflow-y-auto select-text font-serif leading-loose text-[#3C2A63]"
        >
          <h2 className="text-lg font-extrabold text-[#3C2A63] font-sans mb-4 border-b border-purple-100 pb-2">
            {passageTitle || 'Reading Passage'}
          </h2>
          {renderHighlightedPassage()}
        </div>

        {/* Active Highlight Chips */}
        {highlights.length > 0 && (
          <div className="p-3 bg-white border-t border-purple-100 max-h-24 overflow-y-auto flex flex-wrap gap-1.5 text-xs shrink-0">
            {highlights.map((hl) => (
              <span
                key={hl.id}
                className="px-2.5 py-1 rounded-xl text-slate-950 font-bold flex items-center gap-1 shadow-sm"
                style={{ backgroundColor: hl.color_hex }}
              >
                <span className="max-w-[120px] truncate">{hl.text}</span>
                <button
                  onClick={() => handleRemoveHighlight(hl.id)}
                  className="hover:text-rose-700 font-black ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* DRAGGABLE RESIZER BAR */}
      <div
        onMouseDown={handleMouseDown}
        className="w-2 bg-[#E2DDEC] hover:bg-[#6B51A5] cursor-col-resize flex items-center justify-center border-x border-purple-100 transition-all"
        title="Kéo thả để chia đôi màn hình 50:50"
      >
        <MoveHorizontal className="w-3 h-3 text-[#7C68A5]" />
      </div>

      {/* RIGHT COLUMN: READING QUESTIONS */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="h-full flex flex-col bg-white overflow-hidden"
      >
        <div className="p-3.5 bg-[#F8F6FC] border-b border-purple-100 flex items-center justify-between shrink-0">
          <span className="text-xs font-extrabold text-[#3C2A63] uppercase tracking-wider">
            Câu Hỏi Đọc ({questions.length} câu)
          </span>
          <span className="text-xs text-[#7C68A5] font-medium">Cuộn độc lập</span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {questions.length === 0 ? (
            <p className="text-sm text-[#7C68A5] italic">Chưa có câu hỏi đọc trong đề thi này.</p>
          ) : (
            questions.map((q) => (
              <div
                key={q.question_id}
                className="p-5 bg-[#F8F6FC] border border-purple-100 rounded-2xl space-y-3 hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-extrabold text-[#3C2A63] text-sm leading-relaxed">
                    {q.question_text}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-[#503A7A] font-extrabold border border-purple-200 shrink-0">
                    Max: {q.max_score || 1} pt
                  </span>
                </div>

                {/* Multiple Choice Options */}
                {q.question_type === 'multiple_choice' && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const optLetter = opt.charAt(0);
                      const isSelected = userAnswers[q.question_id] === optLetter;
                      return (
                        <label
                          key={opt}
                          className={`flex items-center space-x-3 p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#6B51A5] border-[#6B51A5] text-white font-bold shadow-md'
                              : 'bg-[#E2DDEC] border-purple-200/80 text-[#3C2A63] hover:bg-[#D9D3E4]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.question_id}`}
                            value={optLetter}
                            checked={isSelected}
                            onChange={() => onAnswerChange(q.question_id, optLetter)}
                            className="w-4 h-4 text-[#6B51A5] bg-white border-purple-300 focus:ring-[#6B51A5]"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Fill in the blank */}
                {q.question_type === 'fill_in_blank' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={userAnswers[q.question_id] || ''}
                      onChange={(e) => onAnswerChange(q.question_id, e.target.value)}
                      placeholder="Nhập từ cần điền (VD: LITHIUM-ION)..."
                      className="w-full px-4 py-3 bg-[#E2DDEC] border border-purple-200 rounded-2xl text-xs text-[#3C2A63] font-medium placeholder-[#7C68A5] focus:outline-none focus:ring-2 focus:ring-[#6B51A5] transition-all"
                    />
                  </div>
                )}

                {/* True / False / Not Given */}
                {q.question_type === 'true_false_not_given' && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['TRUE', 'FALSE', 'NOT GIVEN'].map((choice) => {
                      const isSelected = userAnswers[q.question_id] === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => onAnswerChange(q.question_id, choice)}
                          className={`px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#6B51A5] text-white border-[#6B51A5] shadow-md'
                              : 'bg-[#E2DDEC] border-purple-200 text-[#3C2A63] hover:bg-[#D9D3E4]'
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
