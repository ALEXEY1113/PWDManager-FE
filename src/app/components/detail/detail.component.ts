import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiRestService } from '../../services/api-rest.service';
import { CredentialResponse } from '../../models/credential-response.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  
  credential: CredentialResponse;
  credentialForm: FormGroup;
  typeInput: string = 'password';
  hasIdRedirect: any = '';

  constructor(private fb: FormBuilder, private activateRoute: ActivatedRoute, private router: Router, private apiRestService: ApiRestService) {
    
    this.credential = {} as CredentialResponse;
    
    this.credentialForm = this.fb.group({
      url: [null, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      hideRequiredControl: [false]
    });
  }

  get hasId() { return this.hasIdRedirect != '' && this.hasIdRedirect != null }

  ngOnInit(): void {
    this.hasIdRedirect = this.activateRoute.snapshot.paramMap.get('id');

    if (this.hasId) {
      this.credential = this.apiRestService.getCredential(this.hasIdRedirect);
      this.credentialForm.patchValue(this.credential);
      this.credentialForm.updateValueAndValidity();
    }
  }

  getTypeInput(): string {
    return this.credentialForm.get('hideRequiredControl')?.value ? 'text' : 'password';
  }

  copyPassword(): string {
    return this.credentialForm.get('password')?.value;
  }

  saveDetails(credentialForm: { value: CredentialResponse; }): void {
    
    if (this.hasId) {
      this.credential.url = this.credentialForm.value.url;
      this.credential.name = this.credentialForm.value.name;
      this.credential.username = this.credentialForm.value.username;
      this.credential.password = this.credentialForm.value.password;

      this.apiRestService.editCredential(this.credential);
    } else {
      this.apiRestService.addCredentials(this.credentialForm.value);
    }
    
    this.router.navigate(['/']);
  }

}
