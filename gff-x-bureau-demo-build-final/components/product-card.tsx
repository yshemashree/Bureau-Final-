"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductCardProps {
  title: string
  description: string
  icon: React.ReactNode
  countries: string[]
}

export function ProductCard({ title, description, icon }: ProductCardProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
