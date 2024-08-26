import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../services/user.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'; // Import necessary validators and form-related modules
import { HelperService } from '../../services/utils/helper.service';
import { ObjectId } from 'mongodb';
import { ToastMessageService } from '../../services/utils/toast-message.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm1!: FormGroup;
  signupForm2!: FormGroup;
  arrUserEmails: string[] = [];
  arrUserUsername: string[] = [];
  password: string | undefined;
  selected_interests: string[] = [];

  //intereset form options
  technologyInterests = [
    'Artificial Intelligence',
    'Blockchain',
    'Cybersecurity',
    'Data Science',
    'Machine Learning',
    'Programming',
    'Software Development',
  ];
  sportsInterests = [
    'Basketball',
    'Football',
    'Golf',
    'Soccer',
    'Tennis',
    'Running',
    'Swimming',
  ];
  musicInterests = [
    'Rock',
    'Pop',
    'Hip Hop',
    'EDM',
    'Classical',
    'Jazz',
    'R&B',
  ];
  travelInterests = [
    'Adventure Travel',
    'Beach Holidays',
    'Cultural Tourism',
    'Nature Exploration',
    'Road Trips',
    'Solo Travel',
    'Family Vacations',
  ];
  foodInterests = [
    'Italian Cuisine',
    'Japanese Cuisine',
    'Mexican Cuisine',
    'Vegetarian & Vegan',
    'Healthy Eating',
    'Baking',
    'Street Food',
  ];
  scienceInterests = [
    'Astronomy',
    'Biology',
    'Chemistry',
    'Environmental Science',
    'Physics',
    'Psychology',
    'Space Exploration',
  ];
  trendingInterests = [
    'Climate Change',
    'Cryptocurrency',
    'Streaming Services',
    'Remote Work',
    'Wellness',
    'Sustainable Living',
    'Online Learning',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private helperService: HelperService,
    private toastMessageService: ToastMessageService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.helperService
      .getFieldFromCollection<User, 'email', string>('users', 'email')
      .subscribe((emails) => {
        this.arrUserEmails = emails;
      });
    this.helperService
      .getFieldFromCollection<User, 'username', string>('users', 'username')
      .subscribe((usernames) => {
        this.arrUserUsername = usernames;
      });

    this.createForm();
  }

  createForm() {
    this.signupForm1 = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email],
        this.checkIfEmailExists.bind(this),
      ],
    });

    this.signupForm2 = this.formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.minLength(4), this.noSpaceValidator()],
        this.checkIfUsernameExists.bind(this),
      ],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  checkIfEmailExists(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const email = control.value;
        if (this.arrUserEmails.includes(email)) {
          resolve({ emailExists: true });
        } else {
          resolve(null);
        }
      }, 500);
    });
  }

  checkIfUsernameExists(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const username = control.value;
        if (this.arrUserUsername.includes(username)) {
          resolve({ usernameExists: true });
        } else {
          resolve(null);
        }
      }, 500);
    });
  }

  noSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasSpace = control.value ? control.value.includes(' ') : false;
      return hasSpace ? { noSpace: true } : null;
    };
  }
  toggleInterest(interest: string) {
    const index = this.selected_interests.indexOf(interest);

    if (index === -1) {
      this.selected_interests.push(interest);
    } else {
      this.selected_interests.splice(index, 1);
    }
    this.checkSubmitButton();
    // console.log(this.selected_interests);
  }

  checkSubmitButton() {
    return this.selected_interests.length >= 3 && this.signupForm2.valid;
  }

  get email() {
    return this.signupForm1.get('email');
  }

  get username() {
    return this.signupForm2.get('username');
  }

  getErrorMessage() {
    if (this.email?.hasError('required')) {
      return 'You must enter a value';
    } else if (this.email?.hasError('email')) {
      return 'Not a valid email';
    } else if (this.email?.hasError('emailExists')) {
      return 'This email is already registered';
    } else if (this.username?.hasError('usernameExists')) {
      return 'This username is already registered';
    }
    return '';
  }
  signupFinal(): void {
    const tempUser: User = {
      username: this.signupForm2.value.username,
      email: this.signupForm1.value.email,
      password: { iv: '', encrypted_data: this.signupForm2.value.password },
      selected_interests: this.selected_interests,
      community_ids: [],
      display_name: this.signupForm2.value.username,
      profile_picture_src: 'assets/avatar.png',
      cake_day: new Date().toJSON().slice(0, 10).toString(),
      about_description: '',
      joined_communities: [],
      created_post_ids: [],
      saved_post_ids: [],
    };

    this.userService.addUser(tempUser).subscribe(
      (response: any) => {
        this.toastMessageService.showSuccess(
          'Signed up successfully. You may now log in.'
        );
      },
      (error: any) => {
        console.error('Error adding user', error);
      }
    );
  }
}
