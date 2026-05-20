import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

// Make sure firebase-admin is initialized if it's not already
if (!admin.apps.length) {
  // Try to initialize. The default credential should work if the environment provides it
  // or the user sets FIREBASE_SERVICE_ACCOUNT. Assuming initializeApp() will be called in server.ts
  // or it will just use default credentials. Let's just wait for server.ts to initialize it.
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        firebaseProvider?: string;
        [key: string]: any;
      };
    }
  }
}

export async function authenticateSovereignIdentity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized Access',
      code: 'AUTH_HEADER_MISSING_OR_MALFORMED',
      message: 'A valid Bearer token must be supplied in the Authorization header.'
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken, true);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      firebaseProvider: decodedToken.firebase?.sign_in_provider,
      ...decodedToken
    };

    return next();
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Authentication Expired',
        code: 'SESSION_EXPIRED',
        message: 'The sovereign session token has expired. Client-side re-authentication or token refresh required.'
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(403).json({
        error: 'Access Denied',
        code: 'TOKEN_REVOKED',
        message: 'The session has been revoked. Re-verify identity credentials immediately.'
      });
    }

    return res.status(401).json({
      error: 'Invalid Credentials',
      code: 'CRYPTO_VALIDATION_FAILED',
      message: 'Token verification failed. The signature could not be verified.'
    });
  }
}
