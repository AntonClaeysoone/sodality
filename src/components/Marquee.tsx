import { motion } from 'framer-motion';
import './Marquee.css';

interface MarqueeProps {
  text?: string;
  speed?: number;
  separator?: string;
}

export default function Marquee({
  text = "Sodality",
  speed = 20,
  separator = " \u2014 ",
}: MarqueeProps) {
  const repeated = Array(12).fill(`${text}${separator}`).join('');

  return (
    <div className="marquee">
      <div className="marquee__track">
        <motion.div
          className="marquee__content"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: speed,
              ease: 'linear',
            },
          }}
        >
          <span>{repeated}</span>
          <span>{repeated}</span>
        </motion.div>
      </div>
    </div>
  );
}
