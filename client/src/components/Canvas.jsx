import { useEffect, useRef } from "react";
import { socket } from "../socket";

function Canvas({ roomId, canDraw, clearTrigger, color }) {

  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const historyStack = useRef([]);
  const BRUSH_SIZE = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.lineWidth = BRUSH_SIZE;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    const saveSnapshot = () => {
      historyStack.current.push(
        ctx.getImageData(0, 0, canvas.width, canvas.height)
      );

      // keep memory bounded for long sessions.
      if (historyStack.current.length > 40) {
        historyStack.current.shift();
      }
    };

    // get position
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if (e.touches) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    // start draw
    const start = (e) => {
      if (!canDraw) return;
      e.preventDefault();

      saveSnapshot();
      drawing.current = true;
      const { x, y } = getPos(e);

      ctx.beginPath();
      ctx.moveTo(x, y);

      socket.emit("startDrawing", { x, y, roomId, color, size: BRUSH_SIZE });
    };

    // draw
    const draw = (e) => {
      if (!drawing.current || !canDraw) return;
      e.preventDefault();

      const { x, y } = getPos(e);

      ctx.lineTo(x, y);
      ctx.stroke();

      socket.emit("draw", { x, y, roomId, color, size: BRUSH_SIZE });
    };

    // stop draw
    const stop = () => {
      if (!canDraw) return;

      drawing.current = false;
      ctx.beginPath();

      socket.emit("stopDrawing", { roomId });
    };

    // receive from others
    const handleStart = ({ x, y, color: strokeColor, size }) => {
      saveSnapshot();
      ctx.strokeStyle = typeof strokeColor === "string" ? strokeColor : "#000000";
      ctx.lineWidth = typeof size === "number" ? size : BRUSH_SIZE;
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleDraw = ({ x, y, color: strokeColor, size }) => {
      ctx.strokeStyle = typeof strokeColor === "string" ? strokeColor : "#000000";
      ctx.lineWidth = typeof size === "number" ? size : BRUSH_SIZE;
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const handleStop = () => {
      ctx.beginPath();
    };

    const handleUndo = () => {
      const previous = historyStack.current.pop();
      if (!previous) return;

      ctx.putImageData(previous, 0, 0);
      drawing.current = false;
      ctx.beginPath();
    };

    const handleClear = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      historyStack.current = [];
    };

    socket.on("startDrawing", handleStart);
    socket.on("draw", handleDraw);
    socket.on("stopDrawing", handleStop);
    socket.on("undo_draw", handleUndo);
    socket.on("clear_canvas", handleClear);

    // events
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stop);

    // cleanup
    return () => {
      socket.off("startDrawing", handleStart);
      socket.off("draw", handleDraw);
      socket.off("stopDrawing", handleStop);
      socket.off("undo_draw", handleUndo);
      socket.off("clear_canvas", handleClear);

      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stop);
    };
  }, [roomId, canDraw, color]);

  // clear canvas on turn change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyStack.current = [];
  }, [clearTrigger]);

  return (
    <div className="w-full lg:flex-1 lg:min-h-0">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className={`block h-auto w-full rounded-xl border border-slate-300 bg-white shadow lg:h-full ${canDraw ? "cursor-crosshair" : "cursor-not-allowed"
          }`}
      />
    </div>
  );
}

export default Canvas;