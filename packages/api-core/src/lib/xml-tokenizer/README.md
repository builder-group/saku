# XML Tokenizer

Forked from [xml-tokenizer](https://github.com/builder-group/community/tree/develop/packages/xml-tokenizer)

## Why Inlined vs NPM Package?

We currently inline this package instead of using the npm version (`xml-tokenizer`) due to a production bundling issue. Here's the specific case:

```typescript
// This fails in production (after bundling) but works in development
import { tokenize } from 'xml-tokenizer';
tokenize(html, callback, htmlConfig); // Error: invalid name token at 6:6 (;}],null]

// This works in both development and production
import { tokenize } from '@/lib/xml-tokenizer';
tokenize(html, callback, htmlConfig); // Works as expected
```

### Example Case: Parsing LinkPop HTML

When parsing HTML from `linkpop.com/mrbeast`:

```typescript
// NPM package version (fails in production)
let linkPopDataString = await getLinkpopDataStringNpm(html);
// Error: XmlError: invalid name token at 6:6 (;}],null]

// Inlined version (works in both dev and prod)
linkPopDataString = await getLinkpopDataString(html);
// Successfully extracts LinkPop data
```

**Production Error:**
```
error: XmlError: invalid name token at 6:6 (;}],null]
" /><!DOCTYPE html><)
at XmlStream.consumeQName (/app/node_modules/xml-tokenizer/src/tokenizer/XmlStream.ts:422:13)
at parseElement (/app/node_modules/xml-tokenizer/src/tokenizer/tokenize.ts:285:29)
at tokenizeXmlStream (/app/node_modules/xml-tokenizer/src/tokenizer/tokenize.ts:73:9)
at tokenize (/app/node_modules/xml-tokenizer/src/tokenizer/tokenize.ts:43:3)
at file:///app/build/server/index.js?t=1751437367000:10052:7
at Generator.next (<anonymous>)
at file:///app/build/server/index.js?t=1751437367000:9985:61
at new Promise (<anonymous>)
at __async$5 (file:///app/build/server/index.js?t=1751437367000:9969:10)
at getLinkpopDataStringNpm (file:///app/build/server/index.js?t=1751437367000:10047:10) {
  variant: { type: 'InvalidName' },
  pos: { row: 6, col: 6, contextSlice: ';}],null]\n" /><!DOCTYPE html><' }
}
```

### Current Understanding

- The issue appears to be bundling-related as both versions work identically in development
- The NPM package version fails only after bundling for production
- The exact same code works when inlined in our codebase
- We suspect it's related to how the bundler processes the NPM package vs inlined code

### Conclusion

Until we can identify the root cause, we're using the inlined version to ensure production stability.
