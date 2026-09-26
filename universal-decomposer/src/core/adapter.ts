export type EvidenceKind = 'Extracted' | 'Observed' | 'Inferred' | 'Reconstructed' | 'Generated';

export interface EvidenceNode {
  kind: string;
  name: string;
  evidence: EvidenceKind;
  confidence: number;
  detail: string;
}

export interface ArtifactInput {
  name: string;
  bytes: Uint8Array;
}

export interface AdapterResult {
  adapter: string;
  format: string;
  nodes: EvidenceNode[];
  facts: Record<string, unknown>;
}

export interface BinaryAdapter {
  id: string;
  supports(input: ArtifactInput): boolean;
  analyze(input: ArtifactInput): AdapterResult;
}

export const u16le = (b: Uint8Array, o: number) => b[o] | (b[o + 1] << 8);
export const u32le = (b: Uint8Array, o: number) =>
  (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;

export const ascii = (b: Uint8Array, start: number, length: number) => {
  let value = '';
  for (let i = start; i < Math.min(b.length, start + length); i++) value += String.fromCharCode(b[i]);
  return value.replace(/\0+$/, '');
};
