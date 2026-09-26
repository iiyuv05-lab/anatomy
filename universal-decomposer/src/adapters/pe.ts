import { AdapterResult, ArtifactInput, BinaryAdapter, ascii, u16le, u32le } from '../core/adapter';

const MACHINES: Record<number, string> = {
  0x014c: 'x86',
  0x8664: 'x86-64',
  0x01c0: 'ARM',
  0xaa64: 'ARM64',
};

export const peAdapter: BinaryAdapter = {
  id: 'pe',
  supports({ bytes }) {
    if (bytes.length < 0x40 || bytes[0] !== 0x4d || bytes[1] !== 0x5a) return false;
    const pe = u32le(bytes, 0x3c);
    return pe + 4 < bytes.length && ascii(bytes, pe, 4) === 'PE\0\0';
  },
  analyze({ name, bytes }): AdapterResult {
    const pe = u32le(bytes, 0x3c);
    const machine = u16le(bytes, pe + 4);
    const sectionCount = u16le(bytes, pe + 6);
    const optionalSize = u16le(bytes, pe + 20);
    const optional = pe + 24;
    const magic = u16le(bytes, optional);
    const pe32Plus = magic === 0x20b;
    const directoryBase = optional + (pe32Plus ? 112 : 96);
    const cliRva = directoryBase + 14 * 8 + 7 < bytes.length ? u32le(bytes, directoryBase + 14 * 8) : 0;
    const sectionBase = optional + optionalSize;
    const sections = [];
    for (let i = 0; i < sectionCount && i < 96; i++) {
      const o = sectionBase + i * 40;
      if (o + 40 > bytes.length) break;
      sections.push({
        name: ascii(bytes, o, 8),
        virtualSize: u32le(bytes, o + 8),
        virtualAddress: u32le(bytes, o + 12),
        rawSize: u32le(bytes, o + 16),
        rawOffset: u32le(bytes, o + 20),
        characteristics: u32le(bytes, o + 36),
      });
    }
    const architecture = MACHINES[machine] || 'machine-0x' + machine.toString(16);
    const dotnet = cliRva !== 0;
    return {
      adapter: 'pe',
      format: 'PE',
      facts: { name, architecture, machine, sectionCount, pe32Plus, dotnet, cliRva, sections },
      nodes: [
        { kind: 'Product', name, evidence: 'Extracted', confidence: 100, detail: 'PE signature verified from actual binary bytes.' },
        { kind: 'Platform', name: 'Windows ' + architecture, evidence: 'Extracted', confidence: 99, detail: 'COFF Machine field: 0x' + machine.toString(16) },
        { kind: 'Executable', name: pe32Plus ? 'PE32+' : 'PE32', evidence: 'Extracted', confidence: 99, detail: 'Optional header magic parsed.' },
        { kind: 'Sections', name: sections.length + ' sections', evidence: 'Extracted', confidence: 99, detail: sections.map(s => s.name).join(' · ') },
        { kind: 'Runtime', name: dotnet ? '.NET CLR metadata present' : 'Native/unknown runtime', evidence: 'Extracted', confidence: dotnet ? 98 : 82, detail: dotnet ? 'CLI data directory RVA is non-zero.' : 'No CLI header directory advertised by the PE optional header.' },
      ],
    };
  },
};
