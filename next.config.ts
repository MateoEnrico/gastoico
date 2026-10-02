import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Para probar en el celular por wifi mientras se desarrolla.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
