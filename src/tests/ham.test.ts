import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDraMark } from '../parser.js';

interface TreeNode {
  type: string;
  children?: TreeNode[];
}

describe('example/ham.md parse integration', () => {
  it('parses ham example with expected core structures', () => {
    const input = readFileSync('example/ham.md', 'utf8');
    const result = parseDraMark(input);

    expect(result.metadata.translationEnabledFromFrontmatter).toBe(true);
    expect(result.warnings).toHaveLength(0);

    const all = flatten(result.tree as unknown as TreeNode);

    expect(all.some((n) => n.type === 'frontmatter')).toBe(true);
    expect(all.some((n) => n.type === 'song-container')).toBe(true);
    expect(all.some((n) => n.type === 'character-block')).toBe(true);
    expect(all.some((n) => n.type === 'translation-pair')).toBe(true);
    expect(all.some((n) => n.type === 'block-tech-cue')).toBe(true);
    expect(all.some((n) => n.type === 'inline-song')).toBe(true);
    expect(all.some((n) => n.type === 'inline-tech-cue')).toBe(true);
    expect(all.some((n) => n.type === 'inline-action')).toBe(true);
  });
});

function flatten(node: TreeNode): TreeNode[] {
  const out: TreeNode[] = [node];
  if (!node.children) {
    return out;
  }
  for (const child of node.children) {
    out.push(...flatten(child));
  }
  return out;
}