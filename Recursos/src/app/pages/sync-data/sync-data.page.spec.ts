import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SyncDataPage } from './sync-data.page';

describe('SyncDataPage', () => {
  let component: SyncDataPage;
  let fixture: ComponentFixture<SyncDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SyncDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
