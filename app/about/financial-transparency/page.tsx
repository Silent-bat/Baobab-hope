"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, PieChart, TrendingUp, DollarSign, Users, Globe, Award } from "lucide-react"

const translations = {
  en: {
    title: "Financial Transparency",
    subtitle: "Open and accountable financial reporting for maximum trust and impact",
    description:
      "We believe in complete transparency about how we use the funds entrusted to us. Every donation is tracked and reported to ensure maximum impact for the communities we serve.",
    financialOverview: "Financial Overview 2023",
    totalRevenue: "Total Revenue",
    totalExpenses: "Total Expenses",
    programExpenses: "Program Expenses",
    adminExpenses: "Administrative Expenses",
    fundraisingExpenses: "Fundraising Expenses",
    expenseBreakdown: "Expense Breakdown",
    revenueBreakdown: "Revenue Breakdown",
    donations: "Individual Donations",
    grants: "Grants & Foundations",
    corporate: "Corporate Partnerships",
    events: "Fundraising Events",
    other: "Other Income",
    annualReports: "Annual Reports",
    auditReports: "Audit Reports",
    financialStatements: "Financial Statements",
    impactReports: "Impact Reports",
    downloadReport: "Download Report",
    viewOnline: "View Online",
    certifications: "Certifications & Ratings",
    guidestarGold: "GuideStar Gold Seal",
    charityNavigator: "Charity Navigator 4-Star",
    betterBusinessBureau: "BBB Accredited Charity",
    candid: "Candid Platinum Seal",
    keyMetrics: "Key Financial Metrics",
    programRatio: "Program Expense Ratio",
    programRatioDesc: "Percentage of expenses that go directly to programs",
    fundraisingRatio: "Fundraising Efficiency",
    fundraisingRatioDesc: "Cost to raise $1 in donations",
    adminRatio: "Administrative Costs",
    adminRatioDesc: "Percentage spent on administrative functions",
    growthRate: "Revenue Growth",
    growthRateDesc: "Year-over-year revenue growth rate",
  },
  fr: {
    title: "Transparence Financière",
    subtitle: "Rapports financiers ouverts et responsables pour une confiance et un impact maximum",
    description:
      "Nous croyons en une transparence complète sur la façon dont nous utilisons les fonds qui nous sont confiés. Chaque don est suivi et rapporté pour assurer un impact maximum pour les communautés que nous servons.",
    financialOverview: "Aperçu Financier 2023",
    totalRevenue: "Revenus Totaux",
    totalExpenses: "Dépenses Totales",
    programExpenses: "Dépenses de Programme",
    adminExpenses: "Dépenses Administratives",
    fundraisingExpenses: "Dépenses de Collecte de Fonds",
    expenseBreakdown: "Répartition des Dépenses",
    revenueBreakdown: "Répartition des Revenus",
    donations: "Dons Individuels",
    grants: "Subventions et Fondations",
    corporate: "Partenariats d'Entreprise",
    events: "Événements de Collecte de Fonds",
    other: "Autres Revenus",
    annualReports: "Rapports Annuels",
    auditReports: "Rapports d'Audit",
    financialStatements: "États Financiers",
    impactReports: "Rapports d'Impact",
    downloadReport: "Télécharger le Rapport",
    viewOnline: "Voir en Ligne",
    certifications: "Certifications et Évaluations",
    guidestarGold: "Sceau d'Or GuideStar",
    charityNavigator: "Charity Navigator 4 Étoiles",
    betterBusinessBureau: "Organisme de Bienfaisance Accrédité BBB",
    candid: "Sceau Platine Candid",
    keyMetrics: "Métriques Financières Clés",
    programRatio: "Ratio de Dépenses de Programme",
    programRatioDesc: "Pourcentage des dépenses qui vont directement aux programmes",
    fundraisingRatio: "Efficacité de Collecte de Fonds",
    fundraisingRatioDesc: "Coût pour collecter 1$ en dons",
    adminRatio: "Coûts Administratifs",
    adminRatioDesc: "Pourcentage dépensé en fonctions administratives",
    growthRate: "Croissance des Revenus",
    growthRateDesc: "Taux de croissance des revenus d'année en année",
  },
}

const financialData = {
  totalRevenue: 2450000,
  totalExpenses: 2280000,
  programExpenses: 1938000,
  adminExpenses: 228000,
  fundraisingExpenses: 114000,
  revenueBreakdown: {
    donations: 45,
    grants: 35,
    corporate: 15,
    events: 3,
    other: 2,
  },
}

const reports = [
  {
    type: "annual",
    year: 2023,
    title: "Annual Report 2023",
    description: "Comprehensive overview of our activities, impact, and financial performance",
    size: "2.4 MB",
    pages: 48,
  },
  {
    type: "audit",
    year: 2023,
    title: "Independent Audit Report 2023",
    description: "Third-party financial audit conducted by certified public accountants",
    size: "1.8 MB",
    pages: 24,
  },
  {
    type: "financial",
    year: 2023,
    title: "Financial Statements 2023",
    description: "Detailed financial statements including balance sheet and income statement",
    size: "1.2 MB",
    pages: 16,
  },
  {
    type: "impact",
    year: 2023,
    title: "Impact Report 2023",
    description: "Detailed analysis of program outcomes and community impact metrics",
    size: "3.1 MB",
    pages: 36,
  },
]

const certifications = [
  {
    name: "GuideStar Gold Seal",
    description: "Recognized for transparency and accountability",
    icon: Award,
    color: "text-yellow-600",
  },
  {
    name: "Charity Navigator 4-Star",
    description: "Top rating for financial health and accountability",
    icon: Award,
    color: "text-blue-600",
  },
  {
    name: "BBB Accredited Charity",
    description: "Meets all 20 standards for charity accountability",
    icon: Award,
    color: "text-green-600",
  },
  {
    name: "Candid Platinum Seal",
    description: "Highest level of transparency recognition",
    icon: Award,
    color: "text-purple-600",
  },
]

export default function FinancialTransparencyPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en // Fallback to English

  const programRatio = Math.round((financialData.programExpenses / financialData.totalExpenses) * 100)
  const adminRatio = Math.round((financialData.adminExpenses / financialData.totalExpenses) * 100)
  const fundraisingRatio = Math.round((financialData.fundraisingExpenses / financialData.totalExpenses) * 100)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{t.subtitle}</p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">{t.description}</p>
          </div>
        </div>
      </section>

      {/* Financial Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.financialOverview}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-green-600">
                  ${(financialData.totalRevenue / 1000000).toFixed(1)}M
                </CardTitle>
                <CardDescription>{t.totalRevenue}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-blue-600">
                  ${(financialData.totalExpenses / 1000000).toFixed(1)}M
                </CardTitle>
                <CardDescription>{t.totalExpenses}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-purple-600">
                  ${(financialData.programExpenses / 1000000).toFixed(1)}M
                </CardTitle>
                <CardDescription>{t.programExpenses}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-orange-600">{programRatio}%</CardTitle>
                <CardDescription>Program Ratio</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Expense Breakdown */}
          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-6 w-6 mr-2" />
                  {t.expenseBreakdown}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t.programExpenses}</span>
                    <span className="font-semibold">{programRatio}%</span>
                  </div>
                  <Progress value={programRatio} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t.adminExpenses}</span>
                    <span className="font-semibold">{adminRatio}%</span>
                  </div>
                  <Progress value={adminRatio} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t.fundraisingExpenses}</span>
                    <span className="font-semibold">{fundraisingRatio}%</span>
                  </div>
                  <Progress value={fundraisingRatio} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  {t.revenueBreakdown}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t.donations}</span>
                    <span className="font-semibold">{financialData.revenueBreakdown.donations}%</span>
                  </div>
                  <Progress value={financialData.revenueBreakdown.donations} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t.grants}</span>
                    <span className="font-semibold">{financialData.revenueBreakdown.grants}%</span>
                  </div>
                  <Progress value={financialData.revenueBreakdown.grants} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t.corporate}</span>
                    <span className="font-semibold">{financialData.revenueBreakdown.corporate}%</span>
                  </div>
                  <Progress value={financialData.revenueBreakdown.corporate} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t.events}</span>
                    <span className="font-semibold">{financialData.revenueBreakdown.events}%</span>
                  </div>
                  <Progress value={financialData.revenueBreakdown.events} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.keyMetrics}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.programRatio}</CardTitle>
                <div className="text-3xl font-bold text-green-600">{programRatio}%</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{t.programRatioDesc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.fundraisingRatio}</CardTitle>
                <div className="text-3xl font-bold text-blue-600">$0.05</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{t.fundraisingRatioDesc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.adminRatio}</CardTitle>
                <div className="text-3xl font-bold text-purple-600">{adminRatio}%</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{t.adminRatioDesc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.growthRate}</CardTitle>
                <div className="text-3xl font-bold text-orange-600">+12%</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{t.growthRateDesc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="annual" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="annual">{t.annualReports}</TabsTrigger>
              <TabsTrigger value="audit">{t.auditReports}</TabsTrigger>
              <TabsTrigger value="financial">{t.financialStatements}</TabsTrigger>
              <TabsTrigger value="impact">{t.impactReports}</TabsTrigger>
            </TabsList>

            {reports.map((report) => (
              <TabsContent key={report.type} value={report.type}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <FileText className="h-6 w-6 mr-2" />
                          {report.title}
                        </CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{report.year}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span>
                          {report.pages} pages • {report.size}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          {t.viewOnline}
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          {t.downloadReport}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.certifications}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert) => {
              const IconComponent = cert.icon
              return (
                <Card key={cert.name} className="text-center">
                  <CardHeader>
                    <IconComponent className={`h-12 w-12 mx-auto mb-4 ${cert.color}`} />
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{cert.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Finances?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're committed to complete transparency. Contact us for any additional information.
          </p>
          <Button size="lg" variant="secondary">
            Contact Our Finance Team
          </Button>
        </div>
      </section>
    </div>
  )
}
