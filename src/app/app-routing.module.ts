import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AndroidPrivacyPolicyComponent } from './androidprivacypolicy/androidprivacypolicy.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { HurricaneTracksComponent } from './hurricanetracks/hurricanetracks.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'hurricanetracks', component: HurricaneTracksComponent},
  {path: 'androidprivacypolicy', component: AndroidPrivacyPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
