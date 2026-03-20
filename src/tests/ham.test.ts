import { describe, expect, it } from 'vitest';
import { parseDraMark } from '../parser.js';

interface TreeNode {
  type: string;
  children?: TreeNode[];
}

const integrationFixture = [
  '---',
  'translation:',
  '  enabled: true',
  '---',
  '',
  '@A',
  '= Source line',
  '目标台词',
  '',
  '$$ 主歌',
  '@B',
  '唱段里有 $短句$ 和 <<LX: GO>>',
  '{转身}',
  '@@',
  '$$',
  '',
  '<<< SFX: HIT >>>',
].join('\n');

describe('integration fixture parse', () => {
  it('parses synthetic fixture with expected core structures', () => {
    const input = integrationFixture;
    const result = parseDraMark(input);

    expect(result.metadata.translationEnabledFromFrontmatter).toBe(true);
    expect(result.warnings).toHaveLength(0);

    const all = flatten(result.tree as unknown as TreeNode);

    expect(all.some((n) => n.type === 'frontmatter')).toBe(true);
    expect(all.some((n) => n.type === 'song-container')).toBe(true);
    expect(all.some((n) => n.type === 'character-block')).toBe(true);
    expect(all.some((n) => n.type === 'translation-pair')).toBe(true);
    expect(all.some((n) => n.type === 'block-tech-cue')).toBe(true);
    expect(all.some((n) => n.type === 'inline-song' || n.type === 'inline-spoken')).toBe(true);
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
