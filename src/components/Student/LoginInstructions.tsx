import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  AlertCircle, 
  History, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Clock, 
  FileText,
  Sparkles,
  HelpCircle,
  UserCheck,
  Building2,
  SlidersHorizontal
} from 'lucide-react';

interface LoginInstructionsProps {
  onLogin: (sbd: string, code: string, reviewPrevious: boolean) => void;
}

export const LoginInstructions: React.FC<LoginInstructionsProps> = ({ onLogin }) => {
  const [sbd, setSbd] = useState('');
  const [examCode, setExamCode] = useState('IELTS01');
  const [reviewPrevious, setReviewPrevious] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeCode = examCode.trim().toUpperCase();

  // Mode detection math: (digits % 2 !== 0) -> TEST, (digits % 2 === 0) -> PRACTICE
  const calculateMode = (codeStr: string): 'TEST' | 'PRACTICE' => {
    if (codeStr.startsWith('TEST')) return 'TEST';
    if (codeStr.startsWith('PRAC')) return 'PRACTICE';
    
    const digits = codeStr.replace(/\D/g, '');
    if (digits.length > 0) {
      const num = parseInt(digits, 10);
      return num % 2 !== 0 ? 'TEST' : 'PRACTICE';
    }
    const charSum = codeStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return charSum % 2 !== 0 ? 'TEST' : 'PRACTICE';
  };

  const detectedMode = calculateMode(activeCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSbd = sbd.trim();
    const cleanCode = activeCode.trim();

    if (!cleanSbd) {
      setErrorMsg('Vui lòng nhập Số Báo Danh (SBD) của bạn.');
      return;
    }
    if (!cleanCode) {
      setErrorMsg('Vui lòng nhập Mã Đề Thi.');
      return;
    }

    // Direct Admin Redirection Check
    if (cleanSbd.toUpperCase() === 'ADMIN123' && cleanCode.toUpperCase() === 'ADMIN123') {
      window.location.href = 'admin.html';
      return;
    }

    setErrorMsg('');
    onLogin(cleanSbd, cleanCode, reviewPrevious);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      
      {/* Material Design 3 Hero Surface Container */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-[28px] p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 text-left max-w-2xl">
            {/* M3 Assist Chip */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>EO EO Testing • Online Examination System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Đăng Nhập Phòng Thi &amp; Hướng Dẫn Kỹ Thuật
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nhập Số Báo Danh và Mã Đề Thi để khởi tạo phiên thi độc nhất. Thuật toán tự động phân luồng <strong className="text-amber-300">Mã Lẻ = TEST MODE</strong> và <strong className="text-emerald-300">Mã Chẵn = PRACTICE MODE</strong>.
            </p>
          </div>

          {/* M3 Mode Indicator Chips */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <div className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-950/80 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-slate-300">TEST MODE</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[11px] font-bold rounded-md">Mã Lẻ</span>
            </div>

            <div className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-950/80 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-slate-300">PRACTICE MODE</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-md">Mã Chẵn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* M3 Form Card */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-[28px] p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>Xác Thực Thí Sinh</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Nhập SBD &amp; Mã Đề Thi để bắt đầu</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center space-x-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* M3 Outlined Input 1: SBD */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Số Báo Danh (SBD) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sbd}
                    onChange={(e) => setSbd(e.target.value)}
                    placeholder="VD: TS12345"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* M3 Outlined Input 2: Exam Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Mã Đề Thi <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="VD: IELTS01, TEST01, PRAC02..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                  <SlidersHorizontal className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Mode Preview M3 Container */}
              <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[11px]">Chế độ nhận diện:</span>
                  <span className="font-bold text-white text-sm tracking-wide">{activeCode}</span>
                </div>
                <div>
                  {activeCode === 'ADMIN123' ? (
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      ADMIN MODE
                    </span>
                  ) : detectedMode === 'TEST' ? (
                    <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      TEST (Mã Lẻ)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      PRACTICE (Mã Chẵn)
                    </span>
                  )}
                </div>
              </div>

              {/* PRACTICE Mode Option: Review Previous Submission Checkbox (M3 Style) */}
              {detectedMode === 'PRACTICE' && activeCode !== 'ADMIN123' && (
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-2">
                  <label className="flex items-center space-x-2.5 text-xs font-medium text-emerald-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={reviewPrevious}
                      onChange={(e) => setReviewPrevious(e.target.checked)}
                      className="w-4 h-4 rounded-md border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 accent-emerald-500 cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5 font-bold">
                      <History className="w-4 h-4 text-emerald-400" />
                      Xem lại bài làm đã nộp (Lịch sử thi)
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-400 pl-6 leading-tight">
                    Bật checkbox này để mở lại toàn bộ điểm số, bài viết và đáp án lịch sử đã từng nộp với SBD &amp; Mã đề này.
                  </p>
                </div>
              )}

              {/* M3 Filled Primary Action Button */}
              <button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
              >
                <span>{activeCode === 'ADMIN123' ? 'Vào Màn Hình Quản Trị' : 'Bắt Đầu Phiên Thi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Regulations & Technical Guidelines */}
        <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-[28px] p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Quy Định Khảo Thí &amp; Hướng Dẫn Kỹ Thuật</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Thí sinh cần đọc kỹ quy trình 3 kỹ năng trước khi bắt đầu</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-2 text-amber-300 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>1. Giám Sát Tự Động (Proctoring - TEST MODE)</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  Ở chế độ Mã Lẻ (TEST MODE), hệ thống tự động bật chế độ Fullscreen, vô hiệu hóa chuột phải (contextmenu) và phím F12. Mọi hành vi chuyển tab (blur) đều được lưu log. Vi phạm 3 lần sẽ bị khóa bài 30 giây.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>2. Kỹ Năng Nghe (Listening) &amp; Khóa Thanh Tua</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  File âm thanh tự động khóa tính năng tua (NO SEEKING) và nút Play chỉ được kích hoạt 1 lần duy nhất theo chuẩn thi IELTS chuẩn quốc tế.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-2 text-blue-300 font-bold">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>3. Kỹ Năng Đọc (Reading) &amp; Split-Screen</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  Màn hình chia đôi 50:50 cho phép vừa đọc đoạn văn bên trái vừa trả lời câu hỏi bên phải. Tích hợp công cụ <strong>Multi-Color Highlighter</strong> bôi đen 3 màu (Vàng, Lục, Lam).
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-2 text-purple-300 font-bold">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>4. Kỹ Năng Viết (Writing) &amp; Tự Động Lưu Nháp</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  Khung nhập liệu cấm hoàn toàn thao tác Dán (Paste), tắt spellcheck, đếm từ realtime chính xác và liên tục lưu bài làm vào LocalStorage chống mất dữ liệu khi mất mạng.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hệ thống sẵn sàng. Nhập SBD và bấm Bắt Đầu để làm bài!</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

