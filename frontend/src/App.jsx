import { useState } from "react";
import { ocrImage, ocrPdf } from "./api/ocrApi";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOCR = async () => {
    if (!file) return;

    setLoading(true);

    try {
      let response;

      if (file.name.endsWith(".pdf")) {
        response = await ocrPdf(file);
      } else {
        response = await ocrImage(file);
      }

      setResult(response.text);
    } catch (error) {
      console.error(error);
      alert("OCR failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>DeepSeek OCR</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={handleOCR}>
        OCR
      </button>

      <br />
      <br />

      {loading && <p>Processing...</p>}

      <textarea
        value={result}
        readOnly
        rows={25}
        cols={120}
      />
    </div>
  );
}

export default App;