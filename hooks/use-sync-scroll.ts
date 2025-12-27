import { useEffect, useRef } from 'react';

const useSyncScroll = (trigger: unknown) => {
  const ref1 = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollRef1 = ref1.current;
    const scrollRef2 = ref2.current;
    const handleScroll1 = () => {
      if (scrollRef1 && scrollRef2) {
        scrollRef2.scrollLeft = scrollRef1.scrollLeft;
      }
    };

    const handleScroll2 = () => {
      if (scrollRef1 && scrollRef2) {
        scrollRef1.scrollLeft = scrollRef2.scrollLeft;
      }
    };

    if (scrollRef1) {
      scrollRef1.addEventListener('scroll', handleScroll1);
    }

    if (scrollRef2) {
      scrollRef2.addEventListener('scroll', handleScroll2);
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (scrollRef1) {
        scrollRef1.removeEventListener('scroll', handleScroll1);
      }

      if (scrollRef2) {
        scrollRef2.removeEventListener('scroll', handleScroll2);
      }
    };
  }, [ref1, ref2, trigger]);

  return [ref1, ref2] as const;
};

export default useSyncScroll;
