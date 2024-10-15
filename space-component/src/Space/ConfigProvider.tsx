import React, { PropsWithChildren } from "react"
import { SizeType } from "."

export interface ConfigContextType {
  space?: {
    size?: SizeType
  }
}

export const ConfigContext = React.createContext<ConfigContextType>({})

interface ConfigProviderProps extends PropsWithChildren<ConfigContextType> {}

export function ConfigProvider(props: ConfigProviderProps) {
  const { children, space } = props
  return <ConfigContext.Provider value={{ space }}>{children}</ConfigContext.Provider>
}
