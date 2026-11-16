import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5101]/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#FE5101] text-[#FFFFFF] hover:bg-[#000000] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000]',
        glass:
          'liquid-glass-surface bg-[#FFFFFF]/75 dark:bg-[#0A0A0A]/75 hover:bg-[#FFFFFF] dark:hover:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-black/15 dark:border-white/15',
        purple:
          'liquid-glass-surface bg-[#FE5101] hover:bg-[#FE5101]/90 text-[#FFFFFF] border border-[#FE5101]',
        outline:
          'liquid-glass-surface bg-[#FFFFFF]/40 dark:bg-[#0A0A0A]/40 hover:bg-black/5 dark:hover:bg-white/10 text-[#000000] dark:text-[#FFFFFF] border border-black/15 dark:border-white/15',
        ghost:
          'bg-transparent hover:bg-black/10 dark:hover:bg-white/10 text-[#000000] dark:text-[#FFFFFF]',
        dock:
          'text-[#000000] hover:bg-black/10 dark:text-[#FFFFFF] dark:hover:bg-white/10',
        dockActive:
          'bg-[#FE5101] text-[#FFFFFF] border border-[#FE5101]'
      },
      size: {
        default: 'h-11 px-5 py-2.5 text-sm rounded-2xl',
        sm: 'h-9 px-3.5 text-xs rounded-xl',
        lg: 'h-12 px-7 text-base rounded-full',
        icon: 'h-11 w-11 rounded-2xl flex items-center justify-center p-0',
        dockIcon: 'h-9 w-9 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center p-0'
      }
    },
    defaultVariants: {
      variant: 'glass',
      size: 'default'
    }
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
