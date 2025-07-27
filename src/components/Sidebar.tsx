import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loginKey, setLoginKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing authentication
    const storedKey = localStorage.getItem('codeDepotKey');
    const storedAuth = localStorage.getItem('codeDepotAuth');
    
    if (storedKey && storedAuth === 'true') {
      setAccessKey(storedKey);
      setIsAuthenticated(true);
    }

    // Check theme preference
    const storedTheme = localStorage.getItem('codeDepotTheme');
    setIsDarkMode(storedTheme === 'dark');
  }, []);

  const generateKey = async () => {
    setIsLoading(true);
    try {
      // Generate random alphanumeric key
      const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Store key locally
      localStorage.setItem('codeDepotKey', key);
      localStorage.setItem('codeDepotAuth', 'true');
      
      setAccessKey(key);
      setIsAuthenticated(true);
      
      toast({
        title: "Key Generated Successfully!",
        description: `Your access key: ${key.substring(0, 6)}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your access key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate key verification (in real app, would check GitHub API)
      localStorage.setItem('codeDepotKey', loginKey);
      localStorage.setItem('codeDepotAuth', 'true');
      
      setAccessKey(loginKey);
      setIsAuthenticated(true);
      setLoginKey('');
      
      toast({
        title: "Login Successful!",
        description: "Welcome back to Code Depot.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid access key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('codeDepotKey');
    localStorage.removeItem('codeDepotAuth');
    setIsAuthenticated(false);
    setAccessKey('');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('codeDepotTheme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const openGitHub = () => {
    window.open('https://github.com/your-username/code-depot', '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] transform transition-transform duration-300 ease-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full bg-glass-bg backdrop-blur-glass border-l border-glass-border shadow-glass">
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Code Depot
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <i className="fas fa-times text-foreground text-xl"></i>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              {!isAuthenticated ? (
                <>
                  {/* Login Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Log In</h3>
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Enter your access key"
                        value={loginKey}
                        onChange={(e) => setLoginKey(e.target.value)}
                        className="bg-muted/50 border-border"
                      />
                      <Button 
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        <i className="fas fa-sign-in-alt mr-2"></i>
                        {isLoading ? 'Logging in...' : 'Log In'}
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Don't have an account?
                    </h3>
                    <Button 
                      onClick={generateKey}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-primary hover:bg-primary/10"
                    >
                      <i className="fas fa-key mr-2"></i>
                      {isLoading ? 'Generating...' : 'Generate Key'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Authenticated Section */}
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Access Key</p>
                      <p className="font-mono text-primary">
                        {accessKey.substring(0, 6)}*****
                      </p>
                    </div>

                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-destructive hover:bg-destructive/10 text-destructive"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Log Out
                    </Button>

                    <Button 
                      onClick={toggleTheme}
                      variant="outline"
                      className="w-full"
                    >
                      <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} mr-2`}></i>
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>

                    <Button 
                      onClick={openGitHub}
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      <i className="fab fa-github mr-2"></i>
                      View on GitHub
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;