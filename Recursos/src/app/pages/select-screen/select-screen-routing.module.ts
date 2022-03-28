import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectScreenPage } from './select-screen.page';

const routes: Routes = [
  {
    path: '',
    component: SelectScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectScreenPageRoutingModule {}
