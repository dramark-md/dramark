import { describe, expect, it } from 'vitest';
import { parseDraMark } from '../parser.js';

describe('parseDraMark', () => {
  it('parses character declarations and dialogue blocks', () => {
    const input = ['@哈姆雷特', '生存还是毁灭，这是一个问题。', '---', '舞台恢复安静。'].join('\n');

    const result = parseDraMark(input);
    const first = result.tree.children[0] as { type: string; children: unknown[]; name: string };

    expect(first.type).toBe('character-block');
    expect(first.name).toBe('哈姆雷特');
    expect(first.children.length).toBe(1);
  });

  it('builds translation-pair only inside character context', () => {
    const input = ['@冉阿让', '= Who am I?', '我是谁？', '= Can I conceal myself for evermore?', '我能否永远隐藏自己？'].join('\n');

    const result = parseDraMark(input, { translationEnabled: true });
    const character = result.tree.children[0] as { children: Array<{ type: string; sourceText: string; target: unknown[] }> };

    expect(character.children[0].type).toBe('translation-pair');
    expect(character.children[0].sourceText).toBe('Who am I?');
    expect(character.children[0].target.length).toBe(1);
    expect(character.children[1].type).toBe('translation-pair');
  });

  it('creates a song-container for $$ blocks', () => {
    const input = ['$$', '@群演', '= In New York you can be a new man!', '在纽约，你可以脱胎换骨！', '$$'].join('\n');

    const result = parseDraMark(input, { translationEnabled: true });
    const first = result.tree.children[0] as { type: string; children: unknown[] };

    expect(first.type).toBe('song-container');
    expect(first.children.length).toBe(1);
  });

  it('does not treat plain percentage values as comments', () => {
    const input = ['@财务', '利润下降了 20% 但我们仍在增长。'].join('\n');

    const result = parseDraMark(input);
    const character = result.tree.children[0] as { children: Array<{ type: string; children: Array<{ value: string }> }> };
    const paragraph = character.children[0];

    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children[0].value).toContain('20%');
  });
});