"use client";

import { RavenTransition } from "@/components/RavenTransition";

export default function Page() {
  return (
    <main className="page">
      <div className="page__content">
        <p className="headline">Raven Morph</p>
        <h1 className="title">Summon the Raven to Shapeshift Between Worlds</h1>
        <p className="subtitle">
          A cinematic image morph inspired by Raven&apos;s shadow magic. Slide your
          own imagery under the raven and replay the sequence to unveil a dramatic
          transformation.
        </p>
        <RavenTransition />
      </div>
      <footer className="footer">Crafted with shadow &amp; light • Raven Transition</footer>
    </main>
  );
}
