/**
 * DocumentViewer Component
 *
 * Markdown 문서를 렌더링하는 컴포넌트
 *
 * @example
 * <DocumentViewer
 *   isOpen={true}
 *   onClose={() => {}}
 *   title="아키텍처 문서"
 *   filePath="/ARCHITECTURE.md"
 * />
 */

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { X, FileText } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filePath: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  title,
  filePath,
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && filePath) {
      setIsLoading(true);
      setError(null);

      // 백엔드 API를 통해 파일 내용 가져오기
      fetch(`http://localhost:8000/api/v1/docs?path=${encodeURIComponent(filePath)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('문서를 불러올 수 없습니다.');
          }
          return response.text();
        })
        .then(text => {
          setContent(text);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [isOpen, filePath]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 pt-24">
      <div className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/80 transition-all group"
          >
            <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
              <p className="text-rose-600 font-medium">{error}</p>
            </div>
          )}

          {!isLoading && !error && content && (
            <div className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
