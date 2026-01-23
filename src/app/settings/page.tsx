"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

import { GeneralSettings } from "@/components/settings/general-settings"
import { FeatureSettings } from "@/components/settings/feature-settings"
import { PaymentSettings } from "@/components/settings/payment-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { BackupSettings } from "@/components/settings/backup-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { TeamSettings } from "@/components/settings/team-settings"

export default function SettingsPage() {
    const { user } = useAuth()

    if (!user) return null
    const isAdmin = user.role === 'ADMIN'

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure your workshop and account preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start p-0">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    {isAdmin && <TabsTrigger value="general">General</TabsTrigger>}
                    {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
                    {isAdmin && <TabsTrigger value="billing">Billing</TabsTrigger>}
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    {isAdmin && <TabsTrigger value="system">System</TabsTrigger>}
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Manage your public profile details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input defaultValue={user.name || ''} readOnly />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email Address</Label>
                                <Input defaultValue={user.email || ''} readOnly disabled />
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg bg-slate-50">
                                <Shield className="h-5 w-5 text-blue-500" />
                                <div className="flex-1">
                                    <div className="text-sm font-medium">Logged in as {user.role}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {isAdmin ? 'Admin permissions enabled' : 'Standard access'}
                                    </div>
                                </div>
                                <Badge variant="outline">Verified</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {isAdmin && (
                    <>
                        <TabsContent value="general" className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <GeneralSettings />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <FeatureSettings />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="team">
                            <Card>
                                <CardContent className="pt-6">
                                    <TeamSettings />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="billing">
                            <Card>
                                <CardContent className="pt-6">
                                    <PaymentSettings />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="system" className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <IntegrationSettings />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <BackupSettings />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </>
                )}

                <TabsContent value="security">
                    <Card>
                        <CardContent className="pt-6">
                            <SecuritySettings />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardContent className="pt-6">
                            <NotificationSettings />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
