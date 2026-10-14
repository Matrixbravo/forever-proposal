
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { proposal } from "@/lib/config";

type Position = { x: number; y: number };

type Message = {
  text: string;
  x: number;
  y: number;
} | null;

export default function Home() {
  const router = useRouter();

  const stageRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const lastMove = useRef(0);
  const tries = useRef(0);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [noPosition, setNoPosition] = useState<Position | null>(null);
  const [message, setMessage] = useState<Message>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    return () => {
      if (messageTimer.current) {
        clearTimeout(messageTimer.current);
      }
    };
  }, []);

  const moveNo = useCallback((pointerX?: number, pointerY?: number) => {
    const stage = stageRef.current;
    const noButton = noRef.current;
    const yesButton = yesRef.current;

    if (!stage || !noButton) return;

    // Avoid repeated movements within milliseconds.
    const now = Date.now();
    if (now - lastMove.current < 160) return;
    lastMove.current = now;

    const area = stage.getBoundingClientRect();
    const noBounds = noButton.getBoundingClientRect();
    const yesBounds = yesButton?.getBoundingClientRect();

    const maxX = Math.max(0, area.width - noBounds.width - 8);
    const maxY = Math.max(0, area.height - noBounds.height - 8);

    let newX = maxX / 2;
    let newY = maxY / 2;

    // Find a random spot away from Yes and the cursor.
    for (let i = 0; i < 50; i++) {
      const x = 4 + Math.random() * Math.max(0, maxX - 4);
      const y = 4 + Math.random() * Math.max(0, maxY - 4);

      const overlapsYes =
        yesBounds &&
        x + noBounds.width + 10 > yesBounds.left - area.left &&
        x - 10 < yesBounds.right - area.left &&
        y + noBounds.height + 10 > yesBounds.top - area.top &&
        y - 10 < yesBounds.bottom - area.top;

      const distanceFromOldPosition = Math.hypot(
        x - (noBounds.left - area.left),
        y - (noBounds.top - area.top)
      );

      const distanceFromPointer =
        pointerX === undefined || pointerY === undefined
          ? Infinity
          : Math.hypot(
              x + area.left + noBounds.width / 2 - pointerX,
              y + area.top + noBounds.height / 2 - pointerY
            );

      if (
        !overlapsYes &&
        distanceFromOldPosition > 60 &&
        distanceFromPointer > 90
      ) {
        newX = x;
        newY = y;
        break;
      }
    }

    setNoPosition({
      x: Math.round(newX),
      y: Math.round(newY),
    });

    const index = tries.current % proposal.noMessages.length;
    const funnyMessage = proposal.noMessages[index];

    tries.current += 1;
    setAttempts(tries.current);

    const mouseX = pointerX ?? noBounds.left;
    const mouseY = pointerY ?? noBounds.top;

    setMessage({
      text: funnyMessage,
      x: Math.max(10, Math.min(mouseX + 8, window.innerWidth - 245)),
      y: Math.max(10, Math.min(mouseY - 65, window.innerHeight - 60)),
    });

    if (messageTimer.current) {
      clearTimeout(messageTimer.current);
    }

    messageTimer.current = setTimeout(() => {
      setMessage(null);
    }, 1600);
  }, []);

  function handleMouseMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const button = noRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();

    const distance = Math.hypot(
      event.clientX - (rect.left + rect.width / 2),
      event.clientY - (rect.top + rect.height / 2)
    );

    // Escape when the mouse gets close.
    if (distance < 85) {
      moveNo(event.clientX, event.clientY);
    }
  }

  function handleYes() {
    router.push("/yes");
  }

  return (
    <main className="page proposal-page">
      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i}>♥</span>
        ))}
      </div>

      <section className="card proposal-card">
        <p className="eyebrow">✦ A LITTLE QUESTION FROM MY HEART ✦</p>

        <div className="big-heart">♥</div>

        <p className="intro">{proposal.intro}</p>

        <h1>
          Hey, <em>{proposal.herName}</em>
        </h1>

        <p className="subtitle">{proposal.subtitle}</p>

        <div className="divider">✧</div>

        <h2>{proposal.question}</h2>

        <p className="small-hint">
          Choose carefully... one button is a little shy.
        </p>

        <div
          className="button-area"
          ref={stageRef}
          onPointerMove={handleMouseMove}
        >
          <button
            ref={yesRef}
            type="button"
            className="yes-button"
            onClick={handleYes}
            style={{
              transform: `scale(${Math.min(1 + attempts * 0.025, 1.15)})`,
            }}
          >
            {proposal.yesButton}
          </button>

          <button
            ref={noRef}
            type="button"
            className="no-button"
            style={
              noPosition
                ? {
                    left: noPosition.x,
                    top: noPosition.y,
                  }
                : undefined
            }
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") {
                moveNo(e.clientX, e.clientY);
              }
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              moveNo(e.clientX, e.clientY);
            }}
            onClick={(e) => {
              e.preventDefault();
              moveNo();
            }}
            onFocus={() => moveNo()}
          >
            {proposal.noButton}
          </button>
        </div>

        <p className="closing">
          P.S. I promise a lifetime of love, laughter and adventures. ♡
        </p>
      </section>

      {message && (
        <div
          className="cursor-message"
          role="status"
          style={{
            left: message.x,
            top: message.y,
          }}
        >
          {message.text}
        </div>
      )}

      <footer>
        Made with all my heart ♡ {proposal.yourName}
      </footer>
    </main>
  );
}
