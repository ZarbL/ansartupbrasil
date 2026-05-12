import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 12;

export const hashService = {
  async hash(plaintext: string): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(plaintext, salt);
    return { hash, salt };
  },

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  },

  generateToken(bytes = 32): string {
    return randomBytes(bytes).toString('hex');
  },
};
