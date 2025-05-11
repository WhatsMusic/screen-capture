import React, { RefObject } from "react";

interface CanvasOverlayProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    started: boolean;
    onStart: () => void;
}

const CanvasOverlay: React.FC<CanvasOverlayProps> = ({ canvasRef, started, onStart }) => {
    return (
        <main className="pt-14 flex justify-center w-full px-2 relative">
            <canvas ref={canvasRef} className="w-full max-w-7xl aspect-video rounded-xl shadow-lg bg-black" />
            {!started && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={onStart} className="px-6 py-3 bg-green-500 rounded-lg text-lg font-semibold">
                        Start Recording
                    </button>
                </div>
            )}
        </main>
    );
};

export default CanvasOverlay;
