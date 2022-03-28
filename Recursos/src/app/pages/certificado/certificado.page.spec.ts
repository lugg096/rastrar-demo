import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CertificadoPage } from './certificado.page';

describe('CertificadoPage', () => {
  let component: CertificadoPage;
  let fixture: ComponentFixture<CertificadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
