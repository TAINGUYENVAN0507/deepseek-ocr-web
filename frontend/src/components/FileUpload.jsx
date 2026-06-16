import { useEffect, useMemo, useState } from "react";

const formatFileSize = (size) => {
  if (!size) return "Unknown size";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

function FileUpload({ file, loading, onFileChange, onSubmit, onClear }) {
  const [dragging, setDragging] = useState(false);

  const isPdf = file?.name?.toLowerCase().endsWith(".pdf");
  const fileKind = isPdf ? "PDF document" : "Image document";
  const previewUrl = useMemo(() => {
    if (!file || isPdf) return "";

    return URL.createObjectURL(file);
  }, [file, isPdf]);

  useEffect(() => {
    if (!previewUrl) return undefined;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const inputId = useMemo(() => `ocr-file-${crypto.randomUUID()}`, []);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  return (
    <section className="panel upload-panel">
      <div className="panel-header">
        <div>
          <h2>Input document</h2>
          <p>Upload an image or a PDF file for OCR extraction.</p>
        </div>
        <span className="status-pill">{file ? fileKind : "Ready"}</span>
      </div>

      <label
        className={`dropzone ${dragging ? "dragging" : ""}`}
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*,.pdf,application/pdf"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />

        {previewUrl ? (
          <img className="image-preview" src={previewUrl} alt="Selected document preview" />
        ) : (
          <div className="dropzone-copy">
            <span className="upload-icon">↑</span>
            <strong>{file ? file.name : "Choose image or PDF"}</strong>
            <span>{file ? formatFileSize(file.size) : "Drag and drop your file here"}</span>
          </div>
        )}
      </label>

      {file && (
        <div className="file-summary">
          <div>
            <span className="file-label">Selected file</span>
            <strong>{file.name}</strong>
          </div>
          <span>{formatFileSize(file.size)}</span>
        </div>
      )}

      <div className="action-row">
        <button
          className="primary-button"
          type="button"
          onClick={onSubmit}
          disabled={!file || loading}
        >
          {loading ? "Processing..." : "Run OCR"}
        </button>
        <button className="secondary-button" type="button" onClick={onClear} disabled={!file || loading}>
          Clear
        </button>
      </div>
    </section>
  );
}

export default FileUpload;
