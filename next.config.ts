import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/cv_en.pdf",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Content-Disposition",
            value: 'attachment; filename="CV_Aliaksandr_Bullo_EN.pdf"',
          },
        ],
      },
      {
        source: "/resume_ru.pdf",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Resume_Aliaksandr_Bullo_RU.pdf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
