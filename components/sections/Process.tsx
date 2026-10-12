"use client";

import React, { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  MessageSquareText,
  Ruler,
  FileText,
  HardHat,
  ShieldCheck,
  Award,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: "01",
    phase: "PHASE 01",
    title: "Enquiry",
    description: "Initial consultation & requirement analysis to define project scope and goals.",
    icon: MessageSquareText,
  },
  {
    id: "02",
    phase: "PHASE 02",
    title: "Site Assessment",
    description: "Comprehensive structural evaluation, accurate measurement & safety risk analysis.",
    icon: Ruler,
  },
  {
    id: "03",
    phase: "PHASE 03",
    title: "Quotation / Proposal",
    description: "Transparent cost breakdown, material specifications & clear delivery schedule.",
    icon: FileText,
  },
  {
    id: "04",
    phase: "PHASE 04",
    title: "Roofing Execution",
    description: "Precision installation by certified technicians adhering to master build standards.",
    icon: HardHat,
  },
  {
    id: "05",
    phase: "PHASE 05",
    title: "Quality Inspection",
    description: "Multi-stage quality auditing and rigorous weather-tightness compliance verification.",
    icon: ShieldCheck,
  },
  {
    id: "06",
    phase: "PHASE 06",
    title: "Final Handover",
    description: "Formal walkthrough, comprehensive warranty issuance & official client sign-off.",
    icon: Award,
  },
];

const NAVY = "#0C1533";
const YELLOW = "#FFC627";
const WHITE = "#FFFFFF";

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const desktopStageRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);

  // 5 Gap Segments for true pulse animation
  const desktopPaths = useRef<(SVGPathElement | null)[]>([]);
  const mobilePaths = useRef<(SVGPathElement | null)[]>([]);
  const mobileBaseTrack = useRef<SVGPathElement | null>(null);

  const desktopCircles = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCards = useRef<(HTMLDivElement | null)[]>([]);

  const mobileCircles = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCards = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const getCardTargets = (card: HTMLDivElement | null) => {
        if (!card) return null;
        const innerCard = card.classList.contains("rounded-2xl")
          ? card
          : (card.querySelector(".rounded-2xl") as HTMLDivElement | null) || card;
        const topBar = card.querySelector(".absolute.top-0") as HTMLDivElement | null;
        const iconBox = (card.querySelector(".h-8.w-8") ||
          card.querySelector(".h-7.w-7")) as HTMLDivElement | null;
        return { innerCard, topBar, iconBox };
      };

      const activateCard = (
        card: HTMLDivElement | null,
        tl?: gsap.core.Timeline,
        position?: number | string,
        duration = 0.25
      ) => {
        const targets = getCardTargets(card);
        if (!targets || !targets.innerCard) return;

        const anims: Array<{ target: Element; vars: gsap.TweenVars }> = [
          {
            target: targets.innerCard,
            vars: {
              borderColor: "rgba(255, 198, 39, 0.8)",
              boxShadow: "0 20px 30px -10px rgba(12, 21, 51, 0.12)",
              y: -6,
              duration,
              ease: "power2.out",
            },
          },
        ];

        if (targets.topBar) {
          anims.push({
            target: targets.topBar,
            vars: {
              backgroundColor: "#FFC627",
              duration,
              ease: "power2.out",
            },
          });
        }

        if (targets.iconBox) {
          anims.push({
            target: targets.iconBox,
            vars: {
              backgroundColor: "#FFC627",
              color: "#0C1533",
              duration,
              ease: "power2.out",
            },
          });
        }

        anims.forEach((anim) => {
          if (tl && position !== undefined) {
            tl.to(anim.target, anim.vars, position);
          } else {
            gsap.set(anim.target, anim.vars);
          }
        });
      };

      const deactivateCard = (
        card: HTMLDivElement | null,
        tl?: gsap.core.Timeline,
        position?: number | string,
        duration = 0.25
      ) => {
        const targets = getCardTargets(card);
        if (!targets || !targets.innerCard) return;

        const anims: Array<{ target: Element; vars: gsap.TweenVars }> = [
          {
            target: targets.innerCard,
            vars: {
              borderColor: "rgba(12, 21, 51, 0.15)",
              boxShadow: "0 4px 12px 0 rgba(12, 21, 51, 0.03)",
              y: 0,
              duration,
              ease: "power2.out",
            },
          },
        ];

        if (targets.topBar) {
          anims.push({
            target: targets.topBar,
            vars: {
              backgroundColor: "rgba(12, 21, 51, 0.10)",
              duration,
              ease: "power2.out",
            },
          });
        }

        if (targets.iconBox) {
          anims.push({
            target: targets.iconBox,
            vars: {
              backgroundColor: "#FFFCEE",
              color: "#0C1533",
              duration,
              ease: "power2.out",
            },
          });
        }

        anims.forEach((anim) => {
          if (tl && position !== undefined) {
            tl.to(anim.target, anim.vars, position);
          } else {
            gsap.set(anim.target, anim.vars);
          }
        });
      };

      const resetNodes = (
        circles: (HTMLDivElement | null)[],
        cards: (HTMLDivElement | null)[]
      ) => {
        circles.forEach((circle, index) => {
          if (!circle) return;
          if (index === 0) {
            gsap.set(circle, {
              backgroundColor: NAVY,
              borderColor: NAVY,
              color: YELLOW,
              scale: 1.12,
              boxShadow: "0 0 20px rgba(255, 198, 39, 0.4)",
            });
          } else {
            gsap.set(circle, {
              backgroundColor: WHITE,
              borderColor: "rgba(12, 21, 51, 0.25)",
              color: NAVY,
              scale: 1,
              boxShadow: "0 2px 6px rgba(12, 21, 51, 0.06)",
            });
          }
        });

        cards.forEach((card, index) => {
          if (!card) return;
          if (index === 0) {
            activateCard(card);
          } else {
            deactivateCard(card);
          }
        });
      };

      const createTimeline = (
        stage: HTMLDivElement | null,
        paths: (SVGPathElement | null)[],
        circles: (HTMLDivElement | null)[],
        cards: (HTMLDivElement | null)[]
      ) => {
        if (!stage || paths.length < 5) return;

        // Query native lengths
        const lengths = paths.map((p) => p?.getTotalLength() || 0);

        // Set initial strokeDasharray and strokeDashoffset
        paths.forEach((path, i) => {
          if (!path) return;
          gsap.set(path, {
            strokeDasharray: lengths[i],
            strokeDashoffset: lengths[i],
          });
        });

        resetNodes(circles, cards);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top 18%",
            end: "+=220%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to({}, { duration: 0.08 });

        let currentTime = 0.08;

        for (let i = 0; i < 5; i++) {
          const path = paths[i];
          const length = lengths[i];
          const prevCard = cards[i];
          const targetCircle = circles[i + 1];
          const targetCard = cards[i + 1];

          if (!path) continue;

          // 1. Draw gap segment
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: length,
              ease: "none",
            },
            currentTime
          );

          // Transition timing: transition card active state as path approaches target node
          const transitionStart = currentTime + length * 0.75;
          const transitionDuration = length * 0.25;

          // Deactivate previous card back to normal state
          if (prevCard) {
            deactivateCard(prevCard, tl, transitionStart, transitionDuration);
          }

          // 2. Activate circle node as path reaches target node
          if (targetCircle) {
            tl.to(
              targetCircle,
              {
                backgroundColor: NAVY,
                borderColor: NAVY,
                color: YELLOW,
                scale: 1.14,
                boxShadow: "0 0 24px rgba(255, 198, 39, 0.45)",
                duration: transitionDuration,
                ease: "back.out(1.5)",
              },
              transitionStart
            );
          }

          // 3. Activate target card to exact hover appearance
          if (targetCard) {
            activateCard(targetCard, tl, transitionStart, transitionDuration);
          }

          currentTime += length;
        }
      };

      const mm = gsap.matchMedia();

      const createMobileTimeline = (
        stage: HTMLDivElement | null,
        paths: (SVGPathElement | null)[],
        circles: (HTMLDivElement | null)[],
        cards: (HTMLDivElement | null)[]
      ) => {
        if (!stage || paths.length < 5 || circles.length < 6) return;

        const updateMobilePaths = () => {
          const stageRect = stage.getBoundingClientRect();
          const centers = circles.map((c) => {
            if (!c) return 0;
            const cRect = c.getBoundingClientRect();
            return Math.round(cRect.top + cRect.height / 2 - stageRect.top);
          });

          if (mobileBaseTrack.current && centers[0] !== undefined && centers[5] !== undefined) {
            mobileBaseTrack.current.setAttribute("d", `M 5 ${centers[0]} V ${centers[5]}`);
          }

          for (let i = 0; i < 5; i++) {
            const path = paths[i];
            if (path && centers[i] !== undefined && centers[i + 1] !== undefined) {
              path.setAttribute("d", `M 5 ${centers[i]} V ${centers[i + 1]}`);
              const len = path.getTotalLength() || 0;
              gsap.set(path, { strokeDasharray: len });
            }
          }
        };

        updateMobilePaths();

        const lengths = paths.map((p) => p?.getTotalLength() || 0);

        paths.forEach((path, i) => {
          if (!path) return;
          gsap.set(path, {
            strokeDasharray: lengths[i],
            strokeDashoffset: lengths[i],
          });
        });

        resetNodes(circles, cards);

        // Mobile & Tablet: Natural unpinned scroll scrub through all 6 phases
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top 65%",
            end: "bottom 65%",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onRefresh: updateMobilePaths,
          },
        });

        tl.to({}, { duration: 0.08 });

        let currentTime = 0.08;

        for (let i = 0; i < 5; i++) {
          const path = paths[i];
          const length = lengths[i];
          const prevCard = cards[i];
          const targetCircle = circles[i + 1];
          const targetCard = cards[i + 1];

          if (!path) continue;

          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: length,
              ease: "none",
            },
            currentTime
          );

          const transitionStart = currentTime + length * 0.75;
          const transitionDuration = length * 0.25;

          if (prevCard) {
            deactivateCard(prevCard, tl, transitionStart, transitionDuration);
          }

          if (targetCircle) {
            tl.to(
              targetCircle,
              {
                backgroundColor: NAVY,
                borderColor: NAVY,
                color: YELLOW,
                scale: 1.14,
                boxShadow: "0 0 24px rgba(255, 198, 39, 0.45)",
                duration: transitionDuration,
                ease: "back.out(1.5)",
              },
              transitionStart
            );
          }

          if (targetCard) {
            activateCard(targetCard, tl, transitionStart, transitionDuration);
          }

          currentTime += length;
        }
      };

      mm.add("(min-width: 1024px)", () => {
        createTimeline(
          desktopStageRef.current,
          desktopPaths.current,
          desktopCircles.current,
          desktopCards.current
        );
      });

      mm.add("(max-width: 1023px)", () => {
        createMobileTimeline(
          mobileStageRef.current,
          mobilePaths.current,
          mobileCircles.current,
          mobileCards.current
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <Section className="relative bg-brand-white border-b border-brand-navy/5 overflow-hidden py-24 md:py-32">
      {/* Decorative Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c153306_1px,transparent_1px),linear-gradient(to_bottom,#0c153306_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div ref={sectionRef} className="relative z-10 w-full">
        <Container>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-navy/60 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 mb-4 inline-block">
              Seamless Project Delivery
            </span>
            <SectionHeading
              title="Our Process"
              subtitle="Organized project delivery, from first contact to final handover."
              align="center"
            />
          </div>
        </Container>

        {/* DESKTOP STAGE - Placed directly under sectionRef to ensure true 100% viewport centering */}
        <div
          ref={desktopStageRef}
          className="hidden lg:flex flex-col items-center justify-center min-h-[72vh] relative w-full"
        >
          <div className="relative mx-auto h-[560px] w-full max-w-[1150px] px-4">
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox="0 0 1150 560"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Layer 1: Base connector path */}
              <path
                d="M 145 50 H 575 H 1005 V 320 H 575 H 145"
                fill="none"
                stroke={NAVY}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.12"
              />

              {/* Layer 2: 5 Animated yellow progress segments */}
              <path
                ref={(el) => {
                  if (el) desktopPaths.current[0] = el;
                }}
                d="M 145 50 H 575"
                fill="none"
                stroke={YELLOW}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                ref={(el) => {
                  if (el) desktopPaths.current[1] = el;
                }}
                d="M 575 50 H 1005"
                fill="none"
                stroke={YELLOW}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                ref={(el) => {
                  if (el) desktopPaths.current[2] = el;
                }}
                d="M 1005 50 V 320"
                fill="none"
                stroke={YELLOW}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                ref={(el) => {
                  if (el) desktopPaths.current[3] = el;
                }}
                d="M 1005 320 H 575"
                fill="none"
                stroke={YELLOW}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                ref={(el) => {
                  if (el) desktopPaths.current[4] = el;
                }}
                d="M 575 320 H 145"
                fill="none"
                stroke={YELLOW}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {steps.map((step, index) => {
              const IconComponent = step.icon;

              // Circle Node centers match SVG points exactly
              const circlePositions = [
                "left-[12.61%] top-[26px]",
                "left-[50%] top-[26px]",
                "left-[87.39%] top-[26px]",
                "left-[87.39%] top-[296px]",
                "left-[50%] top-[296px]",
                "left-[12.61%] top-[296px]",
              ];

              // Card Boxes positioned cleanly below circles
              const cardPositions = [
                "left-[12.61%] top-[90px]",
                "left-[50%] top-[90px]",
                "left-[87.39%] top-[90px]",
                "left-[87.39%] top-[360px]",
                "left-[50%] top-[360px]",
                "left-[12.61%] top-[360px]",
              ];

              return (
                <React.Fragment key={step.id}>
                  {/* Circle Node sitting on line */}
                  <div
                    className={`absolute -translate-x-1/2 ${circlePositions[index]} z-20`}
                  >
                    <div
                      ref={(element) => {
                        desktopCircles.current[index] = element;
                      }}
                      className="process-circle flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-navy/25 bg-white font-display text-base font-extrabold text-brand-navy shadow-sm transition-all duration-300"
                    >
                      {step.id}
                    </div>
                  </div>

                  {/* Architectural Card Box */}
                  <div
                    ref={(element) => {
                      desktopCards.current[index] = element;
                    }}
                    className={`absolute -translate-x-1/2 ${cardPositions[index]} w-[240px] xl:w-[275px] z-10 group transition-all duration-300`}
                  >
                    <div className="relative rounded-2xl border border-brand-navy/15 bg-white p-4 xl:p-5 shadow-md hover:shadow-xl hover:border-brand-yellow/80 transition-all duration-300 overflow-hidden">
                      {/* Top subtle highlight bar */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-navy/10 group-hover:bg-brand-yellow transition-colors duration-300" />

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-display font-bold uppercase tracking-wider text-brand-navy/50 group-hover:text-brand-navy/80 transition-colors">
                          {step.phase}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-island-spice text-brand-navy group-hover:bg-brand-yellow group-hover:text-brand-navy transition-colors">
                          <IconComponent className="h-4 w-4 stroke-[2.2]" />
                        </div>
                      </div>

                      <h3 className="text-sm xl:text-base font-display font-bold uppercase leading-tight text-brand-navy mb-2 group-hover:text-brand-navy transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-[11px] xl:text-xs text-brand-navy/70 leading-relaxed text-balance font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* MOBILE STAGE */}
        <Container>
          <div
            ref={mobileStageRef}
            className="lg:hidden relative max-w-lg mx-auto px-2"
          >
            <div className="relative mx-auto w-full">
              <svg
                className="absolute left-[24px] top-0 h-full w-[10px] -translate-x-1/2 pointer-events-none"
                viewBox="0 0 10 1100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  ref={mobileBaseTrack}
                  d="M 5 28 V 980"
                  fill="none"
                  stroke={NAVY}
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.12"
                />

                <path
                  ref={(el) => {
                    if (el) mobilePaths.current[0] = el;
                  }}
                  d="M 5 28 V 215"
                  fill="none"
                  stroke={YELLOW}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    if (el) mobilePaths.current[1] = el;
                  }}
                  d="M 5 215 V 401"
                  fill="none"
                  stroke={YELLOW}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    if (el) mobilePaths.current[2] = el;
                  }}
                  d="M 5 401 V 588"
                  fill="none"
                  stroke={YELLOW}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    if (el) mobilePaths.current[3] = el;
                  }}
                  d="M 5 588 V 774"
                  fill="none"
                  stroke={YELLOW}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    if (el) mobilePaths.current[4] = el;
                  }}
                  d="M 5 774 V 961"
                  fill="none"
                  stroke={YELLOW}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="relative flex flex-col gap-6">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;

                  return (
                    <div
                      key={step.id}
                      className="relative flex items-start gap-4"
                    >
                      <div
                        ref={(element) => {
                          mobileCircles.current[index] = element;
                        }}
                        className="process-circle relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-navy/25 bg-white font-display text-base font-extrabold text-brand-navy shadow-sm transition-all duration-300 mt-1"
                      >
                        {step.id}
                      </div>

                      <div
                        ref={(element) => {
                          mobileCards.current[index] = element;
                        }}
                        className="relative flex-1 rounded-2xl border border-brand-navy/15 bg-white p-5 shadow-md transition-all duration-300 overflow-hidden"
                      >
                        {/* Top subtle highlight bar matching desktop */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-navy/10" />

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-display font-bold uppercase tracking-wider text-brand-navy/50">
                            {step.phase}
                          </span>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-island-spice text-brand-navy">
                            <IconComponent className="h-3.5 w-3.5 stroke-[2.2]" />
                          </div>
                        </div>

                        <h3 className="text-base font-display font-bold uppercase text-brand-navy mb-1.5 leading-tight">
                          {step.title}
                        </h3>

                        <p className="text-xs text-brand-navy/70 leading-relaxed font-sans">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}

