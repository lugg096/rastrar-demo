import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ExitPageGuard } from './guards/exitPage.guard';
import { noLoginGuard } from './guards/noLogin.guard';
import { RegistroPage } from './pages/registro/registro.page';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [noLoginGuard],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
 /*    canActivate: [AuthGuard], */
    redirectTo: 'gestion',
    pathMatch: 'full'
  },
  {
    path: 'registro/:id',
    canActivate: [AuthGuard],
    canDeactivate: [ExitPageGuard],
    component:RegistroPage,
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'gestion',
/*     canActivate: [AuthGuard], */
    loadChildren: () => import('./pages/gestion/gestion.module').then( m => m.GestionPageModule)
  },
  {
    path: 'certificado',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/certificado/certificado.module').then( m => m.CertificadoPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'select-screen',
  /*   canActivate: [AuthGuard], */
    loadChildren: () => import('./pages/select-screen/select-screen.module').then( m => m.SelectScreenPageModule)
  },
  {
    path: 'sync-data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sync-data/sync-data.module').then( m => m.SyncDataPageModule)
  },
  {
    path: 'generation/:id',
    loadChildren: () => import('./pages/generation/generation.module').then( m => m.GenerationPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
