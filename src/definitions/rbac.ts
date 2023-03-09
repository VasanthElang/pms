export const grantList = [
  {
    role: 'user', resource: 'book', action: 'create:own', attributes: '*, !rating, !views'
  },
  {
    role: 'user', resource: 'book', action: 'read:own', attributes: '*'
  },
  {
    role: 'user', resource: 'book', action: 'update:own', attributes: '*, !rating, !views'
  },
  {
    role: 'user', resource: 'book', action: 'delete:own', attributes: '*'
  }
];
