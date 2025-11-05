import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { SocialLink } from '../types';
import { ArrowRightIcon } from './icons';

interface SliderButtonProps {
  link: SocialLink;
}

const SliderButton: React.FC<SliderButtonProps> = ({ link }) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = useCallback(() => {
    if (isCompleted) return;
    setIsDragging(true);
  }, [isCompleted]);

  const handleInteractionMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current || !handleRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const handleWidth = handleRef.current.offsetWidth;
    const maxPosition = containerRect.width - handleWidth;
    
    let newX = clientX - containerRect.left - handleWidth / 2;
    newX = Math.max(0, Math.min(newX, maxPosition));
    setPosition(newX);
  }, [isDragging]);

  const handleInteractionEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Use a functional update with setPosition to get the latest position value
    // without needing `position` in the dependency array. This avoids stale closures.
    setPosition(currentPosition => {
        const containerWidth = containerRef.current?.offsetWidth ?? 0;
        const handleWidth = handleRef.current?.offsetWidth ?? 0;
        const threshold = (containerWidth - handleWidth) * 0.75;

        if (currentPosition >= threshold) {
            setIsCompleted(true);
            window.open(link.url, '_blank', 'noopener,noreferrer');
            setTimeout(() => {
                setIsCompleted(false);
            }, 1000); // Give a bit more time for the checkmark to be visible
            return 0; // Reset position after completion
        } else {
            return 0; // Reset position if not completed
        }
    });
  }, [isDragging, link.url]);

  useEffect(() => {
    if (!isDragging) return;

    const moveHandler = (e: MouseEvent) => handleInteractionMove(e.clientX);
    const touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault();
      handleInteractionMove(e.touches[0].clientX);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('touchmove', touchMoveHandler, { passive: false });
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchend', handleInteractionEnd);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, handleInteractionMove, handleInteractionEnd]);

  // Disable text selection while dragging for better UX
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-20 rounded-full flex items-center p-2 bg-black/20 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${link.color}`}
    >
      <div
        ref={handleRef}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        className={`absolute h-16 w-16 rounded-full flex items-center justify-center text-white bg-white/10 border border-white/20 shadow-xl z-10 ${!isDragging ? 'transition-transform duration-300 ease-out' : ''}`}
        style={{ transform: `translateX(${position}px)` }}
      >
        {isCompleted ? (
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          link.icon
        )}
      </div>

      <div className={`absolute inset-0 flex items-center justify-center text-white/80 font-semibold text-lg tracking-wider transition-opacity duration-300 ${isDragging || position > 10 ? 'opacity-0' : 'opacity-100'}`}>
        <span>Slide for {link.name}</span>
        <ArrowRightIcon className="w-5 h-5 ml-2 opacity-50" />
      </div>
    </div>
  );
};

export default SliderButton;
