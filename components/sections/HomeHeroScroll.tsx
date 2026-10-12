"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 120;
const FRAME_PATH = (index: number) =>
  `/images/hero-frames/frame_${String(index).padStart(3, "0")}.webp`;

/**
 * Calculates and draws image with object-fit: cover on HTML5 Canvas
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  offsetX = 0.5,
  offsetY = 0.5
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const hRatio = width / iw;
  const vRatio = height / ih;
  const ratio = Math.max(hRatio, vRatio);

  const centerShiftX = (width - iw * ratio) * offsetX;
  const centerShiftY = (height - ih * ratio) * offsetY;

  ctx.drawImage(
    img,
    0,
    0,
    iw,
    ih,
    centerShiftX,
    centerShiftY,
    iw * ratio,
    ih * ratio
  );
}

export function HomeHeroScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);

  // 1. Draw frame to canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[frameIndex];
    if (!img) {
      // Fallback to nearest available frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (frameIndex - offset >= 0 && imagesRef.current[frameIndex - offset]) {
          img = imagesRef.current[frameIndex - offset];
          break;
        }
        if (frameIndex + offset < TOTAL_FRAMES && imagesRef.current[frameIndex + offset]) {
          img = imagesRef.current[frameIndex + offset];
          break;
        }
      }
    }

    if (img && img.complete) {
      currentFrameRef.current = frameIndex;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCoverImage(ctx, img, canvas.width, canvas.height, 0.5, 0.5);
    }
  }, []);

  // 2. Preload frames
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    // Frame 1 with immediate priority
    const firstImg = new Image();
    firstImg.src = FRAME_PATH(1);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      setInitialFrameLoaded(true);
      renderFrame(0);
    };

    // Preload remaining frames
    let isCancelled = false;
    const preloadRest = async () => {
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (isCancelled) break;
        const img = new Image();
        img.src = FRAME_PATH(i);
        img.onload = () => {
          imagesRef.current[i - 1] = img;
        };
        if (i % 8 === 0) {
          await new Promise((r) => setTimeout(r, 16));
        }
      }
    };

    preloadRest();

    return () => {
      isCancelled = true;
    };
  }, [renderFrame]);

  // 3. Resize Canvas
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      renderFrame(currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [renderFrame, initialFrameLoaded]);

  // 4. Native Sticky + ScrollTrigger scrub
  useEffect(() => {
    if (!trackRef.current) return;

    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // 0.0 -> 0.88 maps smoothly across frames 0 -> TOTAL_FRAMES - 1; 0.88 -> 1.0 provides a cushion hold on the final frame
        const animProgress = Math.min(1, Math.max(0, self.progress / 0.88));
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(animProgress * (TOTAL_FRAMES - 1)))
        );
        renderFrame(frameIndex);

        // Fade out text overlay cleanly before the storm
        if (contentRef.current) {
          const fadeProgress = Math.min(1, Math.max(0, (self.progress - 0.04) / 0.14));
          const opacity = 1 - fadeProgress;
          const translateY = -fadeProgress * 40;
          contentRef.current.style.opacity = String(opacity);
          contentRef.current.style.transform = `translateY(${translateY}px)`;
          contentRef.current.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
        }

        // Hide scroll indicator on first scroll
        if (scrollIndicatorRef.current) {
          const indOpacity = Math.max(0, 1 - self.progress * 8);
          scrollIndicatorRef.current.style.opacity = String(indOpacity);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [renderFrame]);

  return (
    <section ref={trackRef} className="relative w-full h-[300vh] bg-brand-navy">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none z-0"
        />

        {/* Cinematic Navy Gradient Overlays */}
        <div className="absolute inset-0 bg-brand-navy/35 mix-blend-multiply pointer-events-none z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent pointer-events-none z-1" />

        {/* Static Fallback Image while loading */}
        {!initialFrameLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${FRAME_PATH(1)})` }}
          />
        )}

        {/* Hero Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4">
          <Container className="w-full my-auto">
            <div
              ref={contentRef}
              className="max-w-5xl mx-auto space-y-6 md:space-y-8 flex flex-col items-center transition-transform will-change-transform"
            >
              <h1 className="max-w-5xl text-4xl sm:text-5xl md:text-[clamp(2.75rem,5.2vw,5rem)] font-display uppercase leading-[0.96] tracking-tight text-brand-white text-balance drop-shadow-lg">
                KERALA&apos;S
                <br className="hidden md:inline" />{" "}
                TRUSTED ROOFING
                <br className="hidden md:inline" />{" "}
                SOLUTIONS <span className="text-brand-yellow">PARTNER</span>
              </h1>

              <p className="text-base sm:text-lg md:text-[1.1875rem] text-brand-white/95 font-sans max-w-[640px] leading-relaxed text-balance drop-shadow">
                Reliable roofing solutions delivered through quality workmanship,
                professional execution, and customer-first service.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-brand-white text-brand-white hover:bg-brand-white/10 backdrop-blur-xs"
                  asChild
                >
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>

              <div className="pt-4 md:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-brand-white/90 text-xs sm:text-sm font-sans drop-shadow">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" aria-hidden="true" />
                  <span>Site Inspection within 24 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" aria-hidden="true" />
                  <span>Quotation within 48 Hours</span>
                </div>
              </div>
            </div>
          </Container>

          {/* Interactive Scroll Prompter */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-brand-white/80 text-xs font-display uppercase tracking-widest pointer-events-none transition-opacity"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-brand-yellow" />
          </div>
        </div>
      </div>
    </section>
  );
}
