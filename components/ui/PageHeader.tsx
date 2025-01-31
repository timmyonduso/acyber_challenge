import type { FC } from "react"

interface PageHeaderProps {
  title: string
  description: string
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-lg text-gray-500">{description}</p>
    </div>
  )
}

