import React from "react";
import { Play, StopCircle, ChevronDown, ChevronUp } from "lucide-react";

interface RecorderHeaderProps {
    recording: boolean;
    onStart: () => void;
    onStop: () => void;
    bitrate: "3 Mbps" | "8 Mbps" | "15 Mbps";
    setBitrate: (value: "3 Mbps" | "8 Mbps" | "15 Mbps") => void;
    gk: boolean;
    setGk: (value: boolean) => void;
    showHeader: boolean;
    toggleHeader: () => void;
}

const RecorderHeader: React.FC<RecorderHeaderProps> = ({
    recording,
    onStart,
    onStop,
    bitrate,
    setBitrate,
    gk,
    setGk,
    showHeader,
    toggleHeader,
}) => {
    const BITRATES = {
        "3 Mbps": 3_000_000,
        "8 Mbps": 8_000_000,
        "15 Mbps": 15_000_000,
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 h-12 bg-black/70 backdrop-blur flex items-center gap-4 px-4 transition-transform z-50 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
                <h1 className="text-lg font-semibold flex-1 select-none">PiP-Recorder</h1>
                {!recording ? (
                    <button onClick={onStart} className="p-1" title="Start">
                        <Play className="w-6 h-6 text-green-400" />
                    </button>
                ) : (
                    <button onClick={onStop} className="p-1" title="Stop">
                        <StopCircle className="w-6 h-6 text-red-500" />
                    </button>
                )}
                <select value={bitrate} onChange={(e) => setBitrate(e.target.value as "3 Mbps" | "8 Mbps" | "15 Mbps")} className="bg-transparent border rounded px-2 py-1 text-sm">
                    {Object.keys(BITRATES).map((label) => (
                        <option key={label} className="text-black">
                            {label}
                        </option>
                    ))}
                </select>
                <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={gk} onChange={(e) => setGk(e.target.checked)} className="accent-purple-500" />
                    Echo
                </label>
            </header>
            <button onClick={toggleHeader} className="fixed top-2 left-2 z-50 p-1 bg-black/70 rounded-full backdrop-blur">
                {showHeader ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
        </>
    );
};

export default RecorderHeader;
