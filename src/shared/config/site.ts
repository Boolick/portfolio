// Единый источник базового URL. На Netlify можно переопределить NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  "https://resumeportfoliocv.netlify.app"
).replace(/\/$/, "");
