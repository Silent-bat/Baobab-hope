"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/components/language-provider"
import { CreditCard, Shield, Heart } from "lucide-react"

export default function DonatePage() {
  const { t } = useLanguage()
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [isMonthly, setIsMonthly] = useState(false)

  const predefinedAmounts = [25, 50, 100, 250, 500]

  const handleDonate = async () => {
    const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount

    // Here you would integrate with Stripe
    // For now, we'll just show an alert
    alert(t("donate.alert.processing", { amount: amount, monthly: isMonthly }))
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">{t("donate.title")}</h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">{t("donate.hero.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">{t("donate.amount")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Predefined Amounts */}
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={
                        selectedAmount === amount
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      }
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount("")
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <Label htmlFor="custom-amount">{t("donate.custom")}</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder={t("donate.custom.placeholder")}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    className="mt-2"
                  />
                </div>

                {/* Monthly Donation */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="monthly" checked={isMonthly} onCheckedChange={setIsMonthly} />
                  <Label htmlFor="monthly" className="text-sm">
                    {t("donate.monthly")}
                  </Label>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">{t("donate.form.first.name")}</Label>
                      <Input id="first-name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="last-name">{t("donate.form.last.name")}</Label>
                      <Input id="last-name" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">{t("contact.form.email")}</Label>
                    <Input id="email" type="email" className="mt-1" />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <Label>{t("donate.form.payment.method")}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t("donate.form.credit.card")}
                    </Button>
                    <Button variant="outline" className="justify-start">
                      PayPal
                    </Button>
                  </div>
                </div>

                {/* Donate Button */}
                <Button onClick={handleDonate} className="w-full bg-red-600 hover:bg-red-700 text-lg py-3" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  {t("donate.submit")} ${customAmount || selectedAmount}
                  {isMonthly && "/month"}
                </Button>

                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  {t("donate.secure")}
                </div>
              </CardContent>
            </Card>

            {/* Impact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{t("donate.impact.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">{t("donate.impact.25")}</span>
                      <span className="text-sm text-gray-600">{t("donate.impact.25.description")}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">{t("donate.impact.50")}</span>
                      <span className="text-sm text-gray-600">{t("donate.impact.50.description")}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">{t("donate.impact.100")}</span>
                      <span className="text-sm text-gray-600">{t("donate.impact.100.description")}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">{t("donate.impact.250")}</span>
                      <span className="text-sm text-gray-600">{t("donate.impact.250.description")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{t("donate.why.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t("donate.why.item1")}</span>
                    </li>
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t("donate.why.item2")}</span>
                    </li>
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t("donate.why.item3")}</span>
                    </li>
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t("donate.why.item4")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
