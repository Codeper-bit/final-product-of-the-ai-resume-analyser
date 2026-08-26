import React from 'react';

function Features({ data }) {
    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md space-y-6">

            {/* Score Section */}
            <div className="text-center p-6 bg-indigo-600 text-white rounded-xl">
                <h2 className="text-2xl font-bold">Overall ATS Score</h2>
                <span className="text-6xl font-black block mt-2" >{data?.score} / 100</span>
                <div className="w-full bg-red-200 rounded-full h-4">
                    <div className='bg-green-500 h-4 rounded-full' style={{ width: `${data?.score ?? 0}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths Map Section */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-bold text-green-800 mb-2">💎 Strengths</h3>
                    <ul className="list-disc list-inside space-y-1 text-green-900">
                        {data?.strength?.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses Map Section */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-lg font-bold text-red-800 mb-2">⚠️ Weaknesses</h3>
                    <ul className="list-disc list-inside space-y-1 text-red-900">
                        {data?.weakness?.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Missing Skills Section */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-lg font-bold text-amber-800 mb-3">🛠️ Missing Critical Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {data?.missing_skills?.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-amber-200 text-amber-900 text-sm font-semibold rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Features;