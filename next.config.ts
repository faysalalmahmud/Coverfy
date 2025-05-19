import type {NextConfig} from 'next';

// IMPORTANT: Replace 'your-repo-name' with the actual name of your GitHub repository.
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : 'your-repo-name';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enables static HTML export
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export with next/image without custom loader
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sfmu.edu.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'school360.xyz',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
