/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProductColor } from '@/types';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

interface CarouselImageStageProps {
  colors: ProductColor[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  productName: string;
  galleryImages: string[];
  activeImageIndex: number;
  onThumbnailClick: (img: string, index: number) => void;
}

const colorSrc = (c: ProductColor | null | undefined): string =>
  c?.image || c?.productImages?.[0] || '';

export const CarouselImageStage = ({
  colors,
  activeIndex,
  onIndexChange,
  productName,
  galleryImages,
  activeImageIndex,
  onThumbnailClick,
}: CarouselImageStageProps) => {

  const dragStartX = useRef<number>(0);
  const dragging = useRef(false);
  // 1 = next (slide in from right, exit to left)
  // -1 = prev (slide in from left, exit to right)
  const direction = useRef<1 | -1>(1);

  const handleDragStart = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragging.current = true;
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) < 30) return;
    if (delta < 0 && activeIndex < colors.length - 1) {
      direction.current = 1;
      onIndexChange(activeIndex + 1);
    }
    if (delta > 0 && activeIndex > 0) {
      direction.current = -1;
      onIndexChange(activeIndex - 1);
    }
  };

  const activeColor = colors[activeIndex] ?? null;
  const activeSrc = colorSrc(activeColor);

  // Slide variants — enter from the direction side, exit to the opposite side
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '60%' : '-60%',
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-60%' : '60%',
      opacity: 0,
      scale: 0.92,
    }),
  };

  return (
    <div className="relative flex flex-col items-center">

      {/* ── Stage: fixed room background + swappable bed image ── */}
      <div
        className="relative h-[clamp(300px,72svw,420px)] w-full overflow-hidden rounded-2xl md:h-[420px]"
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerCancel={() => { dragging.current = false; }}
      >
        {/* Static room background */}
        <img
          src="/test_beds/bg/test_bg.png"
          alt="room background"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Animated bed image — slides in from right, exits to left */}
        <AnimatePresence mode="wait" custom={direction.current}>
          {activeSrc && (
            <Dialog key={activeSrc}>
              <DialogTrigger asChild>
                <motion.div
                  key={activeSrc}
                  custom={direction.current}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.8, // <-- Increased from 0.38 to slow it down
                    ease: [0.32, 0.72, 0, 1], // snappy ease-out
                  }}
                  className="absolute inset-0 flex cursor-zoom-in select-none items-center justify-center md:items-end"
                  style={{ paddingBottom: '2%' }}
                >
                  <img
                    src={activeSrc}
                    alt={activeColor?.name ?? productName}
                    draggable={false}
                    className="w-[72%] max-h-[78%] object-contain drop-shadow-2xl md:w-[40%] md:max-h-[88%]"
                  />
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-[92vw] h-[92vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center [&>button]:text-white [&>button]:bg-black/30 [&>button]:rounded-full [&>button]:p-2 [&>button]:top-4 [&>button]:right-4">
                <DialogTitle className="sr-only">{productName} - full view</DialogTitle>
                <DialogDescription className="sr-only">Fullscreen product image</DialogDescription>
                <img src={activeSrc} alt={productName} className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-2xl" />
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      {galleryImages.length > 1 && (
        <div className="scrollbar-hide z-10 mt-4 flex max-w-full gap-2 overflow-x-auto px-1 pb-2 md:mt-6">
          {galleryImages.slice(0, 6).map((img, i) => (
            <button
              key={i}
              onClick={() => onThumbnailClick(img, i)}
              className={cn(
                'h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200',
                activeImageIndex === i
                  ? 'border-stone-900 scale-110 shadow-md'
                  : 'border-transparent opacity-50 hover:opacity-80',
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselImageStage;
