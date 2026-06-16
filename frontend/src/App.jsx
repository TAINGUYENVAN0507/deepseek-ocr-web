import { useEffect, useMemo, useState } from "react";
import { ocrImage, ocrPdf } from "./api/ocrApi";
import FileUpload from "./components/FileUpload";
import ResultViewer from "./components/ResultViewer";
import "./App.css";

const HISTORY_KEY = "deepseek-ocr-history";

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};

const createHistoryItem = (file, response) => ({
  id: crypto.randomUUID(),
  filename: file.name,
  type: file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image"),
  pages: response.pages || 1,
  text: response.text || "",
  createdAt: new Date().toISOString()
});

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const activeHistory = useMemo(
    () => history.find((item) => item.id === activeHistoryId),
    [activeHistoryId, history]
  );

  const handleOCR = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      let response;

      if (file.name.toLowerCase().endsWith(".pdf")) {
        response = await ocrPdf(file);
      } else {
        response = await ocrImage(file);
      }

      const item = createHistoryItem(file, response);

      setResult(item);
      setHistory((current) => [item, ...current].slice(0, 12));
      setActiveHistoryId(item.id);
    } catch (error) {
      console.error(error);
      setError("OCR failed. Please check your backend connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setFile(null);
    setResult(null);
    setActiveHistoryId(null);
    setError("");
  };

  const handleSelectHistory = (item) => {
    setResult(item);
    setActiveHistoryId(item.id);
    setError("");
  };

  const handleClearHistory = () => {
    setHistory([]);
    setActiveHistoryId(null);
  };

  const displayedResult = activeHistory || result;

  return (
    <div className="app-shell">
      <aside className="history-panel">
        <div className="brand-block">
          <span className="brand-mark">D</span>
          <div>
            <p className="brand-title">DeepSeek OCR</p>
            <p className="brand-subtitle">Document extraction</p>
          </div>
        </div>

        <button className="new-analysis-button" type="button" onClick={handleNewAnalysis}>
          + New OCR
        </button>

        <div className="history-heading">Recent</div>

        <div className="history-list">
          {history.length === 0 ? (
            <p className="empty-history">No OCR history yet.</p>
          ) : (
            history.map((item) => (
              <button
                className={`history-item ${item.id === activeHistoryId ? "active" : ""}`}
                key={item.id}
                type="button"
                onClick={() => handleSelectHistory(item)}
              >
                <span className="history-name">{item.filename}</span>
                <span className="history-meta">
                  {item.pages} page{item.pages > 1 ? "s" : ""} ·{" "}
                  {new Date(item.createdAt).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit"
                  })}
                </span>
              </button>
            ))
          )}
        </div>

        <button
          className="clear-history-button"
          type="button"
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          Clear history
        </button>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <h1>DeepSeek OCR</h1>
        </header>

        <section className="content-grid">
          <FileUpload
            file={file}
            loading={loading}
            onFileChange={setFile}
            onSubmit={handleOCR}
            onClear={() => setFile(null)}
          />

          <ResultViewer
            result={displayedResult}
            loading={loading}
            error={error}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
