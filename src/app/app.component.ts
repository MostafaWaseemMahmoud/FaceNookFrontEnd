import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { enableDebugTools } from '@angular/platform-browser';
import { RouterOutlet, RouterModule, Routes } from '@angular/router';
import { windowTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, ReactiveFormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // corrected this line
})
export class AppComponent implements OnInit {
  @ViewChild('inputFile') inputFile!: ElementRef; // Add this line to access the file input

  title = 'new-application';
  islogin: boolean = false;
  posts: any[] = ['Mostafa'];
  userProfileForm: any;
  postForm: any;
  localVar = window.localStorage.getItem('logedin');
  UserData: any;
  loader: any;
  baseApi = 'http://localhost:3000';
  imageUrL: any;
  profileImageUrl: any;
  profileEmail: any;
  profileName: any;
  AllPosts: any;
  ngOnInit(): void {
    this.showAllPosts();
    if (window.localStorage.getItem('logedin')) {
      this.islogin = true; // corrected this line
      console.log(this.islogin);
      this.profileImageUrl = window.localStorage.getItem('image');
      this.profileEmail = window.localStorage.getItem('email');
      this.profileName = window.localStorage.getItem('name');
      if (this.profileImageUrl) {
        window.prompt('We Have Error');
      }
    } else {
      this.islogin = false; // corrected this line
      console.log(this.islogin);
    }
    this.userProfileForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.postForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private el: ElementRef
  ) {}

  @ViewChild('hello', { static: false }) divHello: ElementRef | undefined;

  addPost(data: any) {
    return this.http.post(`${this.baseApi}/api/post`, data);
  }

  postData(data: any) {
    return this.http.post(`${this.baseApi}/api/adduser`, data);
  }

  sharePost() {
    const data = {
      post: this.postForm.value.content,
      image: this.profileImageUrl,
      name: this.profileEmail,
    };

    this.addPost(data).subscribe(
      (response) => {
        console.log(response);
      },
      (reject) => {
        console.log(reject);
      }
    );
  }

  getAllPosts() {
    return this.http.get(`${this.baseApi}/api/Allposts`);
  }

  showAllPosts() {
    this.getAllPosts().subscribe(
      (response) => {
        console.log(response);
        this.AllPosts = response;
      },

      (reject) => {
        console.log(reject);
      }
    );
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
        window.location.reload();
        this.loader = false;
      }, 3000);
    } else {
      window.prompt('Your Data Is Invalid Sorry');
      this.loader = false;
    }
  }
}
