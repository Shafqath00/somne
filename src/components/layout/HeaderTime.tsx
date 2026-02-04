import { useState, useEffect } from 'react';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { cn } from '@/lib/utils';

export function HeaderTime() {
    const { isMenuOpen } = useMobileMenu();
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            // 13 hour cycle in milliseconds
            const cycleDuration = 13 * 60 * 60 * 1000;
            // Calculate remaining time in the current cycle based on UTC timestamp
            const elapsed = now.getTime() % cycleDuration;
            const remaining = cycleDuration - elapsed;

            const hours = Math.floor((remaining / (1000 * 60 * 60)));
            const minutes = Math.floor((remaining / (1000 * 60)) % 60);
            const seconds = Math.floor((remaining / 1000) % 60);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        // Initial update
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Hide when mobile menu is open
    if (isMenuOpen) {
        return null;
    }

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-2">
            <div className="luxury-container text-center text-xs tracking-widest uppercase font-sans flex flex-col md:flex-row items-center justify-center gap-2">
                <span>WINTER SALE - EXTRA 25% OFF | ENDS IN</span>
                <span className="font-bold tabular-nums min-w-[60px]">{timeLeft}</span>
                <div className='border p-2 rounded-md'>
                    <span>USE CODE </span>
                    <span className="font-bold">SOMNE25</span>
                </div>
            </div>
        </div>
    )
}
