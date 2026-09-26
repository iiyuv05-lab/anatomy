import { AdapterResult, ArtifactInput, BinaryAdapter, u32le } from '../core/adapter';

type AsarFile = { size?: number; offset?: string; unpacked?: boolean };
type AsarNode = { files?: Record<string, AsarNode>; size?: number; offset?: string; unpacked?: boolean };

const flatten = (node: AsarNode, prefix = '', out: { path: string; file: AsarFile }[] = []) => {
  if (node.files) {
    for (const [name, child] of Object.entries(node.files)) flatten(child, prefix ? prefix + '/' + name : name, out);
  } else if (prefix) out.push({ path: prefix, file: node });
  return out;
};

const readHeader = (bytes: Uint8Array) => {
  if (bytes.length < 16) return null;
  const candidates = [u32le(bytes, 4), u32le(bytes, 12)];
  for (const size of candidates) {
    if (!size || size > bytes.length - 16 || size > 32 * 1024 * 1024) continue;
    for (const start of [8, 16]) {
      if (start + size > bytes.length) continue;
      const text = new TextDecoder().decode(bytes.slice(start, start + size));
      const first = text.indexOf('{');
      const last = text.lastIndexOf('}');
      if (first < 0 || last <= first) continue;
      try {
        const parsed = JSON.parse(text.slice(first, last + 1)) as AsarNode;
        if (parsed && parsed.files) return parsed;
      } catch {}
    }
  }
  return null;
};

export const asarAdapter: BinaryAdapter = {
  id: 'asar',
  supports({ name, bytes }) {
    return name.toLowerCase().endsWith('.asar') || readHeader(bytes) !== null;
  },
  analyze({ name, bytes }): AdapterResult {
    const header = readHeader(bytes);
    if (!header) {
      return {
        adapter: 'asar',
        format: 'ASAR',
        facts: { name, parsed: false },
        nodes: [
          { kind: 'Product', name, evidence: 'Observed', confidence: 100, detail: 'ASAR artifact supplied.' },
          { kind: 'Package', name: 'ASAR header not decoded', evidence: 'Observed', confidence: 80, detail: 'Artifact was not fabricated into a file tree. Additional header variant support is required.' },
        ],
      };
    }
    const files = flatten(header);
    const packageJson = files.find(f => f.path === 'package.json' || f.path.endsWith('/package.json'));
    const js = files.filter(f => /\.(c?m?js|jsx|ts|tsx)$/i.test(f.path));
    const native = files.filter(f => /\.(node|dll|so|dylib)$/i.test(f.path));
    const unpacked = files.filter(f => f.file.unpacked);
    return {
      adapter: 'asar',
      format: 'ASAR',
      facts: { name, files, packageJson: packageJson?.path || null, jsCount: js.length, nativeCount: native.length, unpackedCount: unpacked.length },
      nodes: [
        { kind: 'Product', name, evidence: 'Extracted', confidence: 100, detail: 'Electron ASAR header parsed from actual bytes.' },
        { kind: 'FileTree', name: files.length + ' files', evidence: 'Extracted', confidence: 99, detail: files.slice(0, 24).map(f => f.path).join(' · ') },
        { kind: 'Manifest', name: packageJson ? packageJson.path : 'package.json not indexed', evidence: 'Extracted', confidence: 96, detail: 'Electron package manifest candidate.' },
        { kind: 'Code', name: js.length + ' JS/TS files', evidence: 'Extracted', confidence: 98, detail: js.slice(0, 16).map(f => f.path).join(' · ') },
        { kind: 'Native', name: native.length + ' native modules', evidence: 'Extracted', confidence: 96, detail: native.slice(0, 12).map(f => f.path).join(' · ') },
        { kind: 'Unpacked', name: unpacked.length + ' unpacked entries', evidence: 'Extracted', confidence: 96, detail: 'Entries marked unpacked by the ASAR header.' },
      ],
    };
  },
};
