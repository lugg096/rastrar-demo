import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectScreenPage } from './select-screen.page';

describe('SelectScreenPage', () => {
  let component: SelectScreenPage;
  let fixture: ComponentFixture<SelectScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
