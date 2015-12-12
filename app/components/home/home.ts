/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../node_modules/angular2/angular2.d.ts" />
/// <reference path="../../../node_modules/angular2/http.d.ts" />
/// <reference path="../../../node_modules/rxjs/Observer.d.ts" />
///<reference path="../../../node_modules/angular2/src/http/http.d.ts"/>
//noinspection TypeScriptCheckImport
import {Component,CORE_DIRECTIVES} from 'angular2/angular2';
import {APP_ROOT_PATH} from '../../utils/settings'
//noinspection TypeScriptCheckImport
import {Http, Response, Headers} from 'angular2/http';

@Component({
    templateUrl: APP_ROOT_PATH + '/components/home/home.html',
    directives: [CORE_DIRECTIVES],
})

export class HomeCmp {

    result:Object;
    error:Object;
    http:Http;
    contract:any;
    customer:any;
    postResponse = new Person();

    constructor(http:Http) {

        this.http = http;
        this.loadFriendsSuccessFully();
        //this.loadFriendsWithError();
        //this.loadContractByCustomer();
    }

    loadFriendsSuccessFully() {
        this.result = {friends: []};
        this.http.get('/api/welcome').map((res:Response) => res.json()).subscribe(res => {
            //this.result = res;
            console.log(res);
        });


    }

    loadContractByCustomer() {
        this.contract = {};
        this.customer = {};
        this.http.get('./customer.json').map((res:Response) => {
                this.customer = res.json();
                return this.customer;
            })
            .flatMap((customer) => this.http.get(customer.contractUrl)).map((res:Response) => res.json())
            .subscribe(res => this.contract = res);
    }

    loadFriendsWithError() {
        this.result = {friends: []};
        this.http.get('./dist/dev/friends2.json').map((res:Response) => res.json()).subscribe(
            res => this.result = res,
            error => this.error = error);

    }

    postData() {

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('http://www.syntaxsuccess.com/poc-post/', JSON.stringify({
                firstName: 'Joe',
                lastName: 'Smith'
            }), {headers: headers})
            .map((res:Response) => res.json())
            .subscribe((res:Person) => this.postResponse = res);
    }
}

export class Person {
    firstName:string;
    lastName:string;
}


