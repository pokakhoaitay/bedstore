/// <reference path="../../../typings/tsd.d.ts" />
//noinspection TypeScriptCheckImport
import {Observable} from 'angular2/angular2/'
import 'rxjs/operator/map';
import 'rxjs/operator/mergeMap';
import 'rxjs/observable/interval'

//noinspection TypeScriptCheckImport
import{Component, View,bootstrap,CORE_DIRECTIVES} from 'angular2/angular2'
//noinspection TypeScriptCheckImport
import{HTTP_PROVIDERS} from 'angular2/http'

//noinspection TypeScriptCheckImport
import{ROUTER_DIRECTIVES,RouteConfig} from 'angular2/router'        //ROUTER_DIRECTIVES need for router-link, <router-outlet>
import {AboutCmp} from '../about/about'
import {HomeCmp} from '../home/home'
import {APP_ROOT_PATH} from '../../utils/settings'

@Component({
    selector: 'app',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: APP_ROOT_PATH + '/components/app/app.html',
})


@RouteConfig([
    {path: '/', component: HomeCmp, name: 'Home'},
    {path: '/about', component: AboutCmp, name: 'About'},
    {path: '/home', component: HomeCmp, name: 'Home'}
])

export class AppCmp {

}

