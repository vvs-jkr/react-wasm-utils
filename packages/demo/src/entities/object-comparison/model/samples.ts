import type { SampleObjects, SampleType } from './types'

export const SAMPLE_OBJECTS: Record<SampleType, SampleObjects> = {
  nested: {
    obj1: JSON.stringify(
      {
        metadata: {
          version: '2.1.0',
          timestamp: '2024-01-15T10:30:00Z',
          author: {
            id: 'usr_12345',
            profile: {
              name: 'Анна Петрова',
              email: 'anna.petrova@company.com',
              preferences: {
                theme: 'dark',
                language: 'ru',
                notifications: {
                  email: true,
                  push: false,
                  sms: {
                    enabled: true,
                    schedule: ['9:00', '18:00'],
                  },
                },
              },
            },
            permissions: ['read', 'write', 'admin'],
            departments: [
              { id: 'dep_001', name: 'IT', role: 'lead' },
              { id: 'dep_002', name: 'HR', role: 'member' },
            ],
          },
        },
        content: {
          projects: [
            {
              id: 'proj_1',
              name: 'React WASM Utils',
              status: 'active',
              team: {
                lead: { name: 'Иван', experience: 5 },
                members: [
                  { name: 'Мария', skills: ['React', 'TypeScript'] },
                  { name: 'Петр', skills: ['Rust', 'WASM'] },
                ],
              },
              metrics: {
                performance: { score: 95, tests: { passed: 127, failed: 3 } },
                coverage: 89.5,
              },
            },
          ],
          analytics: {
            users: { total: 15234, active: 8721, growth: 12.5 },
            revenue: { current: 125000, target: 150000, currency: 'RUB' },
          },
        },
      },
      null,
      2
    ),
    obj2: JSON.stringify(
      {
        metadata: {
          version: '2.1.1',
          timestamp: '2024-01-15T10:30:00Z',
          author: {
            id: 'usr_12345',
            profile: {
              name: 'Анна Петрова',
              email: 'anna.petrova@company.com',
              preferences: {
                theme: 'light',
                language: 'ru',
                notifications: {
                  email: true,
                  push: true,
                  sms: {
                    enabled: false,
                    schedule: ['9:00', '18:00'],
                  },
                },
              },
            },
            permissions: ['read', 'write'],
            departments: [
              { id: 'dep_001', name: 'IT', role: 'lead' },
              { id: 'dep_003', name: 'DevOps', role: 'member' },
            ],
          },
        },
        content: {
          projects: [
            {
              id: 'proj_1',
              name: 'React WASM Utils',
              status: 'active',
              team: {
                lead: { name: 'Иван', experience: 6 },
                members: [
                  { name: 'Мария', skills: ['React', 'TypeScript', 'Next.js'] },
                  { name: 'Анна', skills: ['Rust', 'WASM'] },
                ],
              },
              metrics: {
                performance: { score: 97, tests: { passed: 145, failed: 1 } },
                coverage: 92.3,
              },
            },
          ],
          analytics: {
            users: { total: 16489, active: 9234, growth: 15.2 },
            revenue: { current: 135000, target: 150000, currency: 'RUB' },
          },
        },
      },
      null,
      2
    ),
  },
}
