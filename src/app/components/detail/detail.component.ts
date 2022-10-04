import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiRestService } from '../../services/api-rest.service';
import { PasswordCardResponse } from '../../models/credential-response.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  
  credential: PasswordCardResponse;
  pwdCardForm: FormGroup;
  typeInput: string = 'password';
  hasIdRedirect: any = '';
  urlRegex: any = '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})';

  constructor(private fb: FormBuilder, private activateRoute: ActivatedRoute, private router: Router, private apiRestService: ApiRestService) {
    this.credential = {} as PasswordCardResponse;
    
    this.pwdCardForm = this.fb.group({
      url: [null, [Validators.required, Validators.pattern(this.urlRegex)]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      hideRequiredControl: [false]
    });
  }

  get form() { return this.pwdCardForm.controls; }
  get hasId() { return this.hasIdRedirect != '' && this.hasIdRedirect != null }

  ngOnInit(): void {
    this.hasIdRedirect = this.activateRoute.snapshot.paramMap.get('id');

    if (this.hasId) {
      this.credential = this.apiRestService.getCredential(this.hasIdRedirect);
      this.pwdCardForm.patchValue(this.credential);
      this.pwdCardForm.updateValueAndValidity();
    }
  }

  getTypeInput(): string {
    return this.pwdCardForm.get('hideRequiredControl')?.value ? 'text' : 'password';
  }

  copyPassword(): string {
    return this.pwdCardForm.get('password')?.value;
  }

  saveDetails(credentialForm: { value: PasswordCardResponse; }): void {
    if (this.hasId) {
      this.credential.url = this.pwdCardForm.value.url;
      this.credential.name = this.pwdCardForm.value.name;
      this.credential.username = this.pwdCardForm.value.username;
      this.credential.password = this.pwdCardForm.value.password;

      this.apiRestService.editCredential(this.credential);
    } else {
      this.apiRestService.addCredentials(credentialForm.value);
    }
    
    this.router.navigate(['/']);
  }
}
