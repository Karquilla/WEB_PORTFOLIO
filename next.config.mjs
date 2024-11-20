/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/Home', // Redirect root URL to /home
            permanent: true, // Set to true for 301 permanent redirect, false for 302 temporary
          },
        ];
    }
};

export default nextConfig;
