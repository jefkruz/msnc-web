import { useEffect, useRef } from 'react';

export default function SignaturePad({ onChange, className = '' }) {
    const canvasRef = useRef(null);
    const drawingRef = useRef(false);
    const lastPointRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        return undefined;
    }, []);

    const exportSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) {
                onChange?.(null);
                return;
            }
            onChange?.(new File([blob], 'signature.png', { type: 'image/png' }));
        }, 'image/png');
    };

    const getPoint = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const source = event.touches?.[0] ?? event;
        return {
            x: (source.clientX - rect.left) * scaleX,
            y: (source.clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (event) => {
        event.preventDefault();
        drawingRef.current = true;
        lastPointRef.current = getPoint(event);
    };

    const draw = (event) => {
        if (!drawingRef.current) return;
        event.preventDefault();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const point = getPoint(event);
        const last = lastPointRef.current;

        if (last) {
            ctx.beginPath();
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }

        lastPointRef.current = point;
        exportSignature();
    };

    const stopDrawing = (event) => {
        if (!drawingRef.current) return;
        event?.preventDefault?.();
        drawingRef.current = false;
        lastPointRef.current = null;
        exportSignature();
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        onChange?.(null);
    };

    return (
        <div className={className}>
            <div className="rounded-lg border border-slate-200 dark:border-border-dark bg-white overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={480}
                    height={180}
                    className="block w-full h-40 touch-none cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <button
                type="button"
                onClick={clear}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
                <span className="material-symbols-outlined text-base">ink_eraser</span>
                Clear signature
            </button>
        </div>
    );
}
