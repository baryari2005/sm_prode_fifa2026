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
    ],
  },
};

export default nextConfig;