export const AnimationConfig = {
  colors: {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    background: '#F1F5F9',
    card: '#FFFFFF',
    text: '#0F172A',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    info: '#2563EB'
  },
  timings: {
    headerFadeIn: 0.6,
    walkToBag: 2.2,
    bendDown: 0.7,
    pickBag: 0.5,
    standUp: 0.5,
    walkBack: 2.0,
    formRevealDelay: 0.3,
    formReveal: 0.6
  },
  motion: {
    walkSwingArm: 8,
    walkSwingLeg: 6,
    bendTorsoDeg: -22,
    bendHeadDeg: 10,
    pickBagLiftY: -22,
    pickBagLiftX: -12,
    pickBagScale: 1.02
  },
  easing: {
    enter: 'easeOut',
    walk: 'easeInOut',
    bend: 'easeOut',
    reveal: 'easeOut'
  },
  distances: {
    toBagX: 0.58, // 58% of stage width
    backX: 0.16   // 16% of stage width
  },
  loop: false
}
