import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CredentialResponse } from '../models/credential-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  private dbPwdListsSubject: BehaviorSubject<CredentialResponse[]>;
  public dbPwdList$: Observable<CredentialResponse[]>;

  constructor(private http: HttpClient) {
    this.dbPwdListsSubject = new BehaviorSubject<CredentialResponse[]>([]);
    this.dbPwdList$ = this.dbPwdListsSubject.asObservable();
  }

  get Headers(): HttpHeaders {
    return new HttpHeaders().set('Type-Content', 'application/json');
  }

  get dbPasswords(): CredentialResponse[] { return this.dbPwdListsSubject.value; }
  set dbPasswords(creds: CredentialResponse[]) { this.dbPwdListsSubject.next(creds); }

  getAllCredentials(): Observable<any> {
    let getCredentialsUrl = environment.urlBase;

    return this.http.get<any>(getCredentialsUrl, { headers: this.Headers });
  }

  getCredential(id: number): CredentialResponse {
    let credential = {};
    
    this.dbPasswords.forEach(item => {
      if (item.id == id) {
        credential = item;
      }
    });

    return credential as CredentialResponse;
  }

  addCredentials(credential: CredentialResponse): void {
    let addCredentialUrl = environment.urlBase;

    this.http.post<any>(addCredentialUrl, credential, { headers: this.Headers }).subscribe(
      credentials => {
        if (credentials && credentials.data) {
          this.dbPwdListsSubject.next(credentials.data);
        }
      }
    );
  }

  editCredential(credential: CredentialResponse): void {
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

  /*private credentialsMock(): CredentialResponse[] {
    return [
      {
        id: 1,
        url: "www.nike.com",
        name: "Nike",
        username: "nikeUser",
        password: "P4s$w0rd1!"
      },
      {
        id: 2,
        url: "www.adidas.com",
        name: "Adi",
        username: "adidasUser",
        password: "P4s$w0rd2!"
      },
      {
        id: 3,
        url: "www.puma.com",
        name: "Puma",
        username: "pumaUser",
        password: "P4s$w0rd3!"
      },
      {
        id: 4,
        url: "www.reebok.com",
        name: "R-Bok",
        username: "reebokUser",
        password: "P4s$w0rd4!"
      },
      {
        id: 5,
        url: "www.joma.com",
        name: "Joma",
        username: "jomaUser",
        password: "P4s$w0rd5!"
      },
      {
        id: 6,
        url: "www.asics.com",
        name: "Siks",
        username: "asicsUser",
        password: "P4s$w0rd6!"
      },
      {
        id: 7,
        url: "www.underarmnor.com",
        name: "U-Armor",
        username: "underArmorUser",
        password: "P4s$w0rd7!"
      }
    ];
  }*/
}
