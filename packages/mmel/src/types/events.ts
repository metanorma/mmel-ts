export default interface Event {
  eventType: 'start' | 'end' | 'signalcatch' | 'timer'
}

export interface StartEvent extends Event {
  eventType: 'start'
}

export interface EndEvent extends Event {
  eventType: 'end'
}

export interface SignalCatchEvent extends Event {
  eventType: 'signalcatch'
  signal: string
}

export interface TimerEvent extends Event {
  eventType: 'timer'

  // Timer information
  type: string
  para: string
}
