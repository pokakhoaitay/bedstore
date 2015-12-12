/// <reference path="../../../typings/tsd.d.ts" />
import {HTTP_PROVIDERS} from 'angular2/http';
import{bootstrap, provide} from 'angular2/angular2'
import {AppCmp} from "./app";
import{ROUTER_PROVIDERS, APP_BASE_HREF,LocationStrategy,HashLocationStrategy,PathLocationStrategy,Route,Router,RouterLink} from 'angular2/router'

//Đăng ký các thư viện dùng global
//noinspection TypeScriptValidateTypes
bootstrap(AppCmp, [
    ROUTER_PROVIDERS, //NOTE: Rememner !! It's need for router
    provide(APP_BASE_HREF, { useValue: '/' } ),
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    //NOTE: Use PathLocationStrategy when F5 cause page error, this is a bug will be fix in beta, releae. Checkout here: https://github.com/mgechev/angular2-seed/issues/264
    HTTP_PROVIDERS
]);
//.then(success=>console.log(success), error=>console.log(error));