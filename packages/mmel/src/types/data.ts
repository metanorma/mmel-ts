import Reference from './Reference';


export interface Registry {
  title: string
  data: DataClass | null  
}


export interface DataClass {
  attributes: DataAttribute[]
}


export interface DataAttribute {
  id: string
  type: string
  modality: string
  cardinality: string
  definition: string
  ref: Reference[]
  satisfy: Array<string>
}


export interface Enum {
  id: string
  values: EnumValue
}


interface EnumValue {
  id: string
  value: string
}

export interface Variable {
  id: string
  type: string
  definition: string
  description: string
}
