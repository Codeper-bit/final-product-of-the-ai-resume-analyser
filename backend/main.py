from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz
import io
import os
import json
from groq import Groq
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

load_dotenv()

last_analysis = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.get("/")
async def root():
    return {"status": "AI Resume Analyzer API is active"}


@app.post("/analyse")
async def ai_analyser(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an ATS resume analyser. You must respond ONLY with raw, valid JSON. "
                        "Do NOT wrap the JSON inside markdown tags like ```json ... ```. "
                        "Do NOT provide conversational text or commentary."
                    )
                },
                {
                    "role": "user",
                    "content": f"""
                            Analyse this resume.
                            Return ONLY a valid JSON object matching this exact schema:
                            {{
                                "score": 0,
                                "strength": [],
                                "weakness": [],
                                "missing_skills": [],
                                "job_match": [],
                                "suggestions": []
                            }}
                            Resume content:
                            {text}
                        """
                }
            ],
            temperature=0
        )
        global last_analysis
        raw_content = response.choices[0].message.content
        last_analysis = json.loads(raw_content)
        return {"analysis": raw_content}

    except Exception as e:
        print("Backend Error:", str(e))
        # Raise HTTP 500 so fetch() in React detects response.ok === false
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/export")
async def export():
    global last_analysis

    if not last_analysis:
        raise HTTPException(status_code=400, detail="No analysis found")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()

    story = [
        Paragraph("Resume Analysis Report", styles["Heading1"]),
        Paragraph(
            f"ATS Score: {last_analysis.get('score', 0)}", styles["Normal"]),
        Paragraph(
            f"Job Match: {', '.join(last_analysis.get('job_match', []))}", styles["Normal"]),
        Paragraph(
            f"Strength: {', '.join(last_analysis.get('strength', []))}", styles["Normal"]),
        Paragraph(
            f"Weakness: {', '.join(last_analysis.get('weakness', []))}", styles["Normal"]),
        Paragraph(
            f"Missing Skills: {', '.join(last_analysis.get('missing_skills', []))}", styles["Normal"]),
        Paragraph(
            f"Suggestions: {', '.join(last_analysis.get('suggestions', []))}", styles["Normal"])
    ]

    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Resume_Report.pdf"}
    )
