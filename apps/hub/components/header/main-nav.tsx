'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { type NavItem } from '@/types/nav'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

interface MainNavProps {
    items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
    const pathname = usePathname()

    return (
        <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
                <Icons.logo className="h-6 w-6" />
                <span className="inline-block font-bold hidden sm:block">
                    {siteConfig.name}
                </span>
            </Link>
            {items?.length ? (
                <nav className="flex gap-6">
                    {items
                        ?.filter((i) => i.hide !== true)
                        .map(
                            (item, index) =>
                                item.href && (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={cn(
                                            'font-bold text-muted-foreground flex items-center text-sm font-medium',
                                            pathname === item.href &&
                                                'text-primary',
                                            item.disabled &&
                                                'cursor-not-allowed opacity-80'
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                )
                        )}
                </nav>
            ) : null}
        </div>
    )
}
