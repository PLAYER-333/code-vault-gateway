import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Save, Trash2, Plus, Folder, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { SettingsModal } from './SettingsModal';

interface CodeFile {
  name: string;
  content: string;
  language: string;
}

interface CodeEditorProps {
  accessKey: string;
}

export const CodeEditor = ({ accessKey }: CodeEditorProps) => {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [githubPAT, setGithubPAT] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedPAT = localStorage.getItem('github_pat');
    const savedRepo = localStorage.getItem('github_repo');
    if (savedPAT) setGithubPAT(savedPAT);
    if (savedRepo) setGithubRepo(savedRepo);
    
    // Load files if we have credentials
    if (savedPAT && savedRepo) {
      loadFiles();
    }
  }, [accessKey]);

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'txt': 'text'
    };
    return languageMap[ext || ''] || 'text';
  };

  const loadFiles = async () => {
    if (!githubPAT || !githubRepo) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/code/${accessKey}`, {
        headers: {
          'Authorization': `token ${githubPAT}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const filePromises = data
          .filter((item: any) => item.type === 'file')
          .map(async (item: any) => {
            const fileResponse = await fetch(item.download_url);
            const content = await fileResponse.text();
            return {
              name: item.name,
              content,
              language: getLanguageFromFileName(item.name)
            };
          });
        
        const loadedFiles = await Promise.all(filePromises);
        setFiles(loadedFiles);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async (file: CodeFile) => {
    if (!githubPAT || !githubRepo) {
      toast.error('Please configure GitHub settings first');
      setIsSettingsOpen(true);
      return;
    }

    setLoading(true);
    try {
      // Check if file exists to get SHA
      let sha = '';
      try {
        const existingResponse = await fetch(`https://api.github.com/repos/${githubRepo}/contents/code/${accessKey}/${file.name}`, {
          headers: {
            'Authorization': `token ${githubPAT}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (existingResponse.ok) {
          const existingData = await existingResponse.json();
          sha = existingData.sha;
        }
      } catch (error) {
        // File doesn't exist, that's ok
      }

      const content = btoa(unescape(encodeURIComponent(file.content)));
      const payload = {
        message: `Save ${file.name}`,
        content,
        ...(sha && { sha })
      };

      const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/code/${accessKey}/${file.name}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubPAT}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(`${file.name} saved successfully!`);
      } else {
        const error = await response.json();
        toast.error(`Failed to save: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    if (!githubPAT || !githubRepo) return;

    setLoading(true);
    try {
      // Get file SHA
      const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/code/${accessKey}/${fileName}`, {
        headers: {
          'Authorization': `token ${githubPAT}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        await fetch(`https://api.github.com/repos/${githubRepo}/contents/code/${accessKey}/${fileName}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${githubPAT}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: `Delete ${fileName}`,
            sha: data.sha
          })
        });

        setFiles(files.filter(f => f.name !== fileName));
        if (activeFile?.name === fileName) {
          setActiveFile(null);
        }
        toast.success(`${fileName} deleted successfully!`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  const createFile = () => {
    if (!newFileName.trim()) return;
    
    const newFile: CodeFile = {
      name: newFileName,
      content: '',
      language: getLanguageFromFileName(newFileName)
    };
    
    setFiles([...files, newFile]);
    setActiveFile(newFile);
    setNewFileName('');
    setIsCreating(false);
  };

  const updateFileContent = (content: string) => {
    if (!activeFile) return;
    
    const updatedFile = { ...activeFile, content };
    setActiveFile(updatedFile);
    
    // Update in files array
    setFiles(files.map(f => f.name === activeFile.name ? updatedFile : f));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Folder className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Code Depot</h1>
            <Badge variant="secondary">Key: {accessKey.slice(0, 8)}...</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Explorer */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Files
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsCreating(true)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isCreating && (
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="filename.js"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createFile()}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button size="sm" onClick={createFile} className="h-8 px-2">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    activeFile?.name === file.name
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setActiveFile(file)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.name);
                    }}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {files.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No files yet. Create your first file!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  {activeFile ? activeFile.name : 'Select a file to edit'}
                </CardTitle>
                {activeFile && (
                  <Button
                    size="sm"
                    onClick={() => saveFile(activeFile)}
                    disabled={loading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {activeFile ? (
                <div className="space-y-4">
                  <textarea
                    value={activeFile.content}
                    onChange={(e) => updateFileContent(e.target.value)}
                    className="w-full h-96 p-4 font-mono text-sm bg-muted/30 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={`Start coding in ${activeFile.name}...`}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Language: {activeFile.language}</span>
                    <span>Lines: {activeFile.content.split('\n').length}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a file from the sidebar to start editing</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        githubPAT={githubPAT}
        setGithubPAT={setGithubPAT}
        githubRepo={githubRepo}
        setGithubRepo={setGithubRepo}
        onSave={loadFiles}
      />
    </div>
  );
};