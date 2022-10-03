import { Component, OnInit } from '@angular/core';
import { Observable, pipe, map } from 'rxjs';
import { Router } from '@angular/router';

import { ApiRestService } from '../../services/api-rest.service';
import { CredentialResponse } from 'src/app/models/credential-response.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.css']
})
export class CredentialComponent implements OnInit {

  public value: string = '';
  public credentials: CredentialResponse[] = [];
  public credentialsFiltered: CredentialResponse[] = [];
  public searchForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiRestService, private router: Router) {
    this.getListCredentials();

    this.searchForm = this.fb.group({
      searchText: ''
    });
  }

  ngOnInit(): void {
    this.api.dbPwdList$.subscribe(passwords => {
      if (passwords) {
        this.credentials = passwords;
      }
    });
  }

  private getListCredentials(): void {
    this.api.getAllCredentials().subscribe(dbCredentials => {
      if (dbCredentials != null && dbCredentials.data) {
        this.api.dbPasswords = dbCredentials.data;
      }
    });
  }

  onDisplayCredential(credential: CredentialResponse): void {
    this.router.navigate(['detail', credential.id])
  }

  onEditCredential(credential: CredentialResponse): void {
    this.router.navigate(['/detail/'+ credential.id]);
  }

  onDeleteCredential(credentialId: number): void {
    if (confirm('Are you sure to delete this credential ?')) {
      this.api.deleteCredential(credentialId);
    }
  }

  onSearchPassword(): void {
    let pwdText = (this.searchForm.value.searchText as string).toLowerCase().trim();

    if(this.searchForm.value && pwdText !== '') {
      this.api.dbPwdList$.subscribe(pwdList => {
        this.credentials = pwdList.filter(it => {
          return it.name.toLowerCase().includes(pwdText);
        })
      });
    } else {
      this.api.dbPwdList$.subscribe(passwords => {
        if (passwords) {
          this.credentials = passwords;
        }
      });
    }
  }
}
