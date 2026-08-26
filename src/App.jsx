import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Upload from "./components/Upload";
import Features from "./components/features";
import { useState } from "react";

function App() {
  const [showResult, setShowResult] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <>
      <Navbar />
      <Hero />
      <Upload setShowResult={setShowResult}
        setAnalysisData={setAnalysisData}
      />
      {showResult && analysisData && (<Features data={analysisData} />)}

    </>
  );
} export default App;