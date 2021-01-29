import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../constants/global.constant';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private _url: string;

  constructor(private readonly _httpClient: HttpClient) {
    this._url = GLOBAL.API + 'upload';
  }

  uploadImage(formData: FormData): Observable<any> {
    return this._httpClient.post<any>(this._url + '/image', formData);
  }

  getImage(imagename: string): Observable<Blob> {
    return this._httpClient.get(this._url + '/image?filename=' + imagename, {
      responseType: 'blob',
    });
  }
}
