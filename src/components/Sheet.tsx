"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

/** Bottom sheet with grabber handle + scrim, constrained to the app column. */
export default function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 mx-auto max-w-[430px]">
          <motion.div
            className="absolute inset-0 bg-[rgba(46,38,32,0.42)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-cream px-5 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-3.5 shadow-[0_-12px_30px_-14px_rgba(82,31,18,0.3)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: [0.34, 1.2, 0.64, 1] }}
          >
            <div className="mx-auto mb-4 h-[5px] w-11 rounded-full bg-line-strong" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
