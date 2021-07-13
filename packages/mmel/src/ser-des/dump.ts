import Standard from '../types/Standard';
import { DUMPER_CONFIG } from './config';
import { dumpMetadata } from './config/metadata';
import { dumpRole } from './config/role';

export default function dump(model: Standard): string {
  let out = '';

  if (model.root !== null) {
    out += 'root ' + model.root.id + '\n\n';
  }

  out += dumpMetadata(model.meta) + '\n';

  for (const [field, dumper] of Object.entries(DUMPER_CONFIG)) {
    out += dumper(model[field]) + '\n';
  }

  for (const r of model.roles) {
    out += dumpRole(r) + '\n';
  }
  for (const p of model.processes) {
    out += dumpProcess(p) + '\n';
  }
  for (const r of model.provisions) {
    out += dumpProvision(r) + '\n';
  }
  for (const a of model.approvals) {
    out += dumpApproval(a) + '\n';
  }
  for (const e of model.events) {
    out += dumpEvent(e) + '\n';
  }
  for (const g of model.gateways) {
    out += dumpGateway(g) + '\n';
  }
  for (const e of model.enums) {
    out += dumpEnum(e) + '\n';
  }
  for (const c of model.dataclasses) {
    out += dumpDataClass(c) + '\n';
  }
  for (const d of model.regs) {
    out += dumpRegistry(d) + '\n';
  }
  for (const p of model.pages) {
    out += dumpSubprocess(p) + '\n';
  }
  for (const v of model.vars) {
    out += dumpVariable(v) + '\n';
  }
  for (const r of model.refs) {
    out += dumpReference(r) + '\n';
  }
  return out;
}
