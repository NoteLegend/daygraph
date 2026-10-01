'use client';
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Plus } from 'lucide-react';
import Aurora from './react-bits/Aurora';
import SpotlightCard from './react-bits/SpotlightCard';
import Magnet from './react-bits/Magnet';
import ClickSpark from './react-bits/ClickSpark';
import CountUp from './react-bits/CountUp';
import BlurText from './react-bits/BlurText';
import FadeContent from './react-bits/FadeContent';
import AnimatedContent from './react-bits/AnimatedContent';
import StarBorder from './react-bits/StarBorder';
import ShinyText from './react-bits/ShinyText';
export const QuietMotion = createContext(true);
const auroraColors=['#8DAEB0','#B8D5BE','#567164'];
export function Ambient() {
  const quiet=useContext(QuietMotion);
  return <div className="ambient" aria-hidden="true">{!quiet && <Aurora colorStops={auroraColors} amplitude={0.8} blend={0.8} speed={0.35}/>}<div className="ambient-fade"/></div>;
}
export function Brand() { const quiet=useContext(QuietMotion); return <span className="brand-text"><ShinyText text="Daygraph" speed={4} delay={3} color="#D4DED5" shineColor="#FFFFFF" disabled={quiet}/><span className="brand-dot">.</span></span>; }
export function Heading({text}:{text:string}) {const quiet=useContext(QuietMotion);return <h1>{quiet?text:<BlurText text={text} delay={70} direction="bottom" stepDuration={0.15} animationFrom={undefined} animationTo={undefined} onAnimationComplete={undefined}/>}</h1>;}
export function NumberValue({value,suffix='',prefix=''}:{value:number;suffix?:string;prefix?:string}) {const quiet=useContext(QuietMotion);return <span className="number">{prefix}{quiet?value.toLocaleString('en-IN'):<CountUp to={value} duration={0.8} separator="," onStart={undefined} onEnd={undefined}/>}{suffix}</span>;}
export function Panel({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}) {
  const quiet=useContext(QuietMotion);
  const content=<SpotlightCard className={`panel ${className}`} spotlightColor={quiet?'transparent':'rgba(184,213,190,0.045)'}>{children}</SpotlightCard>;
  return quiet?content:<AnimatedContent distance={22} duration={0.65} delay={delay} container={undefined} onComplete={undefined} onDisappearanceComplete={undefined}>{content}</AnimatedContent>;
}
export function Reveal({children}:{children:ReactNode}){const quiet=useContext(QuietMotion);return quiet?<>{children}</>:<FadeContent duration={500} container={undefined} onComplete={undefined} onDisappearanceComplete={undefined} style={undefined}>{children}</FadeContent>;}
export function Primary({children,onClick,disabled=false}:{children:ReactNode;onClick:()=>void;disabled?:boolean}) {
  const quiet=useContext(QuietMotion);
  return <Magnet padding={12} magnetStrength={8} disabled={quiet||disabled}><button className="primary" onClick={onClick} disabled={disabled}><Plus size={16}/>{children}</button></Magnet>;
}
export function Outline({children,onClick}:{children:ReactNode;onClick:()=>void}) {const quiet=useContext(QuietMotion);return <StarBorder as="button" className={quiet?'outline no-motion':'outline'} color="#B8D5BE" speed="9s" backgroundColor="#1B201E" textColor="#DCE5DE" borderColor="#3B463D" onClick={onClick}>{children}</StarBorder>;}
export function Spark({children}:{children:ReactNode}) {const quiet=useContext(QuietMotion);return quiet?<>{children}</>:<ClickSpark sparkColor="#B8D5BE" sparkSize={5} sparkRadius={20} sparkCount={7} duration={430}>{children}</ClickSpark>;}
export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}) {
  const ref=useRef<HTMLDivElement>(null); const onCloseRef=useRef(onClose); useEffect(()=>{onCloseRef.current=onClose;},[onClose]);
  useEffect(()=>{const previous=document.activeElement as HTMLElement; const old=document.body.style.overflow;document.body.style.overflow='hidden';ref.current?.querySelector<HTMLElement>('input,button,select,textarea')?.focus();
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')onCloseRef.current();if(e.key==='Tab'){const all=[...ref.current!.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')]; const first=all[0],last=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};document.addEventListener('keydown',key);
    return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key);previous?.focus();};},[]);
  return <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" className="modal" initial={{y:30,scale:0.97}} animate={{y:0,scale:1}} exit={{y:20,opacity:0}} transition={{type:'spring',stiffness:100,damping:20}} onClick={e=>e.stopPropagation()}><div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-btn" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div>{children}</motion.div></motion.div>;
}
export { AnimatePresence, motion };

