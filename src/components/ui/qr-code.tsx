"use client";

import { useEffect, useRef } from "react";
import QRCodeLib from "qrcode";

type QRCodeProps = {
  value: string;
  size?: number;
  className?: string;
};

export function QRCode({ value, size = 160, className = "" }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCodeLib.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: "#1f2119",
        light: "#ffffff",
      },
    }).catch(() => {});
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
    />
  );
}