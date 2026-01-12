'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Organization Settings
interface OrganizationSettings {
    name: string
    shortName: string
    taxId: string
    address: string
    phone: string
    email: string
    website: string
    logo: string | null
}

// Notification Settings
interface NotificationSettings {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    newMemberAlert: boolean
    donationAlert: boolean
    socialAidAlert: boolean
    systemAlerts: boolean
    weeklyReport: boolean
    monthlyReport: boolean
}

// Display Settings
interface DisplaySettings {
    theme: 'light' | 'dark' | 'system'
    language: 'tr' | 'en'
    timezone: string
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
    currency: 'TRY' | 'USD' | 'EUR'
    itemsPerPage: 10 | 25 | 50 | 100
    sidebarCollapsed: boolean
    compactMode: boolean
}

// Security Settings
interface SecuritySettings {
    twoFactorEnabled: boolean
    sessionTimeout: 15 | 30 | 60 | 120 // minutes
    loginAlerts: boolean
    ipWhitelist: string[]
    lastPasswordChange: string | null
}

// System Settings
interface SystemSettings {
    autoBackup: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    dataRetention: 30 | 90 | 180 | 365 // days
    debugMode: boolean
    maintenanceMode: boolean
    apiRateLimit: number
}

// Donation Settings
interface DonationSettings {
    defaultCurrency: 'TRY' | 'USD' | 'EUR'
    receiptPrefix: string
    receiptNumberStart: number
    autoSendReceipt: boolean
    minDonationAmount: number
    donationCategories: string[]
}

// Member Settings
interface MemberSettings {
    membershipFee: number
    feeFrequency: 'monthly' | 'yearly'
    gracePeriod: number // days
    autoReminder: boolean
    reminderDays: number[]
    memberCategories: string[]
}

interface SettingsState {
    organization: OrganizationSettings
    notifications: NotificationSettings
    display: DisplaySettings
    security: SecuritySettings
    system: SystemSettings
    donation: DonationSettings
    member: MemberSettings

    // Actions
    updateOrganization: (settings: Partial<OrganizationSettings>) => void
    updateNotifications: (settings: Partial<NotificationSettings>) => void
    updateDisplay: (settings: Partial<DisplaySettings>) => void
    updateSecurity: (settings: Partial<SecuritySettings>) => void
    updateSystem: (settings: Partial<SystemSettings>) => void
    updateDonation: (settings: Partial<DonationSettings>) => void
    updateMember: (settings: Partial<MemberSettings>) => void
    resetToDefaults: () => void
}

const defaultSettings: Omit<SettingsState, 'updateOrganization' | 'updateNotifications' | 'updateDisplay' | 'updateSecurity' | 'updateSystem' | 'updateDonation' | 'updateMember' | 'resetToDefaults'> = {
    organization: {
        name: 'KafkasDer - Kafkas Muhacirler Derneği',
        shortName: 'KafkasDer',
        taxId: '',
        address: 'İstanbul, Türkiye',
        phone: '+90 212 XXX XX XX',
        email: 'info@kafkasder.org',
        website: 'https://kafkasder.org',
        logo: null
    },
    notifications: {
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        newMemberAlert: true,
        donationAlert: true,
        socialAidAlert: true,
        systemAlerts: true,
        weeklyReport: false,
        monthlyReport: true
    },
    display: {
        theme: 'system',
        language: 'tr',
        timezone: 'Europe/Istanbul',
        dateFormat: 'DD/MM/YYYY',
        currency: 'TRY',
        itemsPerPage: 25,
        sidebarCollapsed: false,
        compactMode: false
    },
    security: {
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginAlerts: true,
        ipWhitelist: [],
        lastPasswordChange: null
    },
    system: {
        autoBackup: true,
        backupFrequency: 'daily',
        dataRetention: 365,
        debugMode: false,
        maintenanceMode: false,
        apiRateLimit: 100
    },
    donation: {
        defaultCurrency: 'TRY',
        receiptPrefix: 'KFD',
        receiptNumberStart: 1000,
        autoSendReceipt: true,
        minDonationAmount: 10,
        donationCategories: ['Genel Bağış', 'Eğitim', 'Sağlık', 'Gıda', 'Giyim', 'Kira', 'Diğer']
    },
    member: {
        membershipFee: 100,
        feeFrequency: 'monthly',
        gracePeriod: 30,
        autoReminder: true,
        reminderDays: [7, 3, 1],
        memberCategories: ['Standart', 'Onursal', 'Genç', 'Öğrenci']
    }
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,

            updateOrganization: (settings) =>
                set((state) => ({
                    organization: { ...state.organization, ...settings }
                })),

            updateNotifications: (settings) =>
                set((state) => ({
                    notifications: { ...state.notifications, ...settings }
                })),

            updateDisplay: (settings) =>
                set((state) => ({
                    display: { ...state.display, ...settings }
                })),

            updateSecurity: (settings) =>
                set((state) => ({
                    security: { ...state.security, ...settings }
                })),

            updateSystem: (settings) =>
                set((state) => ({
                    system: { ...state.system, ...settings }
                })),

            updateDonation: (settings) =>
                set((state) => ({
                    donation: { ...state.donation, ...settings }
                })),

            updateMember: (settings) =>
                set((state) => ({
                    member: { ...state.member, ...settings }
                })),

            resetToDefaults: () => set(defaultSettings)
        }),
        {
            name: 'kafkasder-settings'
        }
    )
)
