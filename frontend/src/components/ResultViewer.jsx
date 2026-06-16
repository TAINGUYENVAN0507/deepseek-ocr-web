const downloadFile = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

const buildBaseName = (result) => {
  if (!result?.filename) return "ocr-result";

  return result.filename.replace(/\.[^/.]+$/, "") || "ocr-result";
};

function ResultViewer({ result, loading, error }) {
  const text = result?.text || "";
  const hasResult = Boolean(text);

  const handleDownloadText = () => {
    downloadFile(`${buildBaseName(result)}.txt`, text, "text/plain;charset=utf-8");
  };

  const handleDownloadMarkdown = () => {
    downloadFile(`${buildBaseName(result)}.md`, text, "text/markdown;charset=utf-8");
  };

  const handleDownloadJson = () => {
    downloadFile(
      `${buildBaseName(result)}.json`,
      JSON.stringify(result, null, 2),
      "application/json;charset=utf-8"
    );
  };

  return (
    <section className="panel result-panel">
      <div className="panel-header">
        <div>
          <h2>OCR output</h2>
          <p>{hasResult ? `${result.filename} · ${result.pages} page${result.pages > 1 ? "s" : ""}` : "Result preview"}</p>
        </div>
        <span className={`status-pill ${hasResult ? "success" : ""}`}>
          {loading ? "Running" : hasResult ? "Complete" : "Waiting"}
        </span>
      </div>

      <div className={`output-box ${!hasResult ? "empty" : ""}`}>
        {loading ? (
          <div className="state-message">
            <span className="loader" />
            <strong>Extracting text...</strong>
            <span>This may take a moment for large PDF files.</span>
          </div>
        ) : error ? (
          <div className="state-message error-message">
            <strong>Unable to process file</strong>
            <span>{error}</span>
          </div>
        ) : hasResult ? (
          <pre>{text}</pre>
        ) : (
          <div className="state-message">
            <strong>No OCR result yet</strong>
            <span>Upload an image or PDF, then run OCR.</span>
          </div>
        )}
      </div>

      <div className="download-row">
        <button type="button" onClick={handleDownloadText} disabled={!hasResult}>
          Download TXT
        </button>
        <button type="button" onClick={handleDownloadMarkdown} disabled={!hasResult}>
          Download MD
        </button>
        <button type="button" onClick={handleDownloadJson} disabled={!hasResult}>
          Download JSON
        </button>
      </div>
    </section>
  );
}

export default ResultViewer;
