"use client"

import { useRouter } from "next/navigation"
import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconSettings,
  IconShield,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  profile?: {
    username: string
    first_name: string
    last_name: string
    email: string
  }
}

interface UserProfile {
  preferences?: {
    preferredAuthorities: string[]
    businessType?: string
    experienceLevel?: string
  }
  contact?: {
    phoneNumber?: string
    city?: string
    country?: string
  }
}

export function NavUser({
  user,
  profile,
}: {
  user: User
  profile?: UserProfile
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      // Clear sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('session_token')
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        sessionStorage.removeItem('user_data')

        // Clear user data cookie
        document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }

      toast("Logged out successfully", {
        description: "You have been logged out of your account.",
      })

      // Redirect to login
      router.push('/auth/login')
      router.refresh()

    } catch (error) {
      console.error('Logout error:', error)
      toast("Logout failed", {
        description: "There was an error logging you out. Please try again.",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator'
      case 'AUTHORITY_ADMIN':
        return 'Authority Admin'
      case 'USER':
        return 'User'
      default:
        return role
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive' as const
      case 'AUTHORITY_ADMIN':
        return 'secondary' as const
      default:
        return 'outline' as const
    }
  }

  const displayName = user.name || `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={user.avatar} alt={displayName} />
                  <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.role && (
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                        {getRoleDisplay(user.role)}
                      </Badge>
                    )}
                    {profile?.preferences?.businessType && (
                      <Badge variant="outline" className="text-xs">
                        {profile.preferences.businessType.charAt(0).toUpperCase() + profile.preferences.businessType.slice(1).replace('-', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Contact Information */}
            {(profile?.contact?.phoneNumber || profile?.contact?.city) && (
              <>
                {/* Preferred Authorities */}
            {profile?.preferences?.preferredAuthorities?.length && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  Preferred Authorities
                </DropdownMenuLabel>
                <div className="px-2 py-1">
                  <div className="flex flex-wrap gap-1">
                    {profile.preferences.preferredAuthorities.map(authority => (
                      <Badge key={authority} variant="secondary" className="text-xs">
                        {authority}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <DropdownMenuSeparator />
                <div className="px-2 py-1">
                  {profile?.contact?.phoneNumber && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <IconUserCircle className="h-3 w-3" />
                      <span>{profile.contact.phoneNumber}</span>
                    </div>
                  )}
                  {(profile?.contact?.city || profile?.contact?.country) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconSettings className="h-3 w-3" />
                      <span>{[profile?.contact?.city, profile?.contact?.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <IconUserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <IconSettings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/notifications')}>
                <IconNotification className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              {(user.role === 'ADMIN' || user.role === 'AUTHORITY_ADMIN') && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <IconShield className="mr-2 h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <IconLogout className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}