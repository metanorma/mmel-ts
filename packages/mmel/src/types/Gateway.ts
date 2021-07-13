export default interface Gateway {
  id: string;
  gatewayType: 'exclusive_gateway';
}

export interface ExclusiveGateway extends Gateway {
  id: string;
  gatewayType: 'exclusive_gateway';
  label: string;
}
