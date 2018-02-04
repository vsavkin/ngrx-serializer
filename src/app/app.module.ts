import { BrowserModule } from '@angular/platform-browser';
import {Component, NgModule} from '@angular/core';


import { AppComponent } from './app.component';
import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from '@angular/router';
import {Store, StoreModule} from '@ngrx/store';
import {StoreRouterConnectingModule, routerReducer, RouterStateSerializer} from '@ngrx/router-store';
import {storeFreeze} from 'ngrx-store-freeze';

@Component({
  selector: 'app-aa',
  template: 'aa <a routerLink="/bb">bb</a>'
})
export class ComponentA {}

@Component({
  selector: 'app-bb',
  template: 'bb <a routerLink="/aa">aa</a>'
})
export class ComponentB {}

export class CustomSerializer implements RouterStateSerializer<any> {
  serialize(routerState: RouterStateSnapshot): any {
    return {root: this.serializeRoute(routerState.root), url: routerState.url};
  }

  private serializeRoute(route: ActivatedRouteSnapshot) {
    const children = route.children.map(c => this.serializeRoute(c));
    return {params: route.params, data: route.data, url: route.url, outlet: route.outlet, routeConfig: route.routeConfig, children};
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ComponentA,
    ComponentB
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'aa'},
      { path: 'aa', component: ComponentA },
      { path: 'bb', component: ComponentB }
    ]),
    StoreRouterConnectingModule,
    StoreModule.forRoot({router: routerReducer}, {metaReducers: [storeFreeze]})
  ],
  providers: [
    {provide: RouterStateSerializer, useClass: CustomSerializer}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(s: Store<any>) {
    s.subscribe(state => console.log(JSON.stringify(state)));
  }
}
