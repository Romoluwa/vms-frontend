"use client";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FieldError } from "react-hook-form";

interface SignatureProps {
  onChange: (signatureData: string | null) => void;
  error?: FieldError;
}

export const SignaturePad = ({ onChange, error }: SignatureProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    onChange(null);
  };

  const onEnd = () => {
    // FIX: Use getCanvas() instead of getTrimmedCanvas()
    const canvas = sigCanvas.current?.getCanvas();
    if (canvas) {
      const data = canvas.toDataURL("image/png");
      onChange(data);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-gray-400 italic">
        Signature
      </label>
      <div
        className={`relative border rounded-[12px] bg-white overflow-hidden transition-all
        ${error ? "border-red-500" : "border-gray-100 focus-within:border-[#2B4592]"}`}
      >
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={onEnd}
          penColor="#2B4592"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
        />

        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 text-[10px] bg-[#A1ACB2] px-2 py-1 rounded hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          CLEAR
        </button>
      </div>
      {error && (
        <span className="text-red-500 text-[10px] font-bold uppercase">
          {error.message}
        </span>
      )}
    </div>
  );
};
