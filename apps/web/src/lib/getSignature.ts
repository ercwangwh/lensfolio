import omit from './omit';

/**
 * get signature object
const typedData = {
  domain: { name: 'example.com', __typename: 'Domain' },
  types: { EIP712Domain: ['name'], __typename: 'Types' },
  value: { name: 'John', __typename: 'User' }
};

getSignature(typedData);

{
  domain: { name: 'example.com' },
  types: { EIP712Domain: ['name'] },
  value: { name: 'John' }
}
 *
 * 
 * 
 * @param typedData - Typed data to split
 * @returns typed data parts
 */
const getSignature = (typedData: any) => {
  return {
    domain: omit(typedData.domain, '__typename'),
    types: omit(typedData.types, '__typename'),
    value: omit(typedData.value, '__typename')
  };
};

export default getSignature;
