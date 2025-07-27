import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExternalLink, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubPAT: string;
  setGithubPAT: (pat: string) => void;
  githubRepo: string;
  setGithubRepo: (repo: string) => void;
  onSave: () => void;
}

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  githubPAT, 
  setGithubPAT, 
  githubRepo, 
  setGithubRepo,
  onSave 
}: SettingsModalProps) => {
  const [showPAT, setShowPAT] = useState(false);

  const handleSave = () => {
    if (!githubPAT.trim() || !githubRepo.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate repo format (username/repo-name)
    if (!githubRepo.includes('/') || githubRepo.split('/').length !== 2) {
      toast.error('Repository format should be: username/repository-name');
      return;
    }

    localStorage.setItem('github_pat', githubPAT);
    localStorage.setItem('github_repo', githubRepo);
    
    toast.success('Settings saved successfully!');
    onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>GitHub Integration Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">1. Create a GitHub Personal Access Token:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Go to GitHub → Settings → Developer settings → Personal access tokens</li>
                  <li>Click "Generate new token (classic)"</li>
                  <li>Select scopes: <code className="bg-muted px-1 rounded">repo</code> (Full control of private repositories)</li>
                  <li>Copy the generated token</li>
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open('https://github.com/settings/tokens', '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Create GitHub Token
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">2. Repository Format:</p>
                <p className="text-muted-foreground">
                  Enter your repository in the format: <code className="bg-muted px-1 rounded">username/repository-name</code>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-pat">GitHub Personal Access Token</Label>
              <div className="relative">
                <Input
                  id="github-pat"
                  type={showPAT ? 'text' : 'password'}
                  value={githubPAT}
                  onChange={(e) => setGithubPAT(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPAT(!showPAT)}
                >
                  {showPAT ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-repo">GitHub Repository</Label>
              <Input
                id="github-repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="yourusername/your-repo-name"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};