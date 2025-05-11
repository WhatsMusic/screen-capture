"use client";

import React, { useRef, useState, useCallback } from "react";
import RecorderHeader from "./components/RecorderHeader";
import CanvasOverlay from "./components/CanvasOverlay";

const FPS = 30;
const BITRATES = {
  "3 Mbps": 3_000_000,
  "8 Mbps": 8_000_000,
  "15 Mbps": 15_000_000,
} as const;

const pickMimeType = () => {
  const cands = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  return cands.find(MediaRecorder.isTypeSupported);
};

function mixAudio(screen: MediaStream, mic: MediaStream, useGK: boolean): MediaStream {
  const ctx = new AudioContext({ latencyHint: "interactive" });
  const dest = ctx.createMediaStreamDestination();
  screen.getAudioTracks().forEach((t) => {
    ctx.createMediaStreamSource(new MediaStream([t])).connect(dest);
  });
  mic.getAudioTracks().forEach((t) => {
    const src = ctx.createMediaStreamSource(new MediaStream([t]));
    if (!useGK) {
      src.connect(dest);
    } else {
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 120;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -40; comp.knee.value = 10; comp.ratio.value = 4;
      comp.attack.value = 0.003; comp.release.value = 0.25;
      src.connect(hp); hp.connect(comp); comp.connect(dest);
    }
  });
  return dest.stream;
}

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const camVideoRef = useRef<HTMLVideoElement>(null);

  const screenRef = useRef<MediaStream | null>(null);
  const camRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const drawTimer = useRef<number | null>(null);

  const [recording, setRecording] = useState(false);
  const [started, setStarted] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [webmUrl, setWebmUrl] = useState<string | null>(null);
  const [bitrate, setBitrate] = useState<keyof typeof BITRATES>("8 Mbps");
  const [gk, setGk] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const start = useCallback(async () => {
    if (recording) return;
    setStarted(true);
    try {
      setErr(null);
      setWebmUrl(null);
      chunksRef.current = [];

      const scr = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const mic = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: { echoCancellation: true, noiseSuppression: true } });

      screenRef.current = scr;
      camRef.current = mic;

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = scr;
        await screenVideoRef.current.play();
      }
      if (camVideoRef.current) {
        camVideoRef.current.srcObject = mic;
        await camVideoRef.current.play();
      }

      const { width: W = 1920, height: H = 1080 } = (scr.getVideoTracks()[0].getSettings() as MediaTrackSettings);
      const cvs = canvasRef.current!;
      cvs.width = W;
      cvs.height = H;
      const ctx = cvs.getContext("2d")!;
      drawTimer.current = window.setInterval(() => {
        ctx.drawImage(screenVideoRef.current!, 0, 0, W, H);
        const pW = W / 5;
        const pH = (camVideoRef.current!.videoHeight / camVideoRef.current!.videoWidth) * pW;
        ctx.drawImage(camVideoRef.current!, W - pW - 20, H - pH - 20, pW, pH);
      }, 1000 / FPS);

      const mixed = mixAudio(scr, mic, gk);
      const stream = new MediaStream([
        ...canvasRef.current!.captureStream(FPS).getVideoTracks(),
        ...mixed.getAudioTracks(),
      ]);

      const rec = new MediaRecorder(stream, {
        mimeType: pickMimeType() || undefined,
        videoBitsPerSecond: BITRATES[bitrate],
        audioBitsPerSecond: 192_000,
      });
      recRef.current = rec;
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        if (drawTimer.current) clearInterval(drawTimer.current);
        const blob = new Blob(chunksRef.current, { type: pickMimeType() || "video/webm" });
        setWebmUrl(URL.createObjectURL(blob));
        chunksRef.current = [];
        setRecording(false);
      };
      rec.start(100);
      setRecording(true);
    } catch (e: unknown) {
      console.error(e);
      setErr(String(e));
    }
  }, [recording, bitrate, gk]);

  const stop = useCallback(() => {
    if (!recording) return;
    recRef.current?.requestData();
    recRef.current?.stop();
    screenRef.current?.getTracks().forEach((t) => t.stop());
    camRef.current?.getTracks().forEach((t) => t.stop());
    screenVideoRef.current?.pause();
    camVideoRef.current?.pause();
    setShowHeader(true);
  }, [recording]);

  const toggleHeader = () => setShowHeader((s) => !s);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <RecorderHeader
        recording={recording}
        onStart={start}
        onStop={stop}
        bitrate={bitrate}
        setBitrate={setBitrate}
        gk={gk}
        setGk={setGk}
        showHeader={showHeader}
        toggleHeader={toggleHeader}
      />
      <CanvasOverlay canvasRef={canvasRef} started={started} onStart={start} />
      <video ref={screenVideoRef} className="hidden" muted playsInline />
      <video ref={camVideoRef} className="hidden" muted playsInline />
      {webmUrl && (
        <div className="fixed bottom-4 right-4 bg-black/70 px-4 py-2 rounded shadow">
          <a href={webmUrl} download="recording.webm" className="underline text-green-300">Download Video</a>
        </div>
      )}
      {err && (
        <div className="fixed bottom-4 right-4 bg-red-800 text-white px-4 py-2 rounded shadow max-w-xs">
          {err}
        </div>
      )}
    </div>
  );
};

export default Home;
