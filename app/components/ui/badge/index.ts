import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors border',
  {
    variants: {
      variant: {
        default:
          'bg-black/5 dark:bg-white/10 text-[#000000] dark:text-[#FFFFFF] border-black/15 dark:border-white/15',
        purple:
          'bg-[#FE5101]/15 text-[#FE5101] border-[#FE5101]/40',
        emerald:
          'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/30',
        dark:
          'bg-[#000000]/85 text-[#FFFFFF] border-transparent backdrop-blur-md',
        counter:
          'bg-purple-600 text-white border-transparent px-2 py-0.5 text-[11px] font-bold tracking-normal'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
