
import type {NextConfig} from 'next';

// The GITHUB_REPOSITORY environment variable is automatically set by GitHub Actions.
// It will be in the format 'username/repository-name'. We extract the repository name from it.
// For local development or other environments where GITHUB_REPOSITORY is not set,
// it falls back to 'Coverfy', which is the name of your repository.
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : 'Coverfy';

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
        hostname: 'placehold.co', // For placeholder images
        port: '',
        pathname: '/**',
      },
      // sfmu.edu.bd, school360.xyz and drive.google.com are removed as the logo is now local.
    ],
  },
};

export default nextConfig;
