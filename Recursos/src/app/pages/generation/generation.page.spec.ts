import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenerationPage } from './generation.page';

describe('GenerationPage', () => {
  let component: GenerationPage;
  let fixture: ComponentFixture<GenerationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
