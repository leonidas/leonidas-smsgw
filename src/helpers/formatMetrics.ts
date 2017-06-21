/**
 * Splits customer ID into Prometheus labels, eg. 'leonidas.platform' -> 'customer0="leonidas", customer1="platform"'
 * @param customer Dotted-path customer ID
 */
export function makeCustomerLabels(customer: string): string {
  return customer.split('.')
    .map((customerPart, index) => `customer${index}="${customerPart}"`)
    .join(', ');
}


export default function formatMetrics(results: { [customer: string]: string }) {
  const lines = [
    '# HELP smsgw_messages Sent SMS messages by customer',
    '# TYPE smsgw_messages counter',
  ];

  Object.keys(results).forEach((customer) => {
    const value = results[customer];
    const customerLabels = makeCustomerLabels(customer);

    lines.push(`smsgw_messages{${customerLabels}} ${value}`);
  });

  return lines.join('\n') + '\n';
};
