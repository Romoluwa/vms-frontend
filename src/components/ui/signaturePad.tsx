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
    onChange(null); // Reset the field value
  };

  const onEnd = () => {
    // Check if the ref is attached and the canvas exists
    if (sigCanvas.current) {
      const canvas = sigCanvas.current.getCanvas();

      // Safety check: Ensure the user actually drew something
      if (sigCanvas.current.isEmpty()) {
        onChange(null);
        return;
      }

      /**
       * FIX: We use .getCanvas() instead of .getTrimmedCanvas()
       * to avoid the WEBPACK "trim_canvas is not a function" error.
       */
      const data = canvas.toDataURL("image/png");

      // Send the Base64 string to the parent form
      onChange(data);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider italic">
        Visitor Signature
      </label>
      <div
        className={`relative border rounded-[12px] bg-white overflow-hidden transition-all
        ${error ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]" : "border-gray-100 focus-within:border-[#2B4592]"}`}
      >
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={onEnd}
          penColor="#1D2E5A"
          velocityFilterWeight={0.7}
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
        />

        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
        >
          CLEAR
        </button>
      </div>

      {error && (
        <span className="text-red-500 text-[10px] font-bold uppercase tracking-tight">
          {error.message}
        </span>
      )}
    </div>
  );
};
