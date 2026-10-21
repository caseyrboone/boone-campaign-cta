#!/usr/bin/env node
/**
 * Minimal JSX build using TypeScript's React JSX transform and WordPress-provided
 * React runtime. Avoids bundling a second copy of React into the Gutenberg editor.
 *
 * npm install && npm run build
 */
const fs = require('node:fs');
const path = require('node:path');
let ts;
try {
    ts = require('typescript');
} catch (err) {
    console.error('TypeScript is required. Run `npm install` before `npm run build`.');
    process.exit(1);
}
const root = path.join(__dirname, '..');
const source = path.join(root, 'src');
const target = path.join(root, 'build');
fs.mkdirSync(target, { recursive: true });
const metadata = JSON.parse(fs.readFileSync(path.join(source, 'block.json'), 'utf8'));
const jsx = fs.readFileSync(path.join(source, 'index.jsx'), 'utf8');
if (!jsx.includes('const metadata = __BLOCK_METADATA__;')) throw new Error('Missing metadata placeholder');
const withMetadata = jsx.replace('const metadata = __BLOCK_METADATA__;',
    `const metadata = ${JSON.stringify(metadata)};`);
const output = ts.transpileModule(withMetadata, {
    compilerOptions: {
        allowJs: true,
        jsx: ts.JsxEmit.React,
        jsxFactory: 'wp.element.createElement',
        jsxFragmentFactory: 'wp.element.Fragment',
        target: ts.ScriptTarget.ES2020,
        removeComments: false,
    },
    fileName: 'index.jsx',
    reportDiagnostics: true,
});
if (output.diagnostics?.some(d => d.category === ts.DiagnosticCategory.Error)) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext(output.diagnostics, {
        getCanonicalFileName: name => name,
        getCurrentDirectory: () => root,
        getNewLine: () => '\n',
    }));
}
fs.writeFileSync(path.join(target, 'index.js'), output.outputText);
fs.writeFileSync(path.join(target, 'style-index.css'), fs.readFileSync(path.join(source, 'style.css')));
fs.writeFileSync(path.join(target, 'view.js'), fs.readFileSync(path.join(source, 'view.js')));
fs.writeFileSync(path.join(target, 'block.json'), JSON.stringify(metadata, null, 2) + '\n');
fs.writeFileSync(path.join(target, 'index.asset.php'), `<?php\n// WordPress core packages required by the editor script.\nreturn array(\n  'dependencies' => array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n' ),\n  'version' => '${metadata.version}',\n);\n`);
console.log('Built native Gutenberg block in build/');
