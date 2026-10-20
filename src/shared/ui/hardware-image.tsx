"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { resolveStorageImage } from "@/shared/lib/resolve-storage-image";
import { cn } from "@/shared/lib/utils";

export interface HardwareImageProps extends Omit<ImageProps, "src"> {
  fileName: string;
}

export function HardwareImage({
  fileName,
  alt,
  className,
  ...props
}: HardwareImageProps) {
  const { primarySrc, fallbackSrc } = resolveStorageImage(fileName);
  const [src, setSrc] = useState<string>(primarySrc);

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => {
        if (src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
      className={cn("block w-full h-auto object-cover", className)}
    />
  );
}
