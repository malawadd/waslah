import { FC, ReactNode } from 'react'


const AppServices: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {

  return <>{children}</>
}

export default AppServices
