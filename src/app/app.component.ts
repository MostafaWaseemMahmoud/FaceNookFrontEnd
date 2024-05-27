import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // corrected this line
})
export class AppComponent implements OnInit {
  @ViewChild('inputFile') inputFile!: ElementRef; // Add this line to access the file input

  title = 'new-application';
  islogin: boolean = false;
  posts: any[] = ['Mostafa'];
  userProfileForm: any;
  localVar = window.localStorage.getItem('logedin');
  UserData: any;
  loader: any;
  baseApi = 'http://localhost:3000';
  imageUrL: any;

  ngOnInit(): void {
    if (window.localStorage.getItem('logedin')) {
      this.islogin = true; // corrected this line
      console.log(this.islogin);
    } else {
      this.islogin = false; // corrected this line
      console.log(this.islogin);
    }
    this.userProfileForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private el: ElementRef
  ) {}

  @ViewChild('hello', { static: false }) divHello: ElementRef | undefined;
  postData(data: any) {
    return this.http.post(`${this.baseApi}/api/adduser`, data);
  }

  onSubmit(): void {
    if (this.userProfileForm.valid) {
      console.log(this.userProfileForm.value);

      // Use ViewChild to access the file input element

      this.imageUrL = this.divHello?.nativeElement.files[0];

      const data = {
        name: this.userProfileForm.value.name,
        email: this.userProfileForm.value.email,
        password: this.userProfileForm.value.password,
        image: URL.createObjectURL(this.imageUrL),
      };

      console.log(data);

      this.postData(data).subscribe(
        (response) => {
          console.log(response);
          this.UserData = response;
        },
        (error) => {
          console.log(error);
          return;
        }
      );
      window.localStorage.setItem('loading', 'true');
      this.loader = window.localStorage.getItem('loading');
      setTimeout(() => {
        window.localStorage.setItem('name', this.UserData.name);
        window.localStorage.setItem('email', this.UserData.email);
        window.localStorage.setItem('image', this.UserData.image);
        this.loader = window.localStorage.removeItem('loading');
        console.log(this.userProfileForm.value);
        window.localStorage.setItem('logedin', 'true');
        this.loader = false;
      }, 3000);
    } else {
      window.prompt('Your Data Is Invalid Sorry');
      this.loader = false;
    }
  }
}
