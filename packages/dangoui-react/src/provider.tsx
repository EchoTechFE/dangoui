import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from './internal'
import {
  createFeedback,
  FeedbackHost,
  type FeedbackController,
} from './feedback'
import type { ThemeName, ThemeTokens } from './theme'

export interface DangoConfig {
  theme: ThemeName
  tokens: ThemeTokens
  portalContainer?: HTMLElement | null
  element: HTMLDivElement | null
  feedback: FeedbackController
}
const ConfigContext = createContext<DangoConfig | null>(null)

export interface DangoProviderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode
  theme?: ThemeName
  tokens?: ThemeTokens
  /** A container in the same document as this React root. Defaults to its body. */
  portalContainer?: HTMLElement | null
  feedback?: FeedbackController
}

export function DangoProvider({
  theme,
  tokens,
  portalContainer,
  feedback,
  children,
  className,
  style,
  ...props
}: DangoProviderProps) {
  const parent = useContext(ConfigContext)
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const ownFeedback = useRef<FeedbackController | null>(null)
  if (!ownFeedback.current) ownFeedback.current = createFeedback()
  const controller = feedback ?? ownFeedback.current
  const value = useMemo<DangoConfig>(
    () => ({
      theme: theme ?? parent?.theme ?? 'qd',
      tokens: { ...parent?.tokens, ...tokens },
      portalContainer: portalContainer ?? parent?.portalContainer,
      element,
      feedback: controller,
    }),
    [theme, tokens, portalContainer, element, controller, parent],
  )
  useEffect(() => controller.attach(), [controller])
  return (
    <ConfigContext.Provider value={value}>
      <div
        {...props}
        ref={setElement}
        className={cx('du-react', `du-theme-${value.theme}`, className)}
        style={{ ...value.tokens, ...style }}
      >
        {children}
      </div>
      {element && <FeedbackHost controller={controller} />}
    </ConfigContext.Provider>
  )
}

export function useDangoConfig() {
  const config = useContext(ConfigContext)
  if (!config)
    throw new Error('Dangoui React components require a DangoProvider')
  return config
}

export function useFeedback() {
  return useDangoConfig().feedback
}
