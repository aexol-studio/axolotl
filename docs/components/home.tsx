export const Home = () => {
  return (
    <>
      <style global jsx>{`
        .nextra-breadcrumb {
          display: none;
        }

        /* Hero gradient background */
        .hero-gradient {
          position: relative;
          padding: 3rem 0;
        }

        .hero-gradient::before {
          content: '';
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: float 6s ease-in-out infinite;
        }

        .dark .hero-gradient::before {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
        }

        /* Feature cards */
        .feature-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(191, 219, 254, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
        }

        .dark .feature-card {
          background: rgba(30, 30, 40, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .dark .feature-card:hover {
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.3);
          border-color: rgba(139, 92, 246, 0.5);
        }

        /* Code block enhancements */
        .nx-mt-6 pre {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .dark .nx-mt-6 pre {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        /* Smooth animations */
        @keyframes float {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-20px);
          }
        }

        /* Enhanced typography */
        h1,
        h2,
        h3 {
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        /* Badge styling */
        .version-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          color: white;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }
      `}</style>
    </>
  );
};
