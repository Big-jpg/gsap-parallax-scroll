"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ParallaxScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    console.log("[ParallaxScroll] mount");

    // Dev/StrictMode safety: kill anything left around from prior mounts
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.killTweensOf("*");

    if (!containerRef.current || !svgRef.current) {
      console.error("[ParallaxScroll] refs missing on mount");
      return;
    }

    // We'll attach a scroll listener just for debug + forcing ScrollTrigger.update()
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      const speed = 100;
      const height = 500;

      // --- INITIAL STATE SETUP ---------------------------------
      gsap.set("#h2-1", { opacity: 0 });
      gsap.set("#bg_grad", { attr: { cy: "-50" } });
      gsap.set("#scene3", { y: height - 40, visibility: "visible" });

      const mm = gsap.matchMedia();
      mm.add("(max-width: 1922px)", () => {
        gsap.set(["#cloudStart-L", "#cloudStart-R"], { x: 10, opacity: 1 });
      });

      // --- SCENE 1 ---------------------------------------------
      const scene1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "top top",
          end: "45% 100%",
          scrub: 3,
          invalidateOnRefresh: true,
        },
      });

      scene1.to("#h1-1", { y: 3 * speed, x: 1 * speed, scale: 0.9, ease: "power1.in" }, 0);
      scene1.to("#h1-2", { y: 2.6 * speed, x: -0.6 * speed, ease: "power1.in" }, 0);
      scene1.to("#h1-3", { y: 1.7 * speed, x: 1.2 * speed }, 0.03);
      scene1.to("#h1-4", { y: 3 * speed, x: 1 * speed }, 0.03);
      scene1.to("#h1-5", { y: 2 * speed, x: 1 * speed }, 0.03);
      scene1.to("#h1-6", { y: 2.3 * speed, x: -2.5 * speed }, 0);
      scene1.to("#h1-7", { y: 5 * speed, x: 1.6 * speed }, 0);
      scene1.to("#h1-8", { y: 3.5 * speed, x: 0.2 * speed }, 0);
      scene1.to("#h1-9", { y: 3.5 * speed, x: -0.2 * speed }, 0);

      scene1.to("#cloudsBig-L", { y: 4.5 * speed, x: -0.2 * speed }, 0);
      scene1.to("#cloudsBig-R", { y: 4.5 * speed, x: -0.2 * speed }, 0);
      scene1.to("#cloudStart-L", { x: -300 }, 0);
      scene1.to("#cloudStart-R", { x: 300 }, 0);
      scene1.to("#info", { y: 8 * speed }, 0);

      // --- BIRD ------------------------------------------------
      gsap.fromTo(
        "#bird",
        { opacity: 1 },
        {
          y: -250,
          x: 800,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".scrollElement",
            start: "15% top",
            end: "60% 100%",
            scrub: 4,
            invalidateOnRefresh: true,
            onEnter: () => gsap.to("#bird", { scaleX: 1, rotation: 0 }),
            onLeave: () => gsap.to("#bird", { scaleX: -1, rotation: -15 }),
          },
        }
      );

      // --- CLOUDS ----------------------------------------------
      const clouds = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "top top",
          end: "70% 100%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      clouds.to("#cloud1", { x: 500 }, 0);
      clouds.to("#cloud2", { x: 1000 }, 0);
      clouds.to("#cloud3", { x: -1000 }, 0);
      clouds.to("#cloud4", { x: -700, y: 25 }, 0);

      // --- SUN / SKY COLOR SWEEP ------------------------------
      const sun = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "1% top",
          end: "2150 100%",
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });

      sun.fromTo("#bg_grad", { attr: { cy: "-50" } }, { attr: { cy: "330" } }, 0);
      sun.to("#bg_grad stop:nth-child(2)", { attr: { offset: "0.15" } }, 0);
      sun.to("#bg_grad stop:nth-child(3)", { attr: { offset: "0.18" } }, 0);
      sun.to("#bg_grad stop:nth-child(4)", { attr: { offset: "0.25" } }, 0);
      sun.to("#bg_grad stop:nth-child(5)", { attr: { offset: "0.46" } }, 0);
      sun.to("#bg_grad stop:nth-child(6)", { attr: { "stop-color": "#FF9171" } }, 0);

      // --- SCENE 2 (midground hills rising in) -----------------
      const scene2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "15% top",
          end: "40% 100%",
          scrub: 3,
          invalidateOnRefresh: true,
        },
      });

      scene2.fromTo("#h2-1", { y: 500, opacity: 0 }, { y: 0, opacity: 1 }, 0);
      scene2.fromTo("#h2-2", { y: 500 }, { y: 0 }, 0.1);
      scene2.fromTo("#h2-3", { y: 700 }, { y: 0 }, 0.1);
      scene2.fromTo("#h2-4", { y: 700 }, { y: 0 }, 0.2);
      scene2.fromTo("#h2-5", { y: 800 }, { y: 0 }, 0.3);
      scene2.fromTo("#h2-6", { y: 900 }, { y: 0 }, 0.3);

      // --- BATS ------------------------------------------------
      gsap.set("#bats", { transformOrigin: "50% 50%" });
      gsap.fromTo(
        "#bats",
        { opacity: 1, y: 400, scale: 0 },
        {
          y: 20,
          scale: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".scrollElement",
            start: "40% top",
            end: "70% 100%",
            scrub: 3,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.utils.toArray("#bats path").forEach((item, i) => {
                gsap.to(item as gsap.TweenTarget, {
                  scaleX: 0.5,
                  yoyo: true,
                  repeat: 9,
                  transformOrigin: "50% 50%",
                  duration: 0.15,
                  delay: 0.7 + i / 10,
                });
              });
              gsap.set("#bats", { opacity: 1 });
            },
          },
        }
      );

      // --- SUN INTENSIFIES / SKY GOES PURPLE -------------------
      const sun2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "2000 top",
          end: "5000 100%",
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });

      sun2.to("#sun", { attr: { offset: "1.4" } }, 0);
      sun2.to("#bg_grad stop:nth-child(2)", { attr: { offset: "0.7" } }, 0);
      sun2.to("#sun", { attr: { "stop-color": "#ffff00" } }, 0);
      sun2.to("#lg4 stop:nth-child(1)", { attr: { "stop-color": "#623951" } }, 0);
      sun2.to("#lg4 stop:nth-child(2)", { attr: { "stop-color": "#261F36" } }, 0);
      sun2.to("#bg_grad stop:nth-child(6)", { attr: { "stop-color": "#45224A" } }, 0);

      // --- TRANSITION INTO SCENE 3 -----------------------------
      const sceneTransition = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "60% top",
          end: "bottom 100%",
          scrub: 3,
          invalidateOnRefresh: true,
        },
      });

      sceneTransition.to("#h2-1", {
        y: -height - 100,
        scale: 1.5,
        transformOrigin: "50% 50%",
      }, 0);
      sceneTransition.to("#bg_grad", { attr: { cy: "-80" } }, 0.0);
      sceneTransition.to("#bg2", { y: 0 }, 0);

      // --- SCENE 3 (night sky, stars, text, arrow) -------------
      const scene3 = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "70% 50%",
          end: "bottom 100%",
          scrub: 3,
          invalidateOnRefresh: true,
        },
      });

      scene3.fromTo("#h3-1", { y: 300 }, { y: -550 }, 0);
      scene3.fromTo("#h3-2", { y: 800 }, { y: -550 }, 0.03);
      scene3.fromTo("#h3-3", { y: 600 }, { y: -550 }, 0.06);
      scene3.fromTo("#h3-4", { y: 800 }, { y: -550 }, 0.09);
      scene3.fromTo("#h3-5", { y: 1000 }, { y: -550 }, 0.12);

      scene3.fromTo("#stars", { opacity: 0 }, { opacity: 0.5, y: -500 }, 0);
      scene3.fromTo("#arrow2", { opacity: 0 }, { opacity: 0.7, y: -710 }, 0.25);
      scene3.fromTo("#text2", { opacity: 0 }, { opacity: 0.7, y: -710 }, 0.3);

      scene3.to("#bg2-grad", { attr: { cy: 600 } }, 0);
      scene3.to("#bg2-grad", { attr: { r: 500 } }, 0);

      // --- FALLING STAR ---------------------------------------
      gsap.set("#fstar", { y: -400 });
      const fstarTL = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollElement",
          start: "4200 top",
          end: "6000 bottom",
          scrub: 2,
          invalidateOnRefresh: true,
          onEnter: () => gsap.set("#fstar", { opacity: 1 }),
          onLeave: () => gsap.set("#fstar", { opacity: 0 }),
        },
      });
      fstarTL.to("#fstar", { x: -700, y: -250, ease: "power2.out" }, 0);

      // --- TWINKLING STARS LOOP (independent of scroll) --------
      const starPaths = [1, 3, 5, 8, 11, 15, 17, 18, 25, 28, 30, 35, 40, 45, 48];
      const delays =     [0.8, 1.8, 1, 1.2, 0.5, 2, 1.1, 1.4, 1.1, 0.9, 1.3, 2, 0.8, 1.8, 1];
      starPaths.forEach((index, i) => {
        gsap.fromTo(
          `#stars path:nth-of-type(${index})`,
          { opacity: 0.3 },
          {
            opacity: 1,
            duration: 0.3,
            repeat: -1,
            repeatDelay: delays[i],
          }
        );
      });

      // Final sanity refresh so ScrollTrigger measures AFTER we've mutated DOM
      ScrollTrigger.refresh();
      console.log("[ParallaxScroll] GSAP timelines created & ScrollTrigger refreshed");
    }, containerRef);

    return () => {
      console.log("[ParallaxScroll] cleanup");
      window.removeEventListener("scroll", handleScroll);

      // clean up gsap/ScrollTrigger
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf("*");

      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black text-white"
    >
      {/* The visual scene is pinned full-viewport. */}
      <svg
        ref={svgRef}
        className="fixed top-0 left-0 w-full h-screen z-[3] block"
        viewBox="0 0 750 500"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Scene 1 Gradient */}
          <linearGradient
            id="grad1"
            x1="-154.32"
            y1="263.27"
            x2="-154.32"
            y2="374.3"
            gradientTransform="matrix(-1, 0, 0, 1.36, 231.36, -100.14)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.07" stopColor="#9c536b" />
            <stop offset="0.98" stopColor="#d98981" />
          </linearGradient>
          <radialGradient id="bg_grad" cx="375" cy="-30" r="318.69" gradientUnits="userSpaceOnUse">
            <stop offset="0.1" stopColor="#F5C54E" id="sun" />
            <stop offset="0.1" stopColor="#FFDBA6" />
            <stop offset="0.0" stopColor="#F7BB93" />
            <stop offset="0.0" stopColor="#F2995E" />
            <stop offset="0.0" stopColor="#f07560" />
            <stop offset="0.8" stopColor="#FFAB93" />
          </radialGradient>
          <linearGradient id="grad2" x1="242.5" y1="356.25" x2="750" y2="356.25" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbbd93" />
            <stop offset="0.98" stopColor="#c46976" />
          </linearGradient>
          <linearGradient id="grad3" x1="467.26" y1="500" x2="467.26" y2="225.47" gradientUnits="userSpaceOnUse">
            <stop offset="0.01" stopColor="#ffb8bd" />
            <stop offset="1" stopColor="#914d64" />
          </linearGradient>
          <linearGradient id="grad4" x1="216.56" y1="227.64" x2="191.14" y2="600.82" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#70375a" />
            <stop offset="0.96" stopColor="#8a6e95" />
          </linearGradient>
          <linearGradient id="grad5" x1="1" y1="413.12" x2="340.58" y2="413.12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#433d6c" />
            <stop offset="1" stopColor="#392e54" />
          </linearGradient>
          <linearGradient id="grad6" x1="454.13" y1="295.96" x2="454.13" y2="498.93" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2b2850" />
            <stop offset="0.99" stopColor="#563a6a" />
          </linearGradient>
          <linearGradient id="grad7" x1="434.38" y1="391.96" x2="474.27" y2="516.33" gradientUnits="userSpaceOnUse">
            <stop offset="0.3" stopColor="#1c1b38" />
            <stop offset="0.38" stopColor="#201e3e" />
            <stop offset="0.9" stopColor="#383263" />
          </linearGradient>
          <linearGradient id="grad8" x1="259.18" y1="335.54" x2="213.65" y2="500.39" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0e0a1a" />
            <stop offset="0.3" stopColor="#100d1f" />
            <stop offset="0.64" stopColor="#17142c" />
            <stop offset="0.95" stopColor="#201f3f" />
          </linearGradient>
          <linearGradient id="grad9" x1="508.16" y1="321.39" x2="726.97" y2="623.69" gradientUnits="userSpaceOnUse">
            <stop offset="0.01" stopColor="#120e22" />
            <stop offset="1" stopColor="#221d42" />
          </linearGradient>

          {/* Scene2 Gradient */}
          <linearGradient id="lg4" x1="641.98" y1="274.9" x2="638.02" y2="334.36" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2c2c50" />
            <stop offset="1" stopColor="#434375" />
          </linearGradient>
          <linearGradient id="lg5" x1="172.37" y1="286.02" x2="171.33" y2="343.08" xlinkHref="#lg4" />
          <linearGradient id="lg6" x1="505.71" y1="261.55" x2="504.61" y2="322.08" xlinkHref="#lg4" />
          <linearGradient id="lg7" x1="301.32" y1="260.99" x2="295.66" y2="345.9" xlinkHref="#lg4" />
          <linearGradient id="lg8" x1="375.59" y1="381.01" x2="373.3" y2="507.08" xlinkHref="#lg4" />

          {/* Scene3 Gradient */}
          <radialGradient
            id="bg2-grad"
            cx="365.22"
            cy="500"
            r="631.74"
            gradientTransform="translate(750 552.6) rotate(180) scale(1 1.11)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="hsla(349, 94%, 75%, 1)" />
            <stop offset="0.12" stopColor="hsla(342, 49%, 62%, 1)" />
            <stop offset="0.18" stopColor="hsla(328, 37%, 56%, 1)" />
            <stop offset="0.33" stopColor="hsla(281, 33%, 48%, 1)" />
            <stop offset="0.41" stopColor="hsla(268, 38%, 48%, 1)" />
            <stop offset="0.45" stopColor="hsla(266, 38%, 43%, 1)" />
            <stop offset="0.55" stopColor="hsla(261, 37%, 32%, 1)" />
            <stop offset="0.64" stopColor="hsla(253, 36%, 24%, 1)" />
            <stop offset="0.72" stopColor="hsla(244, 33%, 19%, 1)" />
            <stop offset="0.78" stopColor="hsla(240, 33%, 17%, 1)" />
          </radialGradient>

          <radialGradient
            id="fstar-grad"
            cx="1362.39"
            cy="-53.7"
            r="39.39"
            gradientTransform="matrix(0.89, -0.45, -0.45, -0.89, -473.7, 640.57)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.06" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="0.12" stopColor="#fff" stopOpacity="0.62" />
            <stop offset="0.19" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="0.26" stopColor="#fff" stopOpacity="0.31" />
            <stop offset="0.33" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="0.41" stopColor="#fff" stopOpacity="0.11" />
            <stop offset="0.49" stopColor="#fff" stopOpacity="0.05" />
            <stop offset="0.59" stopColor="#fff" stopOpacity="0.01" />
            <stop offset="0.72" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="linear-gradient" x1="472" y1="461.56" x2="872.58" y2="461.56" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fd75a8" />
            <stop offset="1" stopColor="#5a2d81" />
          </linearGradient>
          <linearGradient id="linear-gradient-2" x1="214.61" y1="508.49" x2="166.09" y2="361.12" xlinkHref="#linear-gradient" />
          <linearGradient id="linear-gradient-3" x1="57.65" y1="508.01" x2="448.08" y2="508.01" xlinkHref="#linear-gradient" />
          <linearGradient id="linear-gradient-4" x1="193.48" y1="508.3" x2="761.05" y2="508.3" xlinkHref="#linear-gradient" />
        </defs>

        {/* Background sky / gradient */}
        <rect id="bg" width="750" height="500" opacity="0.8" fill="url(#bg_grad)" />

        {/* Foreground clouds (scene 1 layer) */}
        <g id="clouds" fill="#fefefe">
          <path
            id="cloud4"
            transform="translate(600 0)"
            d="M402.34,341.68c9.9-10.24,23.76-7.43,36.05-5.48C448,332,458.88,329,468.9,334c-.95-7.91,8.65-14.92,15.9-11.61-3.34-11.77,13-13.9,20.53-8.34A13.53,13.53,0,0,1,522,310.16c2.64-18.11,27.85-24.13,38.38-9.17,3.54-5.51,12.12-6.88,17.2-2.74,6.59-43.22,70.78-27.93,65.83,12.62,14.7-4.43,32,6.72,34.08,21.93,5.76-2.23,29.28,1,21.76,9.26"
          />
          <path
            id="cloud3"
            transform="translate(600 0)"
            d="M382.94,363.16c-7-10.5-18.72-9.06-28.19-4.53-12.19-6.71-26.73-11.74-39.62-3.13,1-15.45-18-25.51-28-12.41-14.59-29.67-56.68-34.41-72-3.09-1.41,4-4.73,6.07-8.10,2.88-23.13-25.66-57.12-30.25-67.73,8.21-13.05-1.88-33.42-9.15-37.47,10.07a38.08,38.08,0,0,0-36.36,2.11"
          />
          <path
            id="cloud2"
            transform="translate(-600 0)"
            d="M506.86,233.56c9.62-3.21,23.27-4,33.88-2.17,0-5.7,10.4-6.68,14-3.58,10.32-12.45,29.93-5.12,40.08,0,10.06-6.52,27.67-9.72,33.93,2.42,5.53-.13,15.88-3.23,18.8,2.94a31.53,31.53,0,0,1,18.21.64"
          />
          <path
            id="cloud1"
            transform="translate(-600 0)"
            d="M402.18,271.3c-7.57-7.46-18.46-7.52-28.05-5.3-6.75-8.79-20.54-13.18-27.24-1.45-10.4-11.06-30.66-24.2-37.74-2.24a13.1,13.1,0,0,0-17.76,1.47c-11.23-25.69-58.46-41.29-64.24-4.06-9-8.26-20.15-2.62-27.47,4.4-11-2.87-22.18-7.58-31.72,2.7-8.44-.75-18.1-2.8-24.71,4.57"
          />
        </g>

        {/* Scene 2 */}
        <g id="scene2">
          <g id="bats" style={{ opacity: 0 }}>
            <path
              d="M486.65,187a9.22,9.22,0,0,1-4.29,6.38l-.06-.06c-.05-1.13-.06-2.62-.94-3.52a3.34,3.34,0,0,1,.15,1.63,1.9,1.9,0,0,0-1.66-.09,3.31,3.31,0,0,1,.33-1.61c-1,.81-1.05,2.22-1.37,3.38-3.9-5.13-5.67-10.29-13.64-9.74,5.67,3.29,5.9,10.62,12.85,11.87.09,6.46,4.06,6.69,4.88.28l-.2.1.18-.35c0,.08,0,.16,0,.25,7-.48,8.08-7.73,14.09-10.38A22.64,22.64,0,0,0,486.65,187Z"
              fill="#112129"
            />
            <path
              d="M390.93,226.87c2.22,2.08,2,4.89.48,7.24,1.83-1.75,8.12,2.24,7,4.89,2.51-4.08,4.36.31,5.85,2.31,1.26-2.7,3.68-6,5.7-2.13-.93-2.73,5.66-6.2,7.34-4.32-3.67-5.08,3.49-10.18,7.21-7.31-.39-.7-4.61-4.33-12.39-3.17,3.63,5.77-3.22,9.07-5.56,9.51a2.88,2.88,0,0,0-.64-2.28c-.36.36-.32,1.06-.52,1.48a7.6,7.6,0,0,0-2.13-.14c0-.42-.15-1.09-.5-1.32a4,4,0,0,0-.68,2.32c-2.39-.72-8.67-4.51-4.66-9.87-7.67-1.78-12.17,1.51-12.61,2.17C385.25,225.74,389.24,225.21,390.93,226.87Z"
              fill="#112129"
            />
          </g>

          <g id="hills2">
            <path
              id="h2-6"
              d="M524.28,418.82c6.36,0,80.19-14.81,103.12-36.53S655.28,345.8,679,359.64s33.69,18.54,46.63,18.82a158.62,158.62,0,0,1,23.88,2.4V447L632,458.92Z"
              fill="url(#lg4)"
            />
            <path
              id="h2-5"
              d="M294.06,498.2l49.09-66.93s-64-6.48-93.59-31.29-63.47-49.78-87.15-41.46-81.7,4.44-98.73,15S.1,387.08.1,387.08l.37,60.18L209.75,498.2Z"
              fill="url(#lg5)"
            />
            <path
              id="h2-4"
              d="M264.94,449.2s61-16.39,94.07-37.28,61.37-37.2,73.53-36.12,69.9-40,80.18-42.62,13.55-.37,29,1.85,22-5.27,34.52,6.39,43.29,34.86,75.51,48.52c25.88,11,91.48,28.88,91.48,28.88l-31.58,67.73-326.93,9.27Z"
              fill="url(#lg6)"
            />
            <path
              id="h2-3"
              d="M.47,469.58V420s113.73-2.74,171.72-26.68,101.69-72.29,134.53-52,31.37-18.48,61.9,13.28S446.68,393.48,478,406.86s113.08,26.06,113.08,26.06l-59.28,53.4L272.55,485Z"
              fill="url(#lg7)"
            />
            <path
              id="h2-2"
              d="M749.55,500V398.27l-38.48-6.67s-29.86,12.13-63,11.53-39.61-7.26-70.33-13.41-72.58,21.4-105.61,21.4-75.5-17.78-110.64-17.78c-24.85,0-90.08,20.12-110.82,18.48s-51.11-20.42-82-6.26S.47,409.26.47,409.26V500Z"
              fill="url(#lg8)"
            />
            <path
              id="h2-1"
              style={{ opacity: 0 }}
              d="M.47,500V324.85s116.43,24.83,177.13,29.36S277.37,375,310.33,377.93s65.22-29,91.22-32.64,63.07,15.71,88.38,22.26,76.57-20.37,109.12-23.06,61.94,11.25,86.53,16.11,63.78-13.79,63.78-13.79V500Z"
              fill="#1d1d3a"
            />
          </g>
        </g>

        {/* Scene 3 */}
        <g id="scene3" style={{ visibility: "hidden" }}>
          <rect
            id="bg2"
            y="-59.8"
            width="750"
            height="612.4"
            transform="translate(750 492.8) rotate(180)"
            fill="url(#bg2-grad)"
          />

          <g id="fstar">
            <image
              width="707"
              height="429"
              transform="translate(728.46 16.5) scale(0.24)"
              xlinkHref="https://i.ibb.co/TWfhqRG/fstar.png"
            />
            <circle
              cx="768.6"
              cy="78.72"
              r="39.39"
              transform="translate(64.22 396.2) rotate(-30.11)"
              fill="url(#fstar-grad)"
              style={{ mixBlendMode: "overlay" }}
            />
          </g>

          <g id="stars" fill="#fff" style={{ opacity: 0 }}>
            <path d="M699.71,128.24a1,1,0,1,1-1-1A1,1,0,0,1,699.71,128.24Z" />
            <path d="M643.78,37.74a1,1,0,1,1-1-1A1,1,0,0,1,643.78,37.74Z" />
            <path d="M666.33,139.16a1.46,1.46,0,1,1-1.46-1.45A1.46,1.46,0,0,1,666.33,139.16Z" />
            <circle cx="636.11" cy="77.24" r="1.46" />
            <path d="M714.4,31.27a1.46,1.46,0,1,1-1.46-1.45A1.46,1.46,0,0,1,714.4,31.27Z" />
          </g>

          <g id="hills3" transform="translate(0, -110)">
            <g id="info2">
              <polygon
                id="arrow2"
                points="395.5 482.2 393.4 484.3 375.2 466.1 357 484.3 354.9 482.2 375.2 461.9 395.5 482.2"
                style={{
                  fill: "#fff",
                  stroke: "#231f20",
                  strokeMiterlimit: 10,
                  strokeWidth: ".5px",
                }}
              />
              <path
                id="text2"
                d="m271.8,526.2c8.4,7,22.4-4.5,8.1-9.8-17.8-5.3-3.8-24,9-16.3l-1.1,3.4c-8.6-5.6-19.3,5-5.8,9.5,18.5,6.4,2.2,25.6-11.3,16.7l1.1-3.5Zm40.8,4.2c-23.8,9.7-23.8-30.5,0-21.6l-1,3.3c-17.5-7.5-16.8,23,.1,15.2l.7,3.2Zm4.9-15.1c0-2.7,0-5.1-.2-7.2h3.7v4.5h.3c1.2-3.5,4.3-5.6,7.6-4.9v4c-10-1.9-6.7,14-7.3,19.6h-4.2v-15.9Zm36.1,4.2c0,16.7-23,15.9-22.6.4-.6-16.2,23.2-16.1,22.6-.4Zm-18.4.2c-.3,11.6,14.4,11.7,14.1,0,.6-11.5-14.6-11.7-14.1,0Zm23.7-22.4h4.2v33.9h-4.2v-33.9Zm11.3,0h4.2v33.9h-4.2v-33.9Zm21.6,2.2c10.5-4.2,28.8,5.4,13.7,14.4h0c16.8,8.4-.2,21.4-13.7,17.3v-31.7Zm4.2,13.2c14.5,2.4,13.8-13.7,0-10.4v10.4Zm0,15.4c15.3,3,15.9-14.6,0-12.3v12.3Zm34.4,3.2l-.3-2.9h-.1c-14.1,12.9-22.3-13.8-.2-11.8,1.4-5.4-7.1-7.5-11.3-4.1l-1-2.8c19.1-8.7,16,9.8,16.8,21.6h-3.8Zm-.6-11.8c-7.5-1.9-14.6,7.4-5.8,9.2,5.7-.1,6.2-5.1,5.8-9.2Zm27.3,10.9c-23.8,9.7-23.8-30.5,0-21.6l-1,3.3c-17.5-7.5-16.8,23,.1,15.2l.7,3.2Zm9.1-11.7h0c1.3-1.9,7.3-8.7,8.8-10.6h5.1l-8.9,9.5,10.2,13.6h-5.1l-8-11.1-2.2,2.4v8.7h-4.2v-33.9h4.2v21.4Z"
                style={{
                  fill: "#fff",
                  stroke: "#231f20",
                  strokeMiterlimit: 10,
                  strokeWidth: ".5px",
                }}
              />
            </g>
            <polygon
              id="h3-5"
              points="756.3 330.5 750.6 327 742.4 331.1 719.1 317.4 705.9 311.9 695.1 307.3 688 314.2 675.7 336.9 665.3 346.8 657.8 353.1 641.2 353.5 633.5 362.6 626.6 373.1 618.5 378.9 596.8 411.3 588.9 404.9 578.9 406.5 539.9 443.4 472 493.8 556 490.9 756.1 490.9 756.3 330.5"
              style={{ fill: "url(#linear-gradient)", mixBlendMode: "multiply" }}
            />
            <path
              id="h3-4"
              d="m453.1,471c-20-.3-48.5-14.4-68.1-10.1-13.5-4.7-34.5-19.9-48.2-23.8-4.1-5.1-13.2-13.6-18.3-16.9l-21.4,5.1c-25.8-9-71.7-48.8-92.2-70.8-23.3,8-24.4,17.5-52.5,13.5l-26.5-23.2c-7.3,4.7-21.4,3.1-28.9,0-10.3-12.3-37.7-44.9-50.7-51.2l-26.6,39.7-21.4-3.8v161.3s204.1-2.7,204.1-2.7l2.2,2.7h252.5l-3.8-19.9Z"
              style={{ fill: "url(#linear-gradient-2)", mixBlendMode: "multiply" }}
            />
            <path
              id="h3-3"
              d="m369.3,490.9h71.8l-20.4-23.4c-12.5-1.8-31-7.3-43-11.4-4.4,2-12-2.4-15.7-5.3-24-16.4-52.4-28.7-75.6-47.8l-36.3,12.9-13.2-10.5-44.3,23c-4.1-6-13.7-11.8-19.9-12.4-29.3,7.5-89.7,52.2-115.1,72.8,56.6,2.7,251.8,2.1,311.6,2.1Z"
              style={{ fill: "url(#linear-gradient-3)", mixBlendMode: "multiply" }}
            />
            <path
              id="h3-2"
              d="m756.1,490.9l-8-59.6-53-.2c-15.1-2.4-50.9-7.7-64.2,4.9-19.1-2.9-49.7-19.3-69.1-17.5-5.3-5.7-16.9-13.1-23.7-14.8l-26.9,20.4c-26.9,1.9-30.4-8.1-52.6-17.2l-12.9,14.9c-8.8-4.9-25.3-12.2-33.6-18.1-22.7,22.2-39,46.1-70,32.9-19.4,17.9-46.6,30.6-69.4,40.5-20.6-4.2-50.8,9.7-71.7,9.9l-.8,4h555.8Z"
              style={{ fill: "url(#linear-gradient-4)", mixBlendMode: "multiply" }}
            />
            <g id="h3-1">
              <path d="m754.1,270.8c-9.1,15.3-28.2,45.6-38,60-4.6,3.1-20.4,7.4-25.6,8.9l-46.8,61.3c-25.8,9.4-65.6,40.6-89.2,55.6l-7.1-3c-18.2,15-47.2,22.8-68.5,20.5-9.8-6.6-45.3-31-54.9-36-26.3,17.9-45.8,32-76.1,17.6-5.8,2.2-16.6,8.4-21.7,12.7-6.4.6-19,3.9-25.1,6.5-13.7-7.2-27.7-13.3-31.5-9.4l-36.8-37.5-8.1,6.7c-24.6-11.4-37.1-14.9-54.1-43.6l-8.4,4.8c-26.5-10.4-21.1-21.5-39-31.8-10.5,4.6-25.1,12-37.8,19.3-14.4-13.7-32-38.9-41.9-58.3-16.4-6.4-30.9-30.4-40.6-47.6l-4.7,2v388.6h758.2v-397l-2.2-.2Z" />
            </g>
          </g>
        </g>

        {/* Scene 1 hills - simplified */}
        <g id="scene1">
          <path id="h1-1" d="M0,500V400l100-50,200,30,150-80,200,50,100,30V500Z" fill="url(#grad2)" />
          <path id="h1-2" d="M0,500V420l150-40,180,20,170-60,150,40,100,20V500Z" fill="url(#grad3)" />
          <path id="h1-3" d="M0,500V440l120-30,160,15,180-50,140,35,150,10V500Z" fill="url(#grad4)" />
          <path id="h1-4" d="M0,500V460l100-20,180,10,160-40,180,30,130,10V500Z" fill="url(#grad5)" />
          <path id="h1-5" d="M0,500V470l130-15,150,8,170-30,150,20,150,7V500Z" fill="url(#grad6)" />
          <path id="h1-6" d="M0,500V480l100-10,160,5,180-25,160,15,150,5V500Z" fill="url(#grad7)" />
          <path id="h1-7" d="M0,500V485l120-8,150,4,170-20,150,12,160,2V500Z" fill="url(#grad8)" />
          <path id="h1-8" d="M0,500V490l100-5,180,3,160-15,180,10,130,2V500Z" fill="url(#grad9)" />
          <path id="h1-9" d="M0,500V492l130-3,150,2,170-12,150,8,150,3V500Z" fill="url(#grad9)" />
        </g>

        {/* Foreground elements / overlays */}
        <g id="cloudsBig-L">
          <ellipse cx="150" cy="150" rx="80" ry="40" fill="#fefefe" opacity="0.6" />
        </g>
        <g id="cloudsBig-R">
          <ellipse cx="600" cy="150" rx="80" ry="40" fill="#fefefe" opacity="0.6" />
        </g>
        <g id="cloudStart-L" opacity="0">
          <ellipse cx="100" cy="100" rx="60" ry="30" fill="#fefefe" opacity="0.5" />
        </g>
        <g id="cloudStart-R" opacity="0">
          <ellipse cx="650" cy="100" rx="60" ry="30" fill="#fefefe" opacity="0.5" />
        </g>

        <g id="bird">
          <path d="M375,200 L380,195 L385,200 L380,205 Z" fill="#112129" />
        </g>

        <g id="info">
          <text
            x="375"
            y="250"
            textAnchor="middle"
            fill="#fff"
            fontSize="24"
            fontWeight="bold"
          >
            Scroll Down
          </text>
        </g>
      </svg>

      {/* This block defines the scrollable distance and acts as ScrollTrigger trigger.
          It's now IN NORMAL FLOW, not absolute, so ScrollTrigger can measure it immediately. */}
      <div className="scrollElement h-[6000px] w-full pointer-events-none" />
    </div>
  );
}
