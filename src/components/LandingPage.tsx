import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  PiggyBank, 
  Smartphone, 
  Zap,
  ChevronRight 
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <BarChart3 className="size-6 text-primary-foreground" />
            </div>
            <span className="text-xl text-[24px] text-primary">FinanceTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLogin}>
              Login
            </Button>
            <Button onClick={onGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10"></div>
        <div className="relative px-6 py-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Zap className="size-3 mr-1" />
                  Smart Finance Tracking
                </Badge>
                <h1 className="text-5xl lg:text-6xl text-[60px] leading-tight">
                  Master Your
                  <span className="text-primary block"> Money</span>
                  <span className="text-muted-foreground text-4xl lg:text-5xl text-[48px]">in Minutes</span>
                </h1>
              </div>
              
              <p className="text-muted-foreground text-xl text-[20px] leading-relaxed max-w-lg">
                Take control of your financial future with intelligent expense tracking, 
                budget management, and insights that help you save more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onGetStarted} className="group">
                  Start Free Trial
                  <ChevronRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  <BarChart3 className="size-4 mr-2" />
                  View Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl text-[24px] text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-[24px] text-primary">₹20L+</div>
                  <div className="text-sm text-muted-foreground">Money Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-[24px] text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-card to-muted/50 rounded-2xl border shadow-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                  alt="Finance Dashboard Preview"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Badge className="bg-success text-success-foreground">
                      <TrendingUp className="size-3 mr-1" />
                      +12.5%
                    </Badge>
                    <span className="text-muted-foreground">Monthly Growth</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -right-6 top-6 bg-card border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <PiggyBank className="size-4 text-primary" />
                  <span>₹2,45,000 Saved</span>
                </div>
              </div>
              
              <div className="absolute -left-6 bottom-6 bg-card border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="size-4 text-success" />
                  <span>Bank Level Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl text-[36px]">Everything You Need</h2>
            <p className="text-muted-foreground text-xl text-[20px] max-w-2xl mx-auto">
              Powerful features designed to make managing your money simple and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="size-7 text-primary" />
              </div>
              <h3 className="text-xl text-[20px] mb-3">Smart Analytics</h3>
              <p className="text-muted-foreground text-[16px] leading-relaxed">
                Get detailed insights into your spending patterns with beautiful charts and AI-powered recommendations.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
              <div className="size-14 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
                <PiggyBank className="size-7 text-success" />
              </div>
              <h3 className="text-xl text-[20px] mb-3">Budget Goals</h3>
              <p className="text-muted-foreground text-[16px] leading-relaxed">
                Set personalized budgets and track your progress with smart notifications and goal setting.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
              <div className="size-14 bg-warning/10 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="size-7 text-warning" />
              </div>
              <h3 className="text-xl text-[20px] mb-3">Mobile Ready</h3>
              <p className="text-muted-foreground text-[16px] leading-relaxed">
                Access your finances anywhere with our responsive design that works perfectly on all devices.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
              <div className="size-14 bg-chart-3/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="size-7" style={{ color: 'var(--chart-3)' }} />
              </div>
              <h3 className="text-xl text-[20px] mb-3">Expense Tracking</h3>
              <p className="text-muted-foreground text-[16px] leading-relaxed">
                Automatically categorize transactions and track every dollar with intuitive expense management.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
              <div className="size-14 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="size-7 text-destructive" />
              </div>
              <h3 className="text-xl text-[20px] mb-3">Secure & Private</h3>
              <p className="text-muted-foreground text-[16px] leading-relaxed">
                Your financial data is protected with bank-level encryption and privacy-first design principles.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
              <div className="size-14 bg-chart-2/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="size-7" style={{ color: 'var(--chart-2)' }} />
              </div>
              <h3 className="text-xl text-[20px] mb-3">Real-time Sync</h3>
              <p className="text-muted-foreground text-[16px] leading-relaxed">
                Instant synchronization across all your devices so your financial data is always up to date.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl text-[48px]">
              Ready to Take Control?
            </h2>
            <p className="text-muted-foreground text-xl text-[20px] max-w-2xl mx-auto">
              Join thousands of users who've already transformed their financial habits with FinanceTracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={onGetStarted} className="group">
                Start Your Free Trial
                <ChevronRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <BarChart3 className="size-5 text-primary-foreground" />
                </div>
                <span className="text-lg text-[18px] text-primary">FinanceTracker</span>
              </div>
              <p className="text-muted-foreground text-sm text-[14px]">
                Smart finance tracking for the modern world. Take control of your financial future today.
              </p>
            </div>
            
            <div>
              <h4 className="text-[16px] mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[14px] text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[16px] mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[14px] text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[16px] mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-[14px] text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-sm text-[14px] text-muted-foreground">
            © 2025 FinanceTracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}