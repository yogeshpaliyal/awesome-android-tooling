import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { GitHubStats } from './github-stats';
import posthog from 'posthog-js';

interface Tool {
  name: string;
  description: string;
  link: string;
  tags: string[];
  author?: string;
  authorName?: string;
  authorLink?: string;
}

interface ToolOfTheDayProps {
  tool: Tool | null;
  color: string;
}

export function ToolOfTheDay({ tool, color }: ToolOfTheDayProps) {
  if (!tool) return null;

  useEffect(()=> {
    posthog.capture('tool_of_the_day')
  }, [])

  return (
    <div className="animate-fade-in">
      <Card 
        className={`${color} transition-all hover:shadow-md border-2 border-primary/30`}
        onClick={() => window.open(tool.link, '_blank', 'noopener,noreferrer')}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{tool.name}</CardTitle>
            <div className="px-3 py-1 bg-primary/20 rounded-full text-xs font-semibold text-primary">
              Featured
            </div>
          </div>
          <CardDescription className="text-base">{tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mt-1">
            {tool.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs bg-background/80 text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {tool.authorName && (
            <span className="text-xs text-muted-foreground flex items-center">
              by {tool.authorName}
            </span>
          )}
          {/* Check if the tool link is a GitHub repo */}
          {tool.link.includes('github.com') && <GitHubStats url={tool.link} authorName={tool.authorName} authorLink={tool.authorLink} />}
        </CardFooter>
      </Card>
    </div>
  );
}