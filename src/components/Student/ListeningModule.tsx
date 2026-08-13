import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, Lock, Headphones, VolumeX, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Question } from '../../types';

interface ListeningModuleProps {
  audioUrl: string;
  audioTitle?: string;
  questions: Question[];
  userAnswers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  onSectionComplete?: () => void;
}

export const ListeningModule: React.FC<ListeningModuleProps> = ({
  audioUrl,
  audioTitle,
  questions,
  userAnswers,
  onAnswerChange,
  onSectionComplete
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [maxPlayedTime, setMaxPlayedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isAudioEnded, setIsAudioEnded] = useState(false);

  // Prevent seeking beyond maxPlayedTime
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    
    // Strict NO SEEKING: if user attempts to seek forward beyond allowed max time
    if (cur > maxPlayedTime + 1.5) {
      audioRef.current.currentTime = maxPlayedTime;
    } else if (cur > maxPlayedTime) {
      setMaxPlayedTime(cur);
    }
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handlePlayClick = () => {
    if (!audioRef.current) return;

    if (!hasPlayedOnce) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasPlayedOnce(true); // LOCK PLAY BUTTON PERMANENTLY AFTER FIRST PLAY
      }).catch((err) => {
        console.error('Audio play error:', err);
      });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsAudioEnded(true);
    if (onSectionComplete) {
      onSectionComplete();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* LOCKED AUDIO PLAYER WITH WAVEFORM */}
      <div className="bg-white border border-purple-100/80 rounded-3xl p-6 shadow-xl shadow-purple-950/5 relative overflow-hidden backdrop-blur">
        
        {/* Hidden Audio Tag */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          controlsList="nodownload no-seeking"
          className="hidden"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left: Info */}
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 animate-pulse'
                : hasPlayedOnce
                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                : 'bg-[#E2DDEC] text-[#3C2A63] border border-purple-200'
            }`}>
              {isPlaying ? (
                <Volume2 className="w-6 h-6 text-emerald-700 animate-bounce" />
              ) : hasPlayedOnce ? (
                <Lock className="w-6 h-6 text-rose-700" />
              ) : (
                <Headphones className="w-6 h-6 text-[#6B51A5]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-[#503A7A] font-extrabold border border-purple-200">
                  LISTENING AUDIO
                </span>
                <span className="text-xs text-[#7C68A5] flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-rose-500" />
                  No Seeking (Khóa thanh tua & Chỉ phát 1 lần)
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#3C2A63] mt-1">
                {audioTitle || 'IELTS Official Listening Test Stream'}
              </h3>
            </div>
          </div>

          {/* Center: Play Button & Status */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayClick}
              disabled={hasPlayedOnce}
              className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md ${
                !hasPlayedOnce
                  ? 'bg-[#6B51A5] hover:bg-[#583F8F] text-white shadow-purple-900/15 cursor-pointer active:scale-95'
                  : 'bg-[#E2DDEC] text-[#7C68A5] border border-purple-200 cursor-not-allowed'
              }`}
            >
              {!hasPlayedOnce ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>BẤM ĐỂ PHÁT AUDIO</span>
                </>
              ) : isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce text-emerald-600" />
                  <span className="text-emerald-700">ĐANG PHÁT (ĐÃ KHÓA)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-rose-500" />
                  <span>ĐÃ PHÁT XONG (LOCKED)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Waveform Bar & Progress Display */}
        <div className="mt-6 pt-4 border-t border-purple-100">
          <div className="flex items-center justify-between text-xs text-[#503A7A] mb-2 font-medium">
            <span>Thời gian audio: <strong className="text-[#3C2A63] font-bold">{formatTime(currentTime)}</strong> / {formatTime(duration)}</span>
            {isAudioEnded && (
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Hoàn thành Audio bài nghe
              </span>
            )}
          </div>

          {/* Custom Animated Waveform */}
          <div className="relative w-full h-9 bg-[#E2DDEC] rounded-xl border border-purple-200/80 overflow-hidden flex items-center px-2 space-x-1">
            {/* Progress Fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#6B51A5]/25 border-r-2 border-[#6B51A5] transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />

            {/* Simulated Animated Wave Bars */}
            {Array.from({ length: 48 }).map((_, idx) => {
              const barHeight = isPlaying ? Math.max(20, Math.sin(idx + currentTime * 5) * 80 + 50) : 30;
              const isPast = (idx / 48) <= (currentTime / (duration || 1));
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-all duration-150 z-10 ${
                    isPast ? 'bg-[#6B51A5]' : 'bg-purple-200/70'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#7C68A5] mt-2 font-medium">
            <span className="flex items-center gap-1 text-rose-600 font-semibold">
              <AlertTriangle className="w-3 h-3" />
              Thí sinh tuyệt đối không thể tua hoặc nghe lại sau khi phát.
            </span>
            <span className="font-bold">Khóa thanh tua: ACTIVE</span>
          </div>
        </div>

      </div>

      {/* LISTENING QUESTIONS SECTION */}
      <div className="bg-white border border-purple-100/80 rounded-3xl p-6 shadow-xl shadow-purple-950/5">
        <h3 className="text-lg font-extrabold text-[#3C2A63] mb-4 flex items-center gap-2 border-b border-purple-100 pb-3">
          <span>Câu Hỏi Bài Thi Nghe ({questions.length} câu)</span>
        </h3>

        {questions.length === 0 ? (
          <p className="text-sm text-[#7C68A5] italic">Chưa có câu hỏi nghe trong đề thi này.</p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
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

                {/* Fill in the blank / Text Answer */}
                {q.question_type === 'fill_in_blank' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={userAnswers[q.question_id] || ''}
                      onChange={(e) => onAnswerChange(q.question_id, e.target.value)}
                      placeholder="Nhập đáp án của bạn (VD: 12 MONTHS)..."
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
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
