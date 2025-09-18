import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import { MessageInputProps, ChatState } from "../types";

function MessageInput({}: MessageInputProps) {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState<string>("");
  const [filePreview, setFilePreview] = useState<{ name: string; type: string; data: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, isSoundEnabled } = useChatStore() as ChatState;

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !filePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      file: filePreview ? {
        name: filePreview.name,
        type: filePreview.type,
        data: filePreview.data
      } : undefined,
    });
    setText("");
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setFilePreview({
      name: file.name,
      type: file.type,
      data: reader.result as string
    });
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {filePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative bg-slate-800/50 rounded-lg border border-slate-700 p-3 flex items-center gap-3">
            {filePreview.type.startsWith("image/") ? (
              <img
                src={filePreview.data}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">
                  {filePreview.type.startsWith("video/") ? "🎥" :
                   filePreview.type.startsWith("audio/") ? "🎵" :
                   filePreview.type.includes("pdf") ? "📄" :
                   filePreview.type.includes("zip") || filePreview.type.includes("rar") ? "📦" :
                   "📎"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">{filePreview.name}</p>
              <p className="text-slate-400 text-xs">{filePreview.type}</p>
            </div>
            <button
              onClick={removeFile}
              className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-600"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 text-slate-200 placeholder:text-slate-400 caret-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/40"
          placeholder="Type your message..."
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            filePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !filePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
