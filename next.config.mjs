/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    // domains: ['lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        // port: '',
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
