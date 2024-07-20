import jwt from 'jsonwebtoken';
import { type SafeUser } from '~/types/user';

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export function signJwt(payload: SafeUser): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyJwt(token: string): SafeUser | null {
	try {
		return jwt.verify(token, JWT_SECRET) as SafeUser;
	} catch (error) {
		return null;
	}
}