"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  IconDashboard,
  IconFileText,
  IconChecklist,
  IconBuilding,
  IconChartBar,
  IconShield,
  IconSearch,
  IconHelp,
  IconSettings,
  IconBookmark,
  IconDownload,
  IconCalendar,
  IconBell,
  IconMessage,
  IconUsersGroup,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface User {
  id: string
  email: string
  name: string
  role: string
  externalUserId?: string
  profile?: {
    username: string
    first_name: string
    last_name: string
    email: string
  }
}

interface UserProfile {
  user: User
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

// Utility function to get user data from storage
const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null
  
  try {
    // Try sessionStorage first
    const sessionData = sessionStorage.getItem('user_data')
    if (sessionData) {
      return JSON.parse(sessionData)
    }
    
    // Fallback to cookie
    const cookies = document.cookie.split(';')
    const userCookie = cookies.find(c => c.trim().startsWith('user_data='))
    if (userCookie) {
      const cookieValue = userCookie.split('=')[1]
      return JSON.parse(decodeURIComponent(cookieValue))
    }
    
    return null
  } catch (error) {
    console.error('Error getting user from storage:', error)
    return null
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // First, get user from storage for immediate display
        const storedUser = getUserFromStorage()
        
        if (storedUser) {
          // Set initial state with stored user data
          setUserProfile({ user: storedUser })
          setLoading(false)
          
          // Then try to fetch extended profile in background
          try {
            const profileResponse = await fetch('/api/user/profile', {
              method: 'GET',
            })

            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              if (profileData.success && profileData.profile) {
                setUserProfile({
                  user: storedUser,
                  preferences: profileData.profile.preferences,
                  contact: profileData.profile.contact
                })
              }
            }
          } catch (profileError) {
            console.log('Extended profile fetch failed, using stored data')
          }
        } else {
          // No stored user, verify session
          const sessionResponse = await fetch('/api/auth/verify-session', {
            method: 'POST',
          })

          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json()
            if (sessionData.success && sessionData.session) {
              setUserProfile({ user: sessionData.session.user })
            } else {
              window.location.href = '/auth/login'
            }
          } else {
            window.location.href = '/auth/login'
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
        window.location.href = '/auth/login'
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  // Dynamic navigation based on user role and preferences
  const getNavigation = (user: User, preferences?: any) => {
    const baseNavMain = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Chat",
        url: "/dashboard/chat",
        icon: IconDashboard,
      },
      {
        title: "Documents",
        url: "/documents",
        icon: IconFileText,
      },
      {
        title: "Compliance Checklist",
        url: "/checklist",
        icon: IconChecklist,
      },
      {
        title: "Authorities",
        url: "/authorities",
        icon: IconBuilding,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: IconChartBar,
      },
    ]

    // Add admin-specific navigation
    if (user.role === 'ADMIN' || user.role === 'AUTHORITY_ADMIN') {
      baseNavMain.push({
        title: "Admin Panel",
        url: "/admin",
        icon: IconUsersGroup,
      })
    }

    return baseNavMain
  }

  // Dynamic authorities based on user preferences
  const getAuthorities = (preferences?: any) => {
    const allAuthorities = [
      {
        name: "Bank of Botswana",
        url: "/authorities/bob",
        icon: IconShield,
        code: "BOB"
      },
      {
        name: "NBFIRA",
        url: "/authorities/nbfira", 
        icon: IconShield,
        code: "NBFIRA"
      },
      {
        name: "FIA",
        url: "/authorities/fia",
        icon: IconShield,
        code: "FIA"
      },
    ]

    // If user has preferred authorities, prioritize them
    if (preferences?.preferredAuthorities?.length > 0) {
      const preferred = allAuthorities.filter(auth => 
        preferences.preferredAuthorities.includes(auth.code)
      )
      const others = allAuthorities.filter(auth => 
        !preferences.preferredAuthorities.includes(auth.code)
      )
      return [...preferred, ...others]
    }

    return allAuthorities
  }

  if (loading) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </SidebarContent>
      </Sidebar>
    )
  }

  if (!userProfile) {
    return null
  }

  const data = {
    navMain: getNavigation(userProfile.user, userProfile.preferences),
    navSecondary: [
      {
        title: "Search",
        url: "/search",
        icon: IconSearch,
      },
      {
        title: "FAQ",
        url: "/dashboard/faq",
        icon: IconHelp,
      },
      {
        title: "Support",
        url: "/support",
        icon: IconMessage,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: IconSettings,
      },
    ],
    documents: [
      {
        name: "My Bookmarks",
        url: "/bookmarks",
        icon: IconBookmark,
      },
      {
        name: "Downloads",
        url: "/downloads",
        icon: IconDownload,
      },
      {
        name: "Regulatory Calendar",
        url: "/calendar",
        icon: IconCalendar,
      },
      {
        name: "Notifications",
        url: "/notifications",
        icon: IconBell,
      },
    ],
    authorities: getAuthorities(userProfile.preferences),
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconShield className="!size-5 text-blue-600" />
                <span className="text-base font-semibold">Financial Regulatory Portal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.authorities} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={userProfile.user} 
          profile={{
            preferences: userProfile.preferences,
            contact: userProfile.contact
          }} 
        />
      </SidebarFooter>
    </Sidebar>
  )
}

// Updated logout function to clear all stored data

export const handleLogout = async () => {
  try {
    // Call logout API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    // Clear sessionStorage
    sessionStorage.removeItem('session_token')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('refresh_token')
    sessionStorage.removeItem('user_data')

    // Clear user data cookie
    document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    if (response.ok) {
      window.location.href = '/auth/login'
    } else {
      // Force redirect even if API call fails
      window.location.href = '/auth/login'
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Force redirect even if there's an error
    window.location.href = '/auth/login'
  }
}

// Utility hook for accessing user data

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getUserFromStorage()
    setUser(storedUser)
    setLoading(false)
  }, [])

  return { user, loading }
}