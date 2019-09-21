import { parse, generate } from '../src'
import { SourceMapConsumer, RawSourceMap } from 'source-map'

describe('compiler: codegen', () => {
  test('basic source map support', async () => {
    const source = `hello {{ world }}`
    const ast = parse(source)
    const { code, map } = generate(ast, {
      filename: `foo.vue`
    })
    expect(code).toBe(`["hello ", world]`)

    expect(map!.sources).toEqual([`foo.vue`])
    expect(map!.sourcesContent).toEqual([source])

    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    const pos = consumer.originalPositionFor({
      line: 1,
      column: 11
    })
    expect(pos).toMatchObject({
      line: 1,
      column: 6
    })
  })
})