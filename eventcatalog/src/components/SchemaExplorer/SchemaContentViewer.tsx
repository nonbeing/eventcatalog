import { ClipboardDocumentIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { buildUrl } from '@utils/url-builder';
import JSONSchemaViewer from './JSONSchemaViewer';
import AvroSchemaViewer from './AvroSchemaViewer';
import { getLanguageForHighlight } from './utils';
import type { SchemaItem } from './types';

// Hook to detect dark mode
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for changes to the dark class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

interface SchemaContentViewerProps {
  message: SchemaItem;
  onCopy: () => void;
  isCopied: boolean;
  viewMode: 'code' | 'schema' | 'diff';
  parsedSchema: any;
  parsedAvroSchema?: any;
  onOpenFullscreen?: () => void;
  showRequired?: boolean;
}

export default function SchemaContentViewer({
  message,
  onCopy,
  isCopied,
  viewMode,
  parsedSchema,
  parsedAvroSchema,
  showRequired = false,
  onOpenFullscreen,
}: SchemaContentViewerProps) {
  const isDark = useDarkMode();
  const syntaxHighlighterStyle = isDark ? oneDark : oneLight;

  if (!message.schemaContent) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p className="text-sm">No schema content available</p>
      </div>
    );
  }

  // Render schema viewer based on schema type
  if (viewMode === 'schema') {
    if (parsedAvroSchema) {
      return <AvroSchemaViewer schema={parsedAvroSchema} onOpenFullscreen={onOpenFullscreen} showRequired={showRequired} />;
    }
    if (parsedSchema) {
      return <JSONSchemaViewer schema={parsedSchema} onOpenFullscreen={onOpenFullscreen} />;
    }
  }

  return (
    <div className="h-full overflow-auto p-3 relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
        {message.collection === 'services' &&
          (() => {
            const specType = message.specType || 'openapi';
            const specFilename = message.specFilenameWithoutExtension || 'schema';

            // Determine the URL path segment based on spec type
            let urlSegment = 'spec';
            if (specType === 'asyncapi') {
              urlSegment = 'asyncapi';
            } else if (specType === 'graphql') {
              urlSegment = 'graphql';
            }

            const specUrl = buildUrl(`/docs/services/${message.data.id}/${message.data.version}/${urlSegment}/${specFilename}`);

            return (
              <a
                href={specUrl}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors shadow-sm"
                title="View full specification"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Spec
              </a>
            );
          })()}
        {onOpenFullscreen && (
          <button
            onClick={onOpenFullscreen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors shadow-sm"
            title="Open in fullscreen"
          >
            <ArrowsPointingOutIcon className="h-3.5 w-3.5" />
            Fullscreen
          </button>
        )}
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors shadow-sm"
          title="Copy code"
        >
          <ClipboardDocumentIcon className="h-3.5 w-3.5" />
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={getLanguageForHighlight(message.schemaExtension)}
        style={syntaxHighlighterStyle}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          paddingTop: '2.5rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          height: '100%',
          overflow: 'auto',
        }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
        showLineNumbers={true}
        wrapLines={true}
        wrapLongLines={true}
      >
        {message.schemaContent}
      </SyntaxHighlighter>
    </div>
  );
}
