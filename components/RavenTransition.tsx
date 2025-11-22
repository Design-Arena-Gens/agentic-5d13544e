'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';

type Stage = 'idle' | 'animating' | 'complete';

type FeatherSpec = {
  id: number;
  angle: number;
  delay: number;
  duration: number;
  x: number;
  y: number;
  distance: number;
  hue: number;
};

const FEATHER_COUNT = 14;

const ravenPath =
  'M5 60 C 35 40, 64 14, 120 8 C 98 23, 84 38, 136 36 C 156 18, 192 12, 204 18 C 188 36, 174 62, 212 84 C 178 80, 148 84, 120 96 L 138 116 L 106 106 L 100 132 L 86 108 L 58 118 L 78 94 C 52 88, 30 74, 5 60 Z';

const ease = [0.16, 1, 0.3, 1] as const;

const createFeatherField = (): FeatherSpec[] =>
  Array.from({ length: FEATHER_COUNT }, (_, index): FeatherSpec => {
    const seed = (index + 1) * 137;
    const angle = (index % 2 === 0 ? -1 : 1) * (14 + (seed % 11));
    const x = -30 + (seed % 60);
    const y = -30 + ((seed >> 3) % 40);
    const distance = 120 + ((seed >> 5) % 90);
    const duration = 1.4 + ((seed % 7) * 0.15);
    const delay = index * 0.07;
    const hue = 215 + ((seed >> 4) % 15);

    return {
      id: index,
      angle,
      x,
      y,
      distance,
      duration,
      delay,
      hue
    };
  });

export function RavenTransition() {
  const [stage, setStage] = useState<Stage>('idle');
  const [cycle, setCycle] = useState(0);
  const feathers = useMemo(createFeatherField, [cycle]);
  const revealControls = useAnimationControls();

  const runTransition = useCallback(() => {
    setStage('animating');
    revealControls.stop();
    revealControls.set({
      clipPath: 'polygon(45% 52%, 48% 50%, 45% 48%, 42% 50%)'
    });

    requestAnimationFrame(() => {
      void revealControls.start({
        clipPath: 'polygon(-20% 120%, 120% 120%, 120% -20%, -20% -20%)',
        transition: { duration: 2.6, ease }
      });
    });
  }, [revealControls]);

  useEffect(() => {
    if (stage === 'animating') {
      const timeout = setTimeout(() => setStage('complete'), 2800);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [stage]);

  useEffect(() => {
    const timer = setTimeout(runTransition, 900);
    return () => clearTimeout(timer);
  }, [runTransition]);

  const handleReplay = () => {
    if (stage === 'animating') return;

    setCycle((current) => current + 1);
    setStage('idle');

    setTimeout(() => {
      runTransition();
    }, 220);
  };

  return (
    <section className="raven">
      <div className="raven__stage">
        <Image
          src="/images/before.svg"
          alt="Before transformation"
          fill
          priority
          className="raven__image raven__image--base"
          sizes="(max-width: 1024px) 92vw, 980px"
        />

        <motion.div
          className="raven__image-wrapper"
          initial={{ clipPath: 'polygon(48% 50%, 48% 50%, 48% 50%, 48% 50%)' }}
          animate={revealControls}
          style={{ mixBlendMode: 'screen' }}
        >
          <Image
            src="/images/after.svg"
            alt="After transformation"
            fill
            className="raven__image"
            sizes="(max-width: 1024px) 92vw, 980px"
          />
          <div className="raven__glow" aria-hidden />
        </motion.div>

        <AnimatePresence>
          {stage !== 'idle' && (
            <motion.svg
              key={`raven-${cycle}`}
              viewBox="0 0 220 140"
              className="raven__silhouette"
              initial={{ x: '-28%', y: '-18%', scale: 0.65, opacity: 0 }}
              animate={{
                x: '72%',
                y: '-34%',
                scale: 1.1,
                opacity: 1,
                transition: {
                  duration: 2.1,
                  ease
                }
              }}
              exit={{
                opacity: 0,
                y: '-50%',
                x: '120%',
                transition: { duration: 0.6, ease: [0.4, 0, 1, 1] }
              }}
            >
              <motion.path
                d={ravenPath}
                fill="url(#featherShine)"
                initial={{ pathLength: 0.6 }}
                animate={{
                  pathLength: 1,
                  transition: { duration: 1.8, ease }
                }}
              />
              <defs>
                <radialGradient id="featherShine" cx="30%" cy="42%" r="75%">
                  <stop offset="0%" stopColor="#0f162a" />
                  <stop offset="55%" stopColor="#0c1524" />
                  <stop offset="100%" stopColor="#02040c" />
                </radialGradient>
              </defs>
            </motion.svg>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === 'animating' &&
            feathers.map((feather) => (
              <motion.span
                key={`${feather.id}-${cycle}`}
                className="raven__feather"
                initial={{
                  opacity: 0,
                  x: feather.x,
                  y: feather.y,
                  rotate: feather.angle
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: feather.x + feather.distance,
                  y: feather.y + feather.distance * 0.4,
                  rotate: feather.angle + (feather.distance > 140 ? 160 : 90)
                }}
                transition={{
                  duration: feather.duration,
                  delay: feather.delay,
                  ease
                }}
                style={{
                  background: `linear-gradient(140deg, rgba(32,45,68,0.95), rgba(14,17,36,0.1))`,
                  boxShadow: `0 8px 18px rgba(3,6,14,0.35), inset 0 0 0.5px rgba(255,255,255,0.25)`,
                  filter: `hue-rotate(${feather.hue - 220}deg)`
                }}
              />
            ))}
        </AnimatePresence>

        <div className="raven__vignette" aria-hidden />
      </div>

      <div className="raven__actions">
        <button
          type="button"
          className="raven__button"
          onClick={handleReplay}
          aria-label="Replay transition"
        >
          {stage === 'animating' ? 'Summoning…' : 'Replay the Raven'}
        </button>
        <p className="raven__hint">
          Drop your own hero images into <code>public/images</code> and hit replay to
          see them morph through the raven.
        </p>
      </div>
    </section>
  );
}
