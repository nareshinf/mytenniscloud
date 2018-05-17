import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import { SessionService } from './services/session.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    //private token = '';
    //session;
    // constructor (private sessionService: SessionService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // this.session = this.sessionService.getSession();
        // if (this.session !== null) {
        //   this.token = this.session.token;
        // }
        const authReq = req.clone({
            //headers: req.headers.set('Access-Control-Allow-Credentials' , 'true')
        });
        return next.handle(authReq);
    }
}
