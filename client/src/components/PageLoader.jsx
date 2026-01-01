const PageLoader = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="loader w-[50px] aspect-square relative">
        <style>
          {`
            .loader {
              --c: no-repeat radial-gradient(farthest-side, #514b82 92%, transparent);
              background:
                var(--c) 50% 0,
                var(--c) 50% 100%,
                var(--c) 100% 50%,
                var(--c) 0 50%;
              background-size: 10px 10px;
              animation: spinDots 1s infinite linear;
            }

            .loader::before {
              content: "";
              position: absolute;
              inset: 0;
              margin: 3px;
              background: repeating-conic-gradient(
                transparent 0 35deg,
                #514b82 0 90deg
              );
              -webkit-mask: radial-gradient(
                farthest-side,
                transparent calc(100% - 3px),
                black 0
              );
              border-radius: 50%;
            }

            /* DARK MODE OVERRIDES */
            .dark .loader {
              --c: no-repeat radial-gradient(farthest-side, #38bdf8 92%, transparent);
            }

            .dark .loader::before {
              background: repeating-conic-gradient(
                transparent 0 35deg,
                #38bdf8 0 90deg
              );
            }

            @keyframes spinDots {
              100% {
                transform: rotate(0.5turn);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PageLoader;
