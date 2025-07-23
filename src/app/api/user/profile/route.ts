import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ success: false, message: 'No session token' }, { status: 401 })
    }

    // Get session to identify user
    const session = await prisma.session.findFirst({
      where: {
        sessionToken,
        isActive: true,
        expires: {
          gt: new Date()
        }
      }
    })

    if (!session) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
    }

    // Try to find user profile by email
    const account = await prisma.account.findUnique({
      where: { email: session.userEmail },
      include: {
        preferences: true,
        contact: true
      }
    })

    if (!account) {
      // User exists in session but not in our extended profile system
      return NextResponse.json({ 
        success: true, 
        profile: null,
        message: 'No extended profile found' 
      })
    }

    return NextResponse.json({
      success: true,
      profile: {
        account: {
          id: account.id,
          email: account.email,
          name: account.name,
          gender: account.gender,
          nationality: account.nationality
        },
        preferences: account.preferences ? {
          preferredAuthorities: account.preferences.preferredAuthorities,
          businessType: account.preferences.businessType,
          experienceLevel: account.preferences.experienceLevel,
          notificationSettings: account.preferences.notificationSettings
        } : null,
        contact: account.contact ? {
          phoneNumber: account.contact.phoneNumber,
          telephone: account.contact.telephone,
          address: account.contact.address,
          city: account.contact.city,
          postalCode: account.contact.postalCode,
          country: account.contact.country,
          socialMedia: account.contact.socialMedia
        } : null
      }
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    }, { status: 500 })
  }
}