"use client";

import { useState } from "react";
import axios from "axios";

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  hero: {
    background: "linear-gradient(160deg, #ff6b23 0%, #ff8c3a 40%, #ffb347 70%, #fff5ee 100%)",
    padding: "60px 16px 80px",
    textAlign: "center",
    position: "relative" as const,
  },
  heroLogoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    marginBottom: "12px",
  },
  heroLogoIcon: {
    width: "56px",
    height: "56px",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    border: "2px solid rgba(255,255,255,0.5)",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-1px",
    margin: 0,
    textShadow: "0 2px 12px rgba(180,60,0,0.3)",
  },
  heroTitleAccent: {
    color: "#fff5ee",
  },
  heroSubtitle: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.85)",
    marginTop: "10px",
    letterSpacing: "0.04em",
  },
  cardWrapper: {
    maxWidth: "700px",
    margin: "-40px auto 0",
    padding: "0 16px 60px",
    position: "relative" as const,
    zIndex: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #ffe0cc",
    padding: "36px 32px",
    boxShadow: "0 8px 48px rgba(255,107,35,0.15), 0 2px 12px rgba(0,0,0,0.08)",
  },
  tabRow: {
    display: "flex",
    marginBottom: "28px",
    backgroundColor: "#fff5f0",
    borderRadius: "12px",
    padding: "4px",
    border: "1px solid #ffd5bc",
  },
  tabActive: {
    flex: 1,
    padding: "10px 20px",
    borderRadius: "9px",
    border: "none",
    background: "linear-gradient(135deg, #ff6b23, #ff8c3a)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit",
    boxShadow: "0 2px 8px rgba(255,107,35,0.4)",
  },
  tabInactive: {
    flex: 1,
    padding: "10px 20px",
    borderRadius: "9px",
    border: "none",
    backgroundColor: "transparent",
    color: "#cc7a50",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  label: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    color: "#ff6b23",
    marginBottom: "8px",
    display: "block",
  },
  textarea: {
    width: "100%",
    backgroundColor: "#fff8f5",
    border: "1.5px solid #ffd5bc",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    marginBottom: "20px",
    resize: "vertical" as const,
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
    color: "#1a1a1a",
    lineHeight: 1.6,
  },
  fileWrap: {
    backgroundColor: "#fff8f5",
    border: "2px dashed #ffb380",
    borderRadius: "12px",
    padding: "32px",
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  fileEmoji: {
    fontSize: "36px",
    marginBottom: "10px",
  },
  fileHint: {
    fontSize: "13px",
    color: "#cc9070",
    marginTop: "8px",
  },
  fileChosen: {
    fontSize: "13px",
    color: "#ff6b23",
    marginTop: "10px",
    fontWeight: 700,
  },
  select: {
    width: "100%",
    backgroundColor: "#fff8f5",
    border: "1.5px solid #ffd5bc",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    marginBottom: "20px",
    outline: "none",
    boxSizing: "border-box" as const,
    color: "#1a1a1a",
    fontFamily: "inherit",
  },
  submitBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #ff6b23 0%, #ff8c3a 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 20px rgba(255,107,35,0.45)",
    letterSpacing: "0.04em",
  },
  submitBtnDisabled: {
    width: "100%",
    background: "linear-gradient(135deg, #ffb380 0%, #ffc89a 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "not-allowed" as const,
    fontFamily: "inherit",
    letterSpacing: "0.04em",
  },
  errorBox: {
    marginTop: "16px",
    padding: "14px 16px",
    backgroundColor: "#fff0f0",
    border: "1px solid #ffc5c5",
    color: "#cc0000",
    borderRadius: "10px",
    fontSize: "14px",
  },
  resultsSection: {
    marginTop: "32px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, #fff, #ff6b23, #ffb347, #fff)",
    margin: "4px 0 20px",
    borderRadius: "2px",
  },
  resultBlock: {
    backgroundColor: "#fff8f5",
    border: "1px solid #ffd5bc",
    borderRadius: "14px",
    padding: "18px 20px",
    borderLeft: "4px solid #ff6b23",
  },
  resultLabel: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    color: "#ff6b23",
    marginBottom: "10px",
  },
  resultText: {
    fontSize: "15px",
    color: "#333",
    lineHeight: 1.75,
    margin: 0,
  },
  audioPlayer: {
    width: "100%",
    marginTop: "10px",
    accentColor: "#ff6b23",
  },
  footer: {
    textAlign: "center" as const,
    padding: "0 0 40px",
    fontSize: "13px",
    color: "#cc9070",
    letterSpacing: "0.04em",
  },
  footerAccent: {
    color: "#ff6b23",
    fontWeight: 700,
  },
};

export default function Home() {
  const [mode, setMode] = useState<"text" | "audio">("text");
  const [text, setText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("Luganda");
  const [loading, setLoading] = useState(false);

  const [original, setOriginal] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  const clearResults = () => {
    setOriginal(""); setTranscript(""); setSummary("");
    setTranslated(""); setAudioUrl(""); setError("");
  };

  const processText = async () => {
    if (!text.trim()) { setError("Please enter some text before processing."); return; }
    try {
      setLoading(true);
      clearResults();
      const response = await axios.post("http://127.0.0.1:8000/process-text", { text, language });
      setOriginal(response.data.original);
      setSummary(response.data.summary);
      setTranslated(response.data.translated);
      if (response.data.audio_url) setAudioUrl(response.data.audio_url + "?t=" + Date.now());
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail ? `Error: ${detail}` : "Failed to process text. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const processAudio = async () => {
    if (!audioFile) { setError("Please upload an audio file."); return; }
    try {
      setLoading(true);
      clearResults();
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("language", language);
      const response = await axios.post("http://127.0.0.1:8000/process-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTranscript(response.data.transcript);
      setSummary(response.data.summary);
      setTranslated(response.data.translated);
      if (response.data.audio_url) setAudioUrl(response.data.audio_url + "?t=" + Date.now());
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail ? `Error: ${detail}` : "Failed to process audio. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const hasResults = original || transcript || summary || translated || audioUrl;

  return (
    <div style={S.page}>
      {/* Orange gradient hero blending into white */}
      <div style={S.hero}>
        <div style={S.heroLogoRow}>
          <div style={S.heroLogoIcon}>🦅</div>
          <h1 style={S.heroTitle}>
            Sun<span style={S.heroTitleAccent}>Voice</span>
          </h1>
        </div>
        <p style={S.heroSubtitle}>
          Powered by Sunbird AI · Ugandan Language Intelligence
        </p>
      </div>

      {/* Card floats up over the gradient */}
      <div style={S.cardWrapper}>
        <div style={S.card}>
          <div style={S.tabRow}>
            <button
              style={mode === "text" ? S.tabActive : S.tabInactive}
              onClick={() => { setMode("text"); clearResults(); }}
            >
              ✏️ Text Input
            </button>
            <button
              style={mode === "audio" ? S.tabActive : S.tabInactive}
              onClick={() => { setMode("audio"); clearResults(); }}
            >
              🎙️ Audio Upload
            </button>
          </div>

          {mode === "text" ? (
            <>
              <label style={S.label}>Your Text</label>
              <textarea
                style={S.textarea}
                rows={5}
                placeholder="Paste or type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </>
          ) : (
            <>
              <label style={S.label}>Audio File</label>
              <div style={S.fileWrap}>
                <div style={S.fileEmoji}>🎵</div>
                <input
                  type="file"
                  accept=".mp3,.wav,.ogg,.m4a,.aac,.mp4,.webm"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setAudioFile(e.target.files[0]);
                  }}
                />
                <p style={S.fileHint}>.mp3 · .wav · .ogg · .m4a · .aac — max 5 minutes</p>
                {audioFile && <p style={S.fileChosen}>✅ {audioFile.name}</p>}
              </div>
            </>
          )}

          <label style={S.label}>Target Language</label>
          <select style={S.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>Luganda</option>
            <option>Runyankole</option>
            <option>Ateso</option>
            <option>Lugbara</option>
            <option>Acholi</option>
          </select>

          <button
            style={loading ? S.submitBtnDisabled : S.submitBtn}
            onClick={() => (mode === "text" ? processText() : processAudio())}
            disabled={loading}
          >
            {loading ? "⏳ Processing... (may take 1–3 mins)" : "▶ Process"}
          </button>

          {error && <div style={S.errorBox}>⚠️ {error}</div>}

          {hasResults && (
            <div style={S.resultsSection}>
              <div style={S.divider} />

              {original && (
                <div style={S.resultBlock}>
                  <div style={S.resultLabel}>📄 Original Text</div>
                  <p style={S.resultText}>{original}</p>
                </div>
              )}
              {transcript && (
                <div style={S.resultBlock}>
                  <div style={S.resultLabel}>🎙️ Transcript</div>
                  <p style={S.resultText}>{transcript}</p>
                </div>
              )}
              {summary && (
                <div style={S.resultBlock}>
                  <div style={S.resultLabel}>📝 Summary</div>
                  <p style={S.resultText}>{summary}</p>
                </div>
              )}
              {translated && (
                <div style={S.resultBlock}>
                  <div style={S.resultLabel}>🌍 Translated Summary — {language}</div>
                  <p style={S.resultText}>{translated}</p>
                </div>
              )}
              {audioUrl && (
                <div style={S.resultBlock}>
                  <div style={S.resultLabel}>🔊 Generated Audio</div>
                  <audio controls style={S.audioPlayer} key={audioUrl}>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={S.footer}>
        Built with <span style={S.footerAccent}>Sunbird AI</span> · Sunflower LLM · STT · TTS
      </div>
    </div>
  );
}