import { sleep } from '../index';

export async function login(params) {
  await sleep(300);
  return {
    user: {
      is_admin: true,
      expired_at: Date.now() + 1000 * 60 * 60 * 24, // Plus one day
    },
    organization: {
      id: null,
      name: null,
    }
  }
}

export async function logout(sessionExpired) {
  await sleep(300);
}