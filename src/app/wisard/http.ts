import { HttpClient } from '@angular/common/http';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class Http {
    //
    private static itsHttp: HttpClient = null;
    /**
     *
     */
    private constructor() {}
    /**
     *
     */
    static setHttp(theHttp: HttpClient){
        Http.itsHttp = theHttp;
    }
    /**
     *
     */
    static getHttp(): HttpClient {
        return Http.itsHttp;
    }
    //
}

