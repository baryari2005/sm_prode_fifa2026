const nextConfig = {
  async rewrites() {
    return []; // no tocar /api, que quede para las routes de Next
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nrjdjbasffhjimpdwcwm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "crests.football-data.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;