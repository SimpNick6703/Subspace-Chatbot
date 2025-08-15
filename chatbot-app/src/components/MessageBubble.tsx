import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

// Copy button component for code blocks
const CopyButton: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

// Helper function to extract text from React nodes
const extractTextFromChildren = (children: any): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (children && typeof children === 'object' && children.props) {
    return extractTextFromChildren(children.props.children);
  }
  return '';
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.is_bot;
  const timestamp = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Clean up the message content for better markdown parsing
  const cleanContent = (content: string) => {
    // Remove any extra backticks or formatting issues
    return content
      .replace(/`([^`]+)`/g, '`$1`') // Ensure single backticks are preserved
      .replace(/```(\w*)\n([\s\S]*?)```/g, '```$1\n$2\n```') // Clean up code blocks
      .trim();
  };

  // Extract code blocks from markdown content for copying
  const extractCodeBlocks = (content: string) => {
    const codeBlocks: string[] = [];
    const regex = /```[\w]*\n?([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      codeBlocks.push(match[1].trim());
    }
    return codeBlocks;
  };

  const codeBlocks = extractCodeBlocks(message.content);
  let codeBlockIndex = 0;

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`${isBot ? 'max-w-4xl' : 'max-w-xs lg:max-w-md'} px-4 py-2 rounded-lg ${
        isBot 
          ? 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border' 
          : 'bg-light-accent dark:bg-dark-accent text-white'
      }`}>
        <div className="flex items-start space-x-2">
          {isBot && (
            <div className="flex-shrink-0 w-6 h-6 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center">
              <span className="text-xs text-white">🤖</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {isBot ? (
              <div className={`text-base prose prose-base dark:prose-invert max-w-none overflow-x-auto ${
                isBot 
                  ? 'text-light-text dark:text-dark-text' 
                  : 'text-white'
              }`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // Custom styling for code blocks
                    code: ({ node, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match && !className;
                      
                      if (isInline) {
                        return (
                          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-base font-mono" {...props}>
                            {children}
                          </code>
                        );
                      } else {
                        const codeContent = codeBlocks[codeBlockIndex] || '';
                        codeBlockIndex++;
                        return (
                          <div className="relative group">
                            <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-x-auto my-3">
                              <code className={`${className} text-base`} {...props}>
                                {children}
                              </code>
                            </pre>
                            <CopyButton content={codeContent} />
                          </div>
                        );
                      }
                    },
                    // Custom styling for paragraphs
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    // Custom styling for lists
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                    ),
                    // Custom styling for headers
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold mb-1">{children}</h3>
                    ),
                    // Custom styling for blockquotes
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-2">
                        {children}
                      </blockquote>
                    )
                  }}
                >
                  {cleanContent(message.content)}
                </ReactMarkdown>
              </div>
            ) : (
              <p className={`text-sm ${
                isBot 
                  ? 'text-light-text dark:text-dark-text' 
                  : 'text-white'
              }`}>
                {message.content}
              </p>
            )}
            <p className={`text-xs mt-1 ${
              isBot 
                ? 'text-light-text/60 dark:text-dark-text/60' 
                : 'text-white/80'
            }`}>
              {timestamp}
            </p>
          </div>
          {!isBot && (
            <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">👤</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
