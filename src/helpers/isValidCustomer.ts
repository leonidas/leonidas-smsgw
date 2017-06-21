// TODO move to schema
const customerRegex = /^[a-z0-9-]+(\.[a-z0-9-]+)*$/;

export default function isValidCustomer(customer: string) {
  return customerRegex.test(customer);
}
