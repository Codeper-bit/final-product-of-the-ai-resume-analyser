function Navbar() {
    return (
        <nav className="flex justify-between items-center px-8 py-5 shadow-md">
            <h1 className="text-2xl font-bold">
                AI Resume Analyzer
            </h1>

            <ul className="flex gap-6">
                <li className="cursor-pointer hover:text-blue-600">
                    Home
                </li>

                <li className="cursor-pointer hover:text-blue-600">
                    Features
                </li>

                <li className="cursor-pointer hover:text-blue-600">
                    About
                </li>
            </ul>

            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                Upload Resume
            </button>
        </nav>
    );
}

export default Navbar;