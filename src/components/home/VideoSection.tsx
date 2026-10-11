import { useState, useRef } from "react";
import { Play, Maximize } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

const videos = [
    { id: 1, src: "/video/1.mp4" },
    { id: 2, src: "/video/2.mp4" },
    { id: 3, src: "/video/3.mp4" },
    // { id: 4, src: "/video/1.mp4" }, // Repeat just to match the 4 items shown in the user's image
];

export const VideoSection = () => {
    return (
        <section className="overflow-hidden bg-white text-black py-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto mb-8 max-w-2xl text-center ">
                    {/* <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/60 md:mb-3 md:text-sm">Somne at home</p> */}
                    <h2 className="text-2xl font-black text-black md:text-5xl">
                        See the package details in motion.
                    </h2>
                </div>

                <div className="relative">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full xl:max-w-6xl mx-auto"
                    >
                        <CarouselContent className="-ml-4 sm:-ml-6">
                            {videos.map((video, index) => (
                                <CarouselItem
                                    key={index}
                                    className="basis-[82%] pl-4 sm:basis-1/2 sm:pl-6 md:basis-1/3"
                                >
                                    <VideoCard src={video.src} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

const VideoCard = ({ src }: { src: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleFullScreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-black shadow-sm md:rounded-lg">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                muted
                playsInline
                onClick={togglePlay}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-100 group-hover:opacity-100"
                    }`}
            />

            {/* Play/Pause Button */}
            {!isPlaying && (
                <button
                    onClick={togglePlay}
                    className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:scale-110 hover:bg-zinc-200 md:h-16 md:w-16"
                    aria-label="Play video"
                >
                    <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />
                </button>
            )}

            {/* Maximize Button */}
            <button
                onClick={toggleFullScreen}
                className="absolute bottom-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg bg-black/40 text-white/90 hover:bg-black/60 hover:text-white backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
                aria-label="Full screen"
            >
                <Maximize className="w-4 h-4 md:w-5 md:h-5" />
            </button>
        </div>
    );
};
