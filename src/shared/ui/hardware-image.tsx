"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { resolveStorageImageCandidates } from "@/shared/lib/resolve-storage-image";
import { cn } from "@/shared/lib/utils";

export interface HardwareImageProps extends Omit<ImageProps, "src"> {
  fileName: string;
}

export function HardwareImage({
  fileName,
  alt,
  className,
  sizes = "(max-width: 767px) 100vw, 50vw",
  ...props
}: HardwareImageProps) {
  const candidates = resolveStorageImageCandidates(fileName);
  const [candidateIndex, setCandidateIndex] = useState(0);

  const currentSrc = candidates[candidateIndex] || candidates[0];

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      sizes={sizes}
      onError={() => {
        if (candidateIndex + 1 < candidates.length) {
          setCandidateIndex((prev) => prev + 1);
        }
      }}
      className={cn("block w-full h-auto object-cover", className)}
    />
  );
}
