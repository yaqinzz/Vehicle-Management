import { AuthenticatedUser } from './user.interfaces.js'

declare namespace Express {
	export interface Request {
		user?: AuthenticatedUser
	}
}
