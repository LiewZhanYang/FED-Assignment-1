import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BooksComponent } from './pages/books/books.component';
import { StationeryComponent } from './pages/stationery/stationery.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books', component: BooksComponent }, // Books 书籍页面
  { path: 'stationery', component: StationeryComponent }, // Stationery 文具页面
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
