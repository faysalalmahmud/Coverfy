
import type {NextConfig} from 'next';

// The GITHUB_REPOSITORY environment variable is automatically set by GitHub Actions.
// It will be in the format 'username/repository-name'. We extract the repository name from it.
// For local development or other environments where GITHUB_REPOSITORY is not set,
// it falls back to 'SohojCover'.
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : 'SohojCover';

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
      // school360.xyz and drive.google.com can be removed if only used for the logo,
      // as local images don't need to be listed here.
      // Keeping them in case they are used for other images elsewhere.
      {
        protocol: 'https',
        hostname: 'sfmu.edu.bd', // Can be removed if no other images from sfmu.edu.bd are used
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'school360.xyz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
