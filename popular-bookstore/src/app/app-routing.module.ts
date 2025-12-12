import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books', component: HomeComponent }, // Will be replaced with BooksComponent
  { path: 'stationery', component: HomeComponent }, // Will be replaced with StationeryComponent
  { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule) },
  { path: 'account', component: HomeComponent }, // Will be replaced with AccountComponent
  { path: 'contact', component: HomeComponent }, // Will be replaced with ContactComponent
  { path: 'careers', component: HomeComponent }, // Will be replaced with CareersComponent
  { path: 'promotions', component: HomeComponent }, // Will be replaced with PromotionsComponent
  { path: 'privacy', component: HomeComponent }, // Will be replaced with PrivacyComponent
  { path: 'locations', component: HomeComponent }, // Will be replaced with LocationsComponent
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
