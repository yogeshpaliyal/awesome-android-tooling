import { useState, FormEvent } from 'react';
import { Modal } from './modal';
import { Input } from './input';
import { GitHubAuth, GitHubUser } from './github-auth';

interface SubmitToolDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToolFormData {
  name: string;
  description: string;
  link: string;
  tags: string[];
  authorName?: string;
  authorLink?: string;
}

// GitHub repository details
const REPO_OWNER = 'awesome-android-devs';
const REPO_NAME = 'awesome-android-tooling';
const BASE_BRANCH = 'main';

export function SubmitToolDialog({ isOpen, onClose }: SubmitToolDialogProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<GitHubUser | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    prUrl?: string;
  } | null>(null);

  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    description: '',
    link: '',
    tags: [],
    authorName: '',
    authorLink: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ToolFormData, string>>>({});

  // Handle GitHub authentication state changes
  const handleAuthStateChange = (authenticated: boolean, user?: GitHubUser) => {
    setIsAuthenticated(authenticated);
    setUserData(user);
    
    // Pre-fill author information if user is authenticated
    if (authenticated && user) {
      setFormData(prev => ({
        ...prev,
        authorName: user.name,
        authorLink: `https://github.com/${user.login}`
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof ToolFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput('');
    }
  };

  // Handle removing tags
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  // Handle key press for adding tags
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ToolFormData, string>> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Tool name is required';
    }
    
    if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.link.trim()) {
      errors.link = 'Link is required';
    } else {
      try {
        new URL(formData.link);
      } catch (e) {
        errors.link = 'Please enter a valid URL';
      }
    }
    
    if (formData.tags.length === 0) {
      errors.tags = 'At least one tag is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create a JSON file for the tool
  const createToolJson = (): string => {
    const toolData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      link: formData.link.trim(),
      tags: formData.tags,
    };
    
    // Add optional fields if present
    if (formData.authorName) {
      toolData['authorName'] = formData.authorName;
    }
    
    if (formData.authorLink) {
      toolData['authorLink'] = formData.authorLink;
    }
    
    return JSON.stringify(toolData, null, 2);
  };

  // Generate a unique filename based on the tool name
  const generateFileName = (): string => {
    return formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .concat('.json');
  };

  // Get GitHub API headers with authentication
  const getGitHubHeaders = () => {
    const token = localStorage.getItem('github_token');
    return {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fork the repository
  const forkRepository = async (): Promise<string> => {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/forks`, {
      method: 'POST',
      headers: getGitHubHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fork repository');
    }

    const data = await response.json();
    return data.full_name; // Returns 'username/repo-name'
  };

  // Get the reference to the base branch
  const getReference = async (forkedRepo: string): Promise<string> => {
    const response = await fetch(`https://api.github.com/repos/${forkedRepo}/git/refs/heads/${BASE_BRANCH}`, {
      headers: getGitHubHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get reference');
    }

    const data = await response.json();
    return data.object.sha;
  };

  // Create a new branch
  const createBranch = async (forkedRepo: string, sha: string, branchName: string): Promise<void> => {
    const response = await fetch(`https://api.github.com/repos/${forkedRepo}/git/refs`, {
      method: 'POST',
      headers: getGitHubHeaders(),
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: sha
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create branch');
    }
  };

  // Create a file in the new branch
  const createFile = async (forkedRepo: string, branchName: string, filePath: string, content: string): Promise<void> => {
    const response = await fetch(`https://api.github.com/repos/${forkedRepo}/contents/${filePath}`, {
      method: 'PUT',
      headers: getGitHubHeaders(),
      body: JSON.stringify({
        message: `Add ${formData.name} tool`,
        content: btoa(content), // Base64 encode the content
        branch: branchName
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create file');
    }
  };

  // Create a pull request
  const createPullRequest = async (forkedRepo: string, branchName: string): Promise<string> => {
    // Extract username from forkedRepo (username/repo)
    const username = forkedRepo.split('/')[0];
    
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
      method: 'POST',
      headers: getGitHubHeaders(),
      body: JSON.stringify({
        title: `Add ${formData.name} tool`,
        body: `This PR adds the ${formData.name} tool to the collection.\n\n` +
              `**Description**: ${formData.description}\n` +
              `**Link**: ${formData.link}\n` +
              `**Tags**: ${formData.tags.join(', ')}\n\n` +
              `Submitted by: ${formData.authorName || username}`,
        head: `${username}:${branchName}`,
        base: BASE_BRANCH
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create pull request');
    }

    const data = await response.json();
    return data.html_url;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!isAuthenticated) {
      setFormErrors({ name: 'You must be authenticated with GitHub to submit a tool' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate filename and content
      const fileName = generateFileName();
      const fileContent = createToolJson();
      
      // Create a unique branch name
      const timestamp = new Date().getTime();
      const branchName = `add-tool-${fileName.replace('.json', '')}-${timestamp}`;
      
      // Step 1: Fork the repository
      const forkedRepo = await forkRepository();
      
      // Step 2: Get reference to base branch
      const ref = await getReference(forkedRepo);
      
      // Step 3: Create new branch
      await createBranch(forkedRepo, ref, branchName);
      
      // Step 4: Create the tool JSON file
      await createFile(forkedRepo, branchName, `data/${fileName}`, fileContent);
      
      // Step 5: Create pull request
      const prUrl = await createPullRequest(forkedRepo, branchName);
      
      setSubmissionResult({
        success: true,
        message: 'Tool submitted successfully! A pull request has been created.',
        prUrl: prUrl
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        link: '',
        tags: [],
        authorName: userData?.name || '',
        authorLink: userData ? `https://github.com/${userData.login}` : '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionResult({
        success: false,
        message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit a New Tool">
      <div className="space-y-6">
        {!submissionResult ? (
          <>
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">GitHub Authentication Required</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You need to sign in with GitHub to submit a new tool. This allows us to create a pull request on your behalf.
                </p>
                <GitHubAuth onAuthStateChange={handleAuthStateChange} />
              </div>
            )}
            
            {isAuthenticated && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tool Name *
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter the official name of the tool"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={formErrors.name}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Provide a clear, concise description of the tool (min 10 characters)"
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                    Link *
                  </label>
                  <Input
                    id="link"
                    placeholder="Link to official documentation or repository"
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    error={formErrors.link}
                  />
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags *
                  </label>
                  <div className="flex items-center">
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter or comma to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      error={formErrors.tags}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {formErrors.tags && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.tags}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name (Optional)
                  </label>
                  <Input
                    id="authorName"
                    placeholder="Name of the tool author (if different from you)"
                    value={formData.authorName || ''}
                    onChange={(e) => handleInputChange('authorName', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="authorLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Link (Optional)
                  </label>
                  <Input
                    id="authorLink"
                    placeholder="Link to the tool author's website or profile"
                    value={formData.authorLink || ''}
                    onChange={(e) => handleInputChange('authorLink', e.target.value)}
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Tool'
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="text-center">
            {submissionResult.success ? (
              <>
                <div className="mb-4 text-center">
                  <span className="inline-block p-2 rounded-full bg-green-100">
                    <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Successful!</h3>
                <p className="text-sm text-gray-600 mb-4">{submissionResult.message}</p>
                {submissionResult.prUrl && (
                  <a
                    href={submissionResult.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    View Pull Request
                  </a>
                )}
              </>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <span className="inline-block p-2 rounded-full bg-red-100">
                    <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Failed</h3>
                <p className="text-sm text-gray-600 mb-4">{submissionResult.message}</p>
                <button
                  onClick={() => setSubmissionResult(null)}
                  className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}