import { TreeView } from '@components/TreeView';
import { navigate } from 'astro:transitions/client';
import type { TreeNode as RawTreeNode } from './getTreeView';
import { getIconForCollection } from '@utils/collections/icons';
import { useEffect, useState } from 'react';

type TreeNode = RawTreeNode & { isLabel?: true; isDefaultExpanded?: boolean; isExpanded?: boolean };

function isCurrentNode(node: TreeNode, currentPathname: string) {
  return currentPathname === node.href;
}

function TreeNode({ node }: { node: TreeNode }) {
  const Icon = getIconForCollection(node.type ?? '');
  const [isCurrent, setIsCurrent] = useState(document.location.pathname === node.href);

  useEffect(() => {
    const abortCtrl = new AbortController();
    // prettier-ignore
    document.addEventListener(
      'astro:page-load', 
      () => setIsCurrent(document.location.pathname === node.href), 
      { signal: abortCtrl.signal },
    );
    return () => abortCtrl.abort();
  }, [document, node]);

  return (
    <TreeView.Item
      key={node.id}
      id={node.id}
      current={isCurrent}
      defaultExpanded={node?.isExpanded || node?.isDefaultExpanded}
      onSelect={node?.isLabel || !node?.href ? undefined : () => navigate(node.href!)}
    >
      {!node?.isLabel && (
        <TreeView.LeadingVisual>
          <Icon className="w-3 -ml-1" />
        </TreeView.LeadingVisual>
      )}
      <span
        className={node?.isLabel ? ' capitalize  text-[13px]  text-purple-500 dark:text-purple-400 font-extrabold' : 'font-light text-[14px] -ml-0.5 text-gray-700 dark:text-gray-300'}
      >
        {node.name} {node.isLabel ? `(${node.children.length})` : ''}
      </span>
      {(node.children || []).length > 0 && (
        <TreeView.SubTree>
          {node.children!.map((childNode) => (
            <TreeNode key={childNode.id} node={childNode} />
          ))}
        </TreeView.SubTree>
      )}
    </TreeView.Item>
  );
}

export function SideNavTreeView({ tree }: { tree: TreeNode }) {
  function bubbleUpExpanded(parentNode: TreeNode) {
    if (isCurrentNode(parentNode, document.location.pathname)) return true;
    return (parentNode.isDefaultExpanded = parentNode.children.some(bubbleUpExpanded));
  }
  bubbleUpExpanded(tree);

  // Check if dark mode is active - start with false for SSR, then sync on mount
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Set initial value on mount
    setIsDark(document.documentElement.classList.contains('dark'));

    // Listen for changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <nav id="resources-tree" className="px-2 py-2">
      <TreeView
        truncate={false}
        style={{
          // @ts-expect-error inline css var
          '--base-size-8': '0.5rem',
          '--base-size-12': '0.75rem',
          '--borderColor-muted': isDark ? '#334155' : '#fff',
          '--borderRadius-medium': '0.375rem',
          '--borderWidth-thick': '0.125rem',
          '--borderWidth-thin': '0.0625rem',
          '--boxShadow-thick': 'inset 0 0 0 var(--borderWidth-thick)',
          '--control-transparent-bgColor-hover': isDark ? '#334155' : '#656c7626',
          '--control-transparent-bgColor-selected': isDark ? 'rgba(168, 85, 247, 0.35)' : '#656c761a',
          '--fgColor-default': isDark ? '#e2e8f0' : '#374151',
          '--fgColor-muted': isDark ? '#cbd5e1' : '#6b7280',
          '--text-body-size-medium': '0.875rem',
          '--stack-gap-condensed': '0.5rem',
          '--treeViewItem-leadingVisual-iconColor-rest': 'var(--fgColor-muted)',
        }}
      >
        {tree.children.map((n) => (
          <TreeNode key={n.id} node={n} />
        ))}
      </TreeView>
    </nav>
  );
}
