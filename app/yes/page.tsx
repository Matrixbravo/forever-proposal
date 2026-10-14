
"use client";

import { useEffect, useRef, useState } from "react";
import { proposal } from "@/lib/config";

export default function YesPage() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [musicError, setMusicError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;

    // Try autoplay. Some browsers require a Play-button tap.
    audio.play().catch(() => {
      setPlaying(false);
    });
  }, []);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setMusicError(false);
      } catch {
        setMusicError(true);
      }
    } else {
      audio.pause();
    }
  }

  return (
    <main className="page celebration-page">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 48 }, (_, i) => (
          <span
            key={i}
            className={i % 3 === 0 ? "confetti-heart" : "confetti-piece"}
            style={{
              left: `${(i * 37 + 7) % 100}%`,
              animationDelay: `${(i % 13) * -0.48}s`,
              animationDuration: `${4 + (i % 7) * 0.65}s`,
            }}
          >
            {i % 3 === 0 ? "♥" : ""}
          </span>
        ))}
      </div>

      <section className="card yes-card">
        <p className="eyebrow">
          TODAY • TOMORROW • ALWAYS
        </p>

        <div className="ring">💍</div>

        <h1 className="yes-heading">{proposal.yesTitle}</h1>

        <p className="yes-subtitle">
          {proposal.yesSubtitle}
        </p>

        <div className="memory-section">
          <div className="polaroid">
            <div className="photo-frame">
              {photoError ? (
                <div className="photo-placeholder">
                  <span>📷</span>
                  <p>Add your couple photo to public/couple.jpg</p>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proposal.photoUrl}
                  alt={`${proposal.yourName} and ${proposal.herName}`}
                  onError={() => setPhotoError(true)}
                />
              )}
            </div>

            <p className="photo-caption">
              You + Me = Forever ♥
            </p>
          </div>

          <div className="love-letter">
            <span className="letter-label">
              TO MY FAVORITE PERSON
            </span>

            <h2>
              My favorite yes,
              <br />
              my favorite forever.
            </h2>

            
<p style={{ whiteSpace: "pre-line" }}>
  {proposal.loveLetter}
</p>

<p
  style={{
    marginTop: "24px",
    color: "#b33f69",
    fontWeight: 700,
    fontSize: "17px",
    lineHeight: 1.8,
  }}
>
  {proposal.loveLetterEnding}
</p>


            <div className="signature">
              With all my love,
              <br />
              <strong>{proposal.yourName} ♡</strong>
            </div>
          </div>
        </div>

        <div className="music-player">
          <div className="music-icon">♫</div>

          <div className="track-info">
            <strong>{proposal.songTitle}</strong>
            <span>
              {musicError
                ? "Check your song.mp3 file"
                : proposal.songArtist}
            </span>
          </div>

          <button
            type="button"
            className="play-button"
            onClick={toggleMusic}
            aria-label={playing ? "Pause music" : "Play music"}
          >
            {playing ? "❚❚" : "▶"}
          </button>

          <audio
            ref={audioRef}
            src={proposal.songUrl}
            loop
            preload="auto"
            onPlay={() => {
              setPlaying(true);
              setMusicError(false);
            }}
            onPause={() => setPlaying(false)}
            onError={() => setMusicError(true)}
          />
        </div>

        <p className="forever-text">
          This is the beginning of our most beautiful adventure. ✨
        </p>
      </section>

      <footer>
        Forever looks beautiful on us ♡
      </footer>
    </main>
  );
}
