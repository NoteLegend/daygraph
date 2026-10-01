import { mkdir, writeFile } from 'node:fs/promises';
const commit = 'e1bbb696fc53f7f91e694c529e4d68c899773b6e';
const components = [['Backgrounds','Aurora'],['Components','SpotlightCard'],['Animations','Magnet'],['Animations','ClickSpark'],['TextAnimations','CountUp'],['TextAnimations','BlurText'],['Animations','FadeContent'],['Animations','AnimatedContent'],['Animations','StarBorder'],['TextAnimations','ShinyText']];
await mkdir('components/react-bits', { recursive: true });
for (const [group, name] of components) {
  for (const ext of ['jsx','css']) {
    const url = `https://raw.githubusercontent.com/DavidHDev/react-bits/${commit}/src/content/${group}/${name}/${name}.${ext}`;
    const r = await fetch(url);
    if (!r.ok) { if (ext === 'css' && r.status === 404) continue; throw Error(`${name}: ${r.status}`); }
    const source = await r.text();
    await writeFile(`components/react-bits/${name}.${ext}`, ext === 'jsx' ? `'use client';\n// React Bits, pinned at ${commit}. See THIRD_PARTY.md.\n${source.replace(/^['"]use client['"];?\s*/, '')}` : source);
    console.log(`Imported ${name}.${ext}`);
  }
}
const license = await fetch(`https://raw.githubusercontent.com/DavidHDev/react-bits/${commit}/LICENSE.md`);
if (!license.ok) throw Error('Missing React Bits license');
await writeFile('components/react-bits/LICENSE', await license.text());
