import { DataAttribute, DataClass, Enum, EnumValue, Registry, ResolvableDataClass, ResolvableRegistry, ResolveableDataAttribute, Variable } from '../../types/data';
import { resolveFromContext } from '../resolve';
import { removePackage, tokenizeAttributes, tokenizePackage } from '../tokenize';
import { Dumper, Parser, Resolver } from '../types';

export const parseEnum: Parser = (id: string, data: string) => {
  const result: Enum = {
    id: id,
    values: [],
  };
  if (data != "") {
    const t:Array<string> = tokenizePackage(data);
    let i:number  = 0;
    while (i < t.length) {
      const vid:string = t[i++];
      if (i < t.length) {
        let vcontent:string = t[i++];
        result.values.push(parseEnumValue(vid, vcontent));
      } else {
        throw new Error(
          `Parsing error: enum. ID ${id}: Empty definition for value ${vid}`
        );
      }
    }
  }

  return ctx => ({ ...ctx, enums: { ...ctx.enums, [id]: result } });
};

const parseEnumValue = (id:string, data:string) => {
  let ev:EnumValue = {
    id:id,
    value: ""  
  };
  if (data != "") {
    let t:Array<string> = tokenizePackage(data);
    let i:number  = 0;
    while (i < t.length) {
      let command:string = t[i++];
      if (i < t.length) {
        if (command == "definition") {
          ev.value = removePackage(t[i++]);
        } else {
          throw new Error(
            `Parsing error: enum value. ID ${id}: Unknown keyword ${command}`
          );
        }
      } else {
        throw new Error(
          `Parsing error: enum value. ID ${id}: Expecting value for ${command}`
        );
      }
    }
  }
  return ev;
};

export const parseRegistry: Parser = function (id, data) {
  const result: ResolvableRegistry = {
    id: id,    
    title: "",
    data: null,
    _relations: {
      data: "",
    },
  };

  if (data != "") {
    const t:Array<string> = tokenizePackage(data);
    let i:number  = 0;
    while (i < t.length) {
      let command:string = t[i++];
      if (i < t.length) {
        if (command == "title") {
          result.title = removePackage(t[i++]);
        } else if (command == "data_class") {
          result._relations.data = t[i++];
        } else {
          throw new Error(
            `Parsing error: registry. ID ${id}: Unknown keyword ${command}`
          );
        }
      } else {
        throw new Error(
          `Parsing error: registry. ID ${id}: Expecting value for ${command}`
        );
      }
    }
  }
  return ctx => ({ ...ctx, registers: { ...ctx.registers, [id]: result } }); 
};

export const parseDataClass: Parser = function (id, data) {
  const result: ResolvableDataClass = {
    id: id,
    attributes: [],
    _relations: {
      attributes: [],
    },
  };

  if (data != "") {
    const t:Array<string> = tokenizeAttributes(data);
    let i:number  = 0;
    while (i < t.length) {
      const basic:string = t[i++];
      if (i < t.length) {
        const details:string = t[i++];
        result._relations.attributes.push(parseDataAttribute(basic.trim(), details))
      } else {
        throw new Error(
          `Parsing error: class. ID ${id}: Expecting { after ${basic}`
        )
      }
    }
  }  
  return ctx => ({ ...ctx, dataClasses: { ...ctx.dataClasses, [id]: result } }); 
};

export const parseDataAttribute: Parser = function (basic, details) {
  const result: ResolveableDataAttribute = {
    id: "",
    type: "",
    modality: "",
    cardinality: "",
    definition: "",
    ref: [],    
    satisfy: [],      
    _relations: {
      ref: [],      
    },
  };
  let index = basic.indexOf('[');
  if (index != -1) {
    result.cardinality = basic.substr(index+1, basic.length - index - 2).trim();
    basic = basic.substr(0, index);
  }
  index = basic.indexOf(':');
  if (index != -1) {
    result.type = basic.substr(index+1, basic.length - index - 1).trim();
    basic = basic.substr(0, index);
  }
  result.id = basic.trim();
  if (details != "") {
    const t:Array<string> = tokenizePackage(details);
    let i:number  = 0
    while (i < t.length) {
      const keyword:string = t[i++]
      if (i < t.length) {
        if (keyword == "modality") {
          result.modality = t[i++]
        } else if (keyword == "definition") {
          result.definition = removePackage(t[i++])
        } else if (keyword == "reference") {
          result._relations.ref = tokenizePackage(t[i++])
        } else if (keyword == "satisfy") {
          result.satisfy = tokenizePackage(t[i++])
        } else {
          throw new Error(
            `Parsing error: approval. ID ${result.id}: Unknown keyword ${keyword}`
          );
        }
      } else {
        throw new Error(
          `Parsing error: process. ID ${result.id}: Expecting value for ${keyword}`
        );
      }
    }
  }
  return ctx => ({ ...ctx, dataClasses: { ...ctx.dataClasses, [result.id]: result } }); 
};

export const resolveDataClass: Resolver<DataClass, ResolvableDataClass> = function (
  ctx,
  unresolved
) {
  const p = { ...unresolved };  
  for (let attribute of unresolved._relations.attributes) {
    p.attributes.push(resolveFromContext(ctx, 'registers', attribute));
  }  
  return p;
};

export const resolveRegistry: Resolver<Registry, ResolvableRegistry> = function (
  ctx,
  unresolved
) {
  const p = { ...unresolved };
  if (unresolved._relations.data != "") {
    p.data = resolveFromContext(ctx, 'dataClasses', unresolved._relations.data);
  }  
  return p;
};

export const resolveDataAttribute: Resolver<DataAttribute, ResolveableDataAttribute> = function (
  ctx,
  unresolved
) {
  const p = { ...unresolved };
  for (const id of unresolved._relations.ref) {
    p.ref.push(resolveFromContext(ctx, 'references', id));
  }  
  return p;
};

export const dumpDataClass: Dumper<DataClass> = function (dataclass) {
  let out:string = "class " + dataclass.id + " {\n";
  for (let a of dataclass.attributes) {
    out += toDataAttributeModel(a);
  }
  out += "}\n";
  return out;
};

const toDataAttributeModel = (attribute:DataAttribute) => {
  let out:string = "  " + attribute.id;
  if (attribute.type != "") {
    out += ": " + attribute.type;
  }
  if (attribute.cardinality != "") {
    out += "[" + attribute.cardinality + "]";
  }
  out += " {\n";
  out += "    definition \"" + attribute.definition + "\"\n";
  if (attribute.modality != "") {
    out += "    modality " + attribute.modality + "\n";
  }
  if (attribute.satisfy.length > 0) {
    out += "    satisfy {\n";
    for (let s of attribute.satisfy) {
      out += "      " + s + "\n";
    }
    out += "    }\n";
  }
  if (attribute.ref.length > 0) {
    out += "    reference {\n";
    for (let r of attribute.ref) {
      out += "      " + r.id + "\n";
    }
    out += "    }\n";
  }
  out += "  }\n";
  return out;
};

const dumpEnumValue = (ev:EnumValue) => {
  let out:string = "  " + ev.id + " {\n";
  out += "    definition \"" + ev.value + "\"\n";
  out += "  }\n";
  return out;
};

export const dumpEnum: Dumper<Enum> = function (en) {
  let out:string = "enum " + en.id + " {\n";
  for (let v of en.values) {
    out += dumpEnumValue(v);
  }		
  out += "}\n";
  return out;
};

export const dumpRegistry: Dumper<Registry> = function (reg) {
  let out:string = "data_registry " + reg.id + " {\n";
  out += "  title \""+ reg.title+"\"\n";
  if (reg.data != null) {
    out += "  data_class "+ reg.data.id +"\n";
  }
  out += "}\n";
  return out;  
};

export const dumpVariable: Dumper<Variable> = function (v) {	
  let out:string = "measurement " + v.id + " {\n";
  if (v.type != "") {
    out += "  type " + v.type + "\n";
  }
  if (v.definition != "") {
    out += "  definition \"" + v.definition + "\"\n";
  }
  if (v.description != "") {
    out += "  description \"" + v.description + "\"\n";
  }
  out += "}\n";
  return out;
};