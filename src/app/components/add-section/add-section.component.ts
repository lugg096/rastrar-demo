import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss'],
})
export class AddSectionComponent implements OnInit {

  sectionForm: FormGroup;
  data: any;
  isEdit = false;

  constructor(
    private _fun: Funciones,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {
    this.sectionForm = formBuilder.group({
      code: this._fun.makeCode(),
      name: ['', Validators.required],
      section: true
    });
  }

  ngOnInit() {
    if (!this._fun.isVarInvalid(this.data)) this.editData();
  }

  editData() {
    this.sectionForm.patchValue(this.data);
  }


  async validateForm() {
    this.tiggerFields();
    if (this.sectionForm.valid) this.confirm();
  }

  tiggerFields() {
    Object.keys(this.sectionForm.controls).forEach(field => {
      let _control = this.sectionForm.get(field);
      if (_control instanceof FormControl)
        _control.markAsTouched({ onlySelf: true });
    });
  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: this.sectionForm.value });
  }
}
