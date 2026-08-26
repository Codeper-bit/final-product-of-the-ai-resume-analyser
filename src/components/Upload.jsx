import { useState } from "react";

const API_BASE_URL = "https://final-product-of-the-ai-resume-analyser.onrender.com";

function Upload({ setShowResult, setAnalysisData }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_BASE_URL}/analyse`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("API Error Response:", result);
                throw new Error(result.detail || result.error || "Backend error");
            }

            let rawString = result.analysis;
            if (typeof rawString === "string" && rawString.includes("```")) {
                rawString = rawString.replace(/```json/g, "").replace(/```/g, "").trim();
            }

            const parsedData = typeof rawString === "string" ? JSON.parse(rawString) : rawString;

            setAnalysisData(parsedData);
            setShowResult(true);

        } catch (error) {
            console.error("Error connecting to backend API:", error);
            alert(`Failed to analyze resume: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const exportPdf = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/export`, {
                method: "POST",
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                alert(errData.detail || "Failed to export PDF. Please analyze a resume first.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Resume_Report.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export error:", error);
            alert("Error exporting PDF");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-white shadow-sm max-w-md mx-auto my-1">
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
                {loading ? "Analysing..." : "Analyse Resume"}
            </button>

            <button
                onClick={exportPdf}
                className="w-full px-6 py-2 bg-slate-800 text-white font-medium rounded-md hover:bg-slate-900 transition-colors mt-4"
            >
                Export Report
            </button>
        </div>
    );
}

export default Upload;

