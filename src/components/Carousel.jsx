import { useState, useEffect, useRef } from 'react';
import ZoomableImage from './ZoomableImage';

async function getGifDuration(src) {
  try {
    const bytes = new Uint8Array(await (await fetch(src)).arrayBuffer());
    let cs = 0;
    for (let i = 0; i < bytes.length - 5; i++) {
      if (bytes[i] === 0x21 && bytes[i + 1] === 0xF9 && bytes[i + 2] === 0x04) {
        cs += bytes[i + 4] | (bytes[i + 5] << 8);
      }
    }
    return cs * 10;
  } catch { return 0; }
}

export default function Carousel({ slides, placeholderLabel = 'Image coming soon' }) {
  const [current, setCurrent] = useState(0);
  const [notDesktop, setNotDesktop] = useState(false);
  const [gifPlaying, setGifPlaying] = useState(false);
  const total = slides.length;
  const s = slides[current];
  const headRef = useRef(null);
  const gifTimerRef = useRef(null);

  const go = (i) => {
    setCurrent((i + total) % total);
    setGifPlaying(false);
    if (headRef.current) {
      const top = headRef.current.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setNotDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!gifPlaying || !s.gifSrc) { clearTimeout(gifTimerRef.current); return; }
    getGifDuration(s.gifSrc).then(duration => {
      if (duration > 0) gifTimerRef.current = setTimeout(() => setGifPlaying(false), duration * 5);
    });
    return () => clearTimeout(gifTimerRef.current);
  }, [gifPlaying, s.gifSrc]);

  // Swipe navigation
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <div className="carousel">
      <div className="carousel-head" ref={headRef}>
        {s.title && <h3>{s.title}</h3>}
        {s.caption && (typeof s.caption === 'string' ? <p>{s.caption}</p> : s.caption)}
      </div>

      <div className="carousel-box" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {!notDesktop && (
          <button className="carousel-arrow carousel-arrow--prev" onClick={() => go(current - 1)} aria-label="Previous">‹</button>
        )}
        {s.gifPoster
          ? (
            <div className="gif-figure">
              <button type="button" className="gif-toggle" onClick={() => setGifPlaying(p => !p)}>
                <img className="gif-toggle__icon" src={gifPlaying ? '/images/owllocate/Pause.png' : '/images/owllocate/Play.png'} alt="" />
                {gifPlaying ? 'Pause gif' : 'Play gif'}
              </button>
              <ZoomableImage src={gifPlaying ? s.gifSrc : s.gifPoster} alt={s.alt || s.title || 'slide'} />
            </div>
          )
          : s.img
            ? <ZoomableImage src={s.img} alt={s.alt || s.title || 'slide'} />
            : <div className="ti-carousel__placeholder">{placeholderLabel}</div>}
        {!notDesktop && (
          <button className="carousel-arrow carousel-arrow--next" onClick={() => go(current + 1)} aria-label="Next">›</button>
        )}
      </div>

      <div className="carousel-dots">
        {notDesktop && (
          <button className="carousel-arrow carousel-arrow--inline" onClick={() => go(current - 1)} aria-label="Previous">‹</button>
        )}
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
        {notDesktop && (
          <button className="carousel-arrow carousel-arrow--inline" onClick={() => go(current + 1)} aria-label="Next">›</button>
        )}
      </div>
    </div>
  );
}
