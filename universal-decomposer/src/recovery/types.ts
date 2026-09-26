export type RecoveryLevel = 'L0_IDENTIFIED' | 'L1_DECOMPOSED' | 'L2_RECOVERED' | 'L3_REBUILDABLE' | 'L4_EDITABLE';
export interface ToolProbe { name:string; available:boolean; version?:string; path?:string; }
export interface RecoveryStep { id:string; status:'pending'|'running'|'passed'|'failed'|'skipped'; evidence:string[]; output?:string; }
export interface RecoveryReport { input:string; platform:'android'|'macos'; level:RecoveryLevel; tools:ToolProbe[]; steps:RecoveryStep[]; workspace:string; editableProject?:string; buildArtifact?:string; warnings:string[]; }
