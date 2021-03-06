import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { EditPage } from '../editprofile/editprofile';

import { AboutPage } from '../about/about';
import { LatestnewsPage } from '../latestnews/latestnews';
import { HelpPage } from '../help/help';
import { DonatePage } from '../donate/donate';
import { CareerPage } from '../career/career';
import { ContactPage } from '../contact/contact';
import { TermsPage } from '../terms/terms';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy'; 

import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-myleague',
  templateUrl: 'myleague.html',
})
export class MyLeaguePage {
  modificationForm: FormGroup;
  addLeague: boolean;
  editLeagueValue: boolean;
  noLeagueData: boolean;
  leagueData: Array<any>;
  groupsData: Array<any>;
  editValue: any;
  testarray: Array<any> = [];
  successMessage: string;
  errorMessage: string;
  userEmail: string;
  userIsLogged: boolean;
  widthVar: any;
  created_by: any;
  logged_user: any;
  pages: Array<{ title: string, component: any }>;

  constructor(private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public service: RemoteServiceProvider, private alertCtrl: AlertController) {
    this.userIsLogged = false;
    if (sessionStorage.getItem("loginDone") == 'userIsLogged') {
      this.userIsLogged = true;
      this.userEmail = JSON.parse(sessionStorage.getItem("loggedUserName"));
    }

    this.pages = [
      { title: 'About' , component: AboutPage },
      { title: 'News' , component: LatestnewsPage},
      { title: 'Help' , component: HelpPage},
      { title: 'Donate' , component: DonatePage},
      { title: 'Career' , component: CareerPage},
      { title: 'Contact' , component: ContactPage},
      { title: 'Terms' , component: TermsPage},
      { title: 'Policy' , component: PrivacypolicyPage}
    ];

    this.getLeagueData();

    this.addLeague = false;
    this.editLeagueValue = false;
    this.noLeagueData = false;
    this.editValue = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.leagueData = [];
    this.groupsData = [];
    this.logged_user = JSON.parse(sessionStorage.getItem("loggedUserEmail"));


    this.modificationForm = fb.group({
      'league_name': [null, Validators.required],
      'description': [null],
      'league_location': [null],
      'round_robin_period_from': [null],
      'round_robin_period_to': [null],
      'playoff_period_from': [null],
      'playoff_period_to': [null],
      'categories': [null, Validators.required],
      'scoring_point': [null],
    });

  }

  //function to get league data from API for myleague page
  getLeagueData() {

    this.noLeagueData = false;
    this.service.getLeagueData(JSON.parse(sessionStorage.getItem('loggedUserId'))).subscribe((res: any[]) => {
      this.leagueData = res['res'];
      if (this.leagueData.length == 0)
        this.noLeagueData = true;
      else
        this.noLeagueData = false;
    },
      error => {
        this.errorMessage = JSON.stringify(error['error']['res']);
        this.errorMessage = JSON.parse(this.errorMessage);
      });

  }

  //function to get group data from API
  getGroups() {
    this.service.getGroups().subscribe((res: any[]) => {
      this.groupsData = res;
    },
      error => {
        this.errorMessage = JSON.stringify(error['error']['res']);
        this.errorMessage = JSON.parse(this.errorMessage);
      });
  }

  //function to open Add new league form
  addNewLeague() {
    this.modificationForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.addLeague = true;
    this.editLeagueValue = false;
  }

  //function to cancel adding or editing league form and go back to myleague page
  backToListing() {
    this.successMessage = '';
    this.errorMessage = '';
    this.addLeague = false;
    this.editLeagueValue = false;
  }

  //function to open Edit league form
  editLeague(editValue) {
    this.successMessage = '';
    this.errorMessage = '';
    this.editLeagueValue = true;
    this.addLeague = false;
    this.editValue = editValue;
    // let selectedGroup = []
    // if (editValue.groups) {
    //   editValue.groups.forEach(function (obj) {
    //     selectedGroup.push(obj.id);
    //   });
    // }
    // editValue.groups = selectedGroup;

    this.modificationForm.setValue({
      'league_name': editValue.league_name,
      'league_location': editValue.league_location,
      'description': editValue.description,
      'round_robin_period_from': editValue.round_robin_period_from,
      'round_robin_period_to': editValue.round_robin_period_to,
      'playoff_period_from': editValue.playoff_period_from,
      'playoff_period_to': editValue.playoff_period_to,
      'categories': editValue.categories,
      'scoring_point': editValue.scoring_point,
    })
  }

  //function to submit added and edited league to the API
  submitNewLeague(postData) {
    for(let leagueValue in postData){
      if(postData[leagueValue] == ""){
        postData[leagueValue] = null;
      }
    }
    this.testarray = [];
    this.testarray.push(postData.players);
    postData.players = this.testarray;
    postData.created_by = JSON.parse(sessionStorage.getItem("loggedUserEmail"));

    this.successMessage = '';
    this.errorMessage = '';
    if (this.addLeague) {
      this.service.addNewLeague(postData).subscribe((res: any[]) => {
        this.modificationForm.reset();
        this.successMessage = JSON.stringify(res['res']);
        this.successMessage = JSON.parse(this.successMessage);
        this.editLeagueValue = false;
        this.addLeague = false;
        this.getLeagueData();
        // if (JSON.parse(sessionStorage.getItem("is_admin")) == 'true') {
        //   this.is_admin = true;
        //   this.getLeagueData();
        // }
        // else {
        //   this.getLeaguePlayerData();
        // }
      },
        error => {
          this.errorMessage = JSON.stringify(error['error']['res']);
          this.errorMessage = JSON.parse(this.errorMessage);
        })
    }
    else {

      this.service.updateLeague(this.editValue.id, postData).subscribe((res: any[]) => {
        this.modificationForm.reset();
        this.successMessage = JSON.stringify(res['res']);
        this.successMessage = JSON.parse(this.successMessage);
        this.editLeagueValue = false;
        this.addLeague = false;
        this.getLeagueData();

      },
        error => {
          this.errorMessage = JSON.stringify(error['error']['res']);
          this.errorMessage = JSON.parse(this.errorMessage);
        })
    }
  }

  //function to delete league
  deleteLeague(id) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete this league?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.successMessage = '';
            this.errorMessage = '';
            this.service.deleteLeague(id).subscribe((res: any[]) => {
              this.successMessage = JSON.stringify(res['res']);
              this.successMessage = JSON.parse(this.successMessage);
              this.modificationForm.reset();
              this.getLeagueData()
            },
              error => {
                this.errorMessage = JSON.stringify(error['error']['res']);
                this.errorMessage = JSON.parse(this.errorMessage);
              });
          }
        }
      ]
    });
    alert.present();
  }

  //function to redirect to home page
  openHomePage() {
    this.navCtrl.push(HomePage);
  }

  //function to open edit profile page for the application
  editProfile() {
    this.navCtrl.push(EditPage);
  }

  openPages(destinationPage) {
      for(let i=0;i<this.pages.length;i++){
        if(this.pages[i].title == destinationPage){
          this.navCtrl.push(this.pages[i].component);
        }
      }
    }

  //function to logout of the application
  logout() {
    sessionStorage.setItem("loginDone", null);
    sessionStorage.setItem("loggedUserId", null);
    sessionStorage.setItem("loggedUserName", null);
    sessionStorage.setItem("loggedUserEmail", null);
    this.navCtrl.push(HomePage);
  }




  //function to get league data for player
  // getLeaguePlayerData() {
  //   this.noLeagueData = false;
  //   this.service.getLeaguePlayerData(JSON.parse(sessionStorage.getItem("loggedUserId"))).subscribe((response: any[]) => {
  //     this.leagueData = response['res'];
  //     if (this.leagueData.length == 0)
  //       this.noLeagueData = true;
  //     else
  //       this.noLeagueData = false;
  //   },
  //     error => {
  //       this.errorMessage = JSON.stringify(error['error']['res']);
  //       this.errorMessage = JSON.parse(this.errorMessage);
  //     });
  // }
}
