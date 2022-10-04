import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { PasswordCardResponse } from '../models/credential-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  private dbPwdListsSubject: BehaviorSubject<PasswordCardResponse[]>;
  public dbPwdList$: Observable<PasswordCardResponse[]>;

  constructor(private http: HttpClient) {
    this.dbPwdListsSubject = new BehaviorSubject<PasswordCardResponse[]>([]);
    this.dbPwdList$ = this.dbPwdListsSubject.asObservable();
  }

  get Headers(): HttpHeaders {
    return new HttpHeaders().set('Type-Content', 'application/json');
  }

  get dbPasswords(): PasswordCardResponse[] { return this.dbPwdListsSubject.value; }
  set dbPasswords(creds: PasswordCardResponse[]) { this.dbPwdListsSubject.next(creds); }

  getAllCredentials(): Observable<any> {
    let getCredentialsUrl = environment.urlBase;

    return this.http.get<any>(getCredentialsUrl, { headers: this.Headers });
  }

  getCredential(id: number): PasswordCardResponse {
    let credential = {};
    
    this.dbPasswords.forEach(item => {
      if (item.id == id) {
        credential = item;
      }
    });

    return credential as PasswordCardResponse;
  }

  addCredentials(credential: PasswordCardResponse): void {
    let addCredentialUrl = environment.urlBase;

    this.http.post<any>(addCredentialUrl, credential, { headers: this.Headers }).subscribe(
      credentials => {
        if (credentials && credentials.data) {
          this.dbPwdListsSubject.next(credentials.data);
        }
      }
    );
  }

  editCredential(credential: PasswordCardResponse): void {
    let editCredentialUrl = environment.urlBase + '/' + credential.id;

    this.http.put<any>(editCredentialUrl, credential, { headers: this.Headers }).subscribe(
      credentials => {
        if (credentials && credentials.data) {
          this.dbPwdListsSubject.next(credentials.data);
        }
      }
    );
  }

  deleteCredential(credentialId: number): void {
    let deleteCredentialUrl = environment.urlBase + '/' + credentialId;
    
    this.http.delete<any>(deleteCredentialUrl, { headers: this.Headers }).subscribe(
      deleted => {
        if (deleted && deleted.data) {
          this.dbPwdListsSubject.next(deleted.data);
        }
      }
    );
  }
}
