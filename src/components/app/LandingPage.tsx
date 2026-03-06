import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { APP_NAME, tools } from "./constants";
import type { ToolKey } from "./types";
import { ui } from "./uiClasses";

type LandingPageProps = {
  onToolChange: (tool: ToolKey) => void;
};

export default function LandingPage({ onToolChange }: LandingPageProps) {
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const carouselTools = [...tools, ...tools];

  useEffect(() => {
    const animate = (timestamp: number) => {
      const track = trackRef.current;
      if (!track) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      if (!isCarouselPaused) {
        const loopWidth = track.scrollWidth / 2;
        const speedPxPerSecond = 22;
        offsetRef.current += (elapsed / 1000) * speedPxPerSecond;

        if (loopWidth > 0 && offsetRef.current >= loopWidth) {
          offsetRef.current -= loopWidth;
        }

        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCarouselPaused]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsCarouselPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <section className={`${ui.toolCard} gap-4 overflow-hidden md:gap-5`}>
      <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent)_20%,var(--border))] bg-[linear-gradient(125deg,color-mix(in_srgb,var(--accent)_10%,var(--surface))_0%,color-mix(in_srgb,var(--surface)_84%,var(--bg))_46%,color-mix(in_srgb,var(--accent)_12%,var(--surface))_100%)] bg-[length:220%_220%] p-6 animate-[landing-gradient-drift_24s_ease-in-out_infinite] md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] blur-2xl" />

        <div className="relative flex flex-wrap items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface))] text-[var(--accent)]">
            <Icon icon="tabler:flask-2" width="20" />
          </div>
          <h1 className="m-0 bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_56%,var(--surface))] bg-clip-text font-[Cinzel] text-4xl font-bold tracking-wide text-transparent md:text-5xl">
            {APP_NAME}
          </h1>
        </div>

        <p className="relative mt-4 mb-0 max-w-3xl text-base leading-relaxed text-[color-mix(in_srgb,var(--accent)_34%,var(--muted))] md:text-lg">
          A developer toolkit for everyday work. Convert, format, encode,
          compare, and generate data quickly in one place so routine tasks take
          seconds instead of context-switching across multiple websites.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="m-0 text-lg font-semibold text-[color-mix(in_srgb,var(--accent)_58%,var(--muted))]">
            Available Tools
          </h2>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-[linear-gradient(90deg,var(--surface),transparent)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-[linear-gradient(270deg,var(--surface),transparent)]" />

          <div
            ref={trackRef}
            className="flex h-full w-max items-stretch gap-3 p-2 will-change-transform"
          >
            {carouselTools.map((tool, index) => (
              <button
                key={`${tool.key}-${index}`}
                type="button"
                onClick={() => onToolChange(tool.key)}
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                onFocus={() => setIsCarouselPaused(true)}
                onBlur={() => setIsCarouselPaused(false)}
                title={tool.label}
                className="group relative hover:cursor-pointer flex h-[220px] w-[220px] shrink-0 flex-col justify-between rounded-xl border border-[color-mix(in_srgb,var(--accent)_22%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_95%,var(--bg))] p-4 text-center transition duration-300 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))]"
              >
                <div className="grid flex-1 place-items-center">
                  <div className="grid flex-1 place-items-center gap-2.5">
                    <span className="grid place-items-center rounded-lg text-[color-mix(in_srgb,var(--accent)_42%,var(--muted))] transition group-hover:text-[var(--accent)]">
                      <Icon icon={tool.icon} width="50" />
                    </span>
                    <h3 className="m-0 line-clamp-2 text-center text-base font-semibold leading-tight text-[color-mix(in_srgb,var(--accent)_45%,var(--muted))]">
                      {tool.label}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
