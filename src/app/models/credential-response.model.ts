export class PasswordCardResponse {
    id: number;
    url: string;
    name: string;
    username: string;
    password: string

    constructor (id: number, url: string, name: string, username: string, password: string) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.username = username;
        this.password = password;
    }
}