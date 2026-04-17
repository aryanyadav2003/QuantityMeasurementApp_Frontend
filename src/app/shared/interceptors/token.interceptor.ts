import { HttpInterceptorFn } from '@angular/common/http';

// This interceptor automatically adds the JWT token to every HttpClient request.
// It is used by Angular's HttpClient (not by axios).
// QuantityService uses axios directly with its own header logic.
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');

  if (token) {
    // Clone the request and add the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // No token — send request as-is
  return next(req);
};