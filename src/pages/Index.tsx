import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TypewriterText from '@/components/TypewriterText';
import Sidebar from '@/components/Sidebar';
import heroIllustration from '@/assets/hero-illustration.jpg';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userTypes = ['Students', 'Developers', 'Professionals', 'IT Teachers'];

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-hero opacity-50" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-gradient-glow rounded-full blur-3xl opacity-30" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-gradient-glow rounded-full blur-3xl opacity-20" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <i className="fas fa-code text-2xl text-primary"></i>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Code Depot
          </span>
        </div>
        
        <button
          onClick={openSidebar}
          className="p-3 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
        >
          <i className="fas fa-bars text-foreground text-xl"></i>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Hero Text */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="text-foreground">The Best</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Code Manager
                </span>
                <br />
                <span className="text-foreground">For</span>
              </h1>
              
              <div className="text-4xl md:text-5xl font-bold h-16 flex items-center">
                <TypewriterText 
                  words={userTypes}
                  className="bg-gradient-primary bg-clip-text text-transparent"
                />
              </div>
            </div>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Organize, manage, and share your code repositories with ease. 
              Built for modern developers who value simplicity and efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={openSidebar}
                className="text-lg px-8 py-4"
              >
                <i className="fas fa-rocket mr-2"></i>
                Get Started
              </Button>
              
              <Button 
                variant="glass" 
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => window.open('https://github.com/your-username/code-depot', '_blank')}
              >
                <i className="fab fa-github mr-2"></i>
                View Source
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">50K+</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glass">
              <img 
                src={heroIllustration}
                alt="Code management illustration"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-20" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-xl backdrop-blur-sm border border-primary/30 flex items-center justify-center animate-pulse">
              <i className="fas fa-code text-primary text-xl"></i>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-secondary/20 rounded-xl backdrop-blur-sm border border-secondary/30 flex items-center justify-center animate-pulse">
              <i className="fab fa-git-alt text-secondary text-2xl"></i>
            </div>
            
            <div className="absolute top-1/2 -right-8 w-12 h-12 bg-accent/20 rounded-xl backdrop-blur-sm border border-accent/30 flex items-center justify-center animate-pulse">
              <i className="fas fa-database text-accent"></i>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="pt-32 pb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Why Choose Code Depot?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your code, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-muted-foreground">
                Your code is protected with enterprise-grade security and encryption.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-users text-secondary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with built-in collaboration tools.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-rocket text-accent text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Deployment</h3>
              <p className="text-muted-foreground">
                Deploy your projects instantly with our integrated CI/CD pipeline.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
};

export default Index;
