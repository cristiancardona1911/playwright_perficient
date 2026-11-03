import { randomUUID } from 'node:crypto';

export interface TestUser {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export function createTestUser(): TestUser {
  const identifier = randomUUID();

  return {
    name: `Playwright User ${identifier.slice(0, 8)}`,
    email: `playwright-${identifier}@example.com`,
    password: `Test-${identifier.slice(0, 12)}!`,
    firstName: 'Playwright',
    lastName: 'Tester',
    address: '123 Test Automation Street',
    country: 'United States',
    state: 'Missouri',
    city: 'St Louis',
    zipcode: '63141',
    mobileNumber: '5551234567',
  };
}
