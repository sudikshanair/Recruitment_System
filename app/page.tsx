import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  UserCheck,
  GraduationCap,
  Star,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Brain,
  Target,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  RecruitPro
                </h1>
                <p className="text-sm text-gray-600">Academic Excellence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Active
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <Star className="h-3 w-3 mr-1" />
                v2.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full text-sm font-medium text-indigo-800 mb-8">
              <Zap className="h-4 w-4 mr-2" />
              Next-Generation Recruitment Platform
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              <span className="text-gray-900">Academic Hiring</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Revolutionize your university's recruitment process with AI-powered candidate matching, intelligent
              scheduling, and comprehensive faculty management tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">Trusted by 100+ Universities</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">98% Efficiency Improvement</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">Award-Winning Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your academic recruitment process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Smart Faculty Management</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Advanced faculty profiles with expertise mapping, availability tracking, and intelligent assignment
                  algorithms
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">AI-Powered Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Intelligent interview scheduling with conflict detection, preference matching, and automated
                  notifications
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Comprehensive evaluation metrics with detailed scoring, performance insights, and predictive analytics
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Seamless Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Native Teams integration, automated workflows, and real-time collaboration tools
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Access Your Dashboard</h2>
              <p className="text-xl text-gray-600">Choose your role to begin transforming your recruitment process</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Recruiter Login */}
              <Card className="group hover:shadow-3xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-4">
                <CardHeader className="text-center pb-8">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <UserCheck className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-gray-900 mb-3">Recruitment Admin</CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Complete recruitment oversight and management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Faculty & Candidate Management</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Advanced Interview Scheduling</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Analytics & Reporting Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">System Administration</span>
                    </div>
                  </div>
                  <Link href="/auth/login?role=recruiter" className="block">
                    <Button
                      size="lg"
                      className="w-full h-14 bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 text-white font-semibold text-lg group shadow-xl"
                    >
                      Access Admin Dashboard
                      <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Faculty Login */}
              <Card className="group hover:shadow-3xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-4">
                <CardHeader className="text-center pb-8">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <GraduationCap className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-gray-900 mb-3">Faculty Portal</CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Interview management and candidate evaluation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Personalized Interview Schedule</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Advanced Evaluation Tools</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Multi-Round Assessment</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Detailed Feedback System</span>
                    </div>
                  </div>
                  <Link href="/auth/login?role=faculty" className="block">
                    <Button
                      size="lg"
                      className="w-full h-14 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700 text-white font-semibold text-lg group shadow-xl"
                    >
                      Access Faculty Portal
                      <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Demo Credentials */}
            <div className="mt-16 text-center">
              <Card className="max-w-lg mx-auto bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5 text-gray-600" />
                    Demo Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-sm bg-white p-4 rounded-lg border">
                      <p className="font-semibold text-gray-800 mb-2">Admin Access:</p>
                      <p className="font-mono text-xs text-gray-600 mb-1">admin@university.edu</p>
                      <p className="font-mono text-xs text-gray-600">password123</p>
                    </div>
                    <div className="text-sm bg-white p-4 rounded-lg border">
                      <p className="font-semibold text-gray-800 mb-2">Faculty Access:</p>
                      <p className="font-mono text-xs text-gray-600 mb-1">sarah.smith@university.edu</p>
                      <p className="font-mono text-xs text-gray-600">password123</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">RecruitPro</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering universities with next-generation recruitment intelligence and seamless faculty management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Faculty Management</li>
                <li className="hover:text-white transition-colors cursor-pointer">Interview Scheduling</li>
                <li className="hover:text-white transition-colors cursor-pointer">Candidate Tracking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Analytics Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
                <li className="hover:text-white transition-colors cursor-pointer">System Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Security</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Award className="h-4 w-4 text-green-400" />
                  <span>ISO 27001 Certified</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 RecruitPro. All rights reserved. Built with ❤️ for academic excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
