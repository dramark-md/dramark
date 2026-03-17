import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { VFile } from 'vfile';
import remarkDraMark from '../index.js';
import { parseDraMark } from '../parser.js';

describe('remarkDraMark plugin', () => {
  it('collects warnings in non-strict mode', () => {
    const result = parseDraMark('= orphan translation line');
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].code).toBe('TRANSLATION_OUTSIDE_CHARACTER');
  });

  it('throws in strict mode when warnings exist', async () => {
    const processor = unified().use(remarkParse).use(remarkDraMark, { strictMode: true });
    const file = new VFile({ value: '$$\n@A\n未闭合唱段' });
    const tree = processor.parse(file);

    await expect(processor.run(tree, file)).rejects.toThrow('UNCLOSED_SONG_CONTAINER');
  });
});