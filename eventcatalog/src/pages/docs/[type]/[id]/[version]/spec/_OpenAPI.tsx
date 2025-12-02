import { useState, useEffect } from 'react';
import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';
import './_styles.css';
const OpenAPISpec = ({ spec }: { spec: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for changes to the dark mode class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {!loaded && <div className="dark:text-gray-300">Loading...</div>}
      <ApiReferenceReact
        key={isDarkMode ? 'dark' : 'light'}
        configuration={{
          spec: {
            content: spec,
          },
          theme: 'fastify',
          hideClientButton: true,
          onLoaded: () => {
            setLoaded(true);
          },
          forceDarkModeState: isDarkMode ? 'dark' : 'light',
          darkMode: isDarkMode,
          defaultOpenAllTags: true,
          hideDarkModeToggle: true,
          searchHotKey: 'p',
          showSidebar: true,
        }}
      />
    </div>
  );
};

export default OpenAPISpec;
