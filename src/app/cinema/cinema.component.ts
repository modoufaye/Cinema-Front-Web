import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

// noinspection JSArrowFunctionBracesCanBeRemoved
@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes: any;
  public cinemas: any;
  public currentVille: any;
  public currentCinema: any;
  public currentProjection: any;
  public salles: any;
  public selectedTickets: any;
  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes = data;
      },error =>{
        console.log(error);
      } )
  }
  onGetCinemas(v: any){
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas = data;
      },error =>{
        console.log(error);
      } )
  }
  onGetSalles(c: any){
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
        this.salles = data;
        this.salles._embedded.salles.forEach((salle:any)=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projections = data;
              console.log("****************SAlu Est ce que les salles vont apparaitre***********************")
            },error =>{
              console.log(error);
            } )
        })
      },error =>{
        console.log(error);
      } )
  }
  onGetTicketsPlaces(p: any){
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe((data:any)=>{
        this.currentProjection.tickets = data;
        console.log("****************SAlut Aprés***********************");
      },(error:any)=>{
        console.log(error);
      })
  }

  onSelectedTicket(t: any) {
    if(!t.selected){
      t.selected = true;
      this.selectedTickets.push(t);
    }else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
  }

  getTicketsClass(t: any) {
    let str = "btn ticket";
    if(t.reservee == true){
      str+=" btn-danger";
    }
    else if (t.selected){
      str+=" btn-warning"
    }
    else{
      str+=" btn-success";
    }
    return str;
  }

  onPayTickets(dataForm: any) {
    let tickets:any = [];
    this.selectedTickets.forEach((t:any)=>{
      tickets.push(t.id);
    })
    dataForm.tickets = tickets;
     this.cinemaService.payerTickets(dataForm)
       .subscribe((data:any)=>{
         alert("Tickets reservés avec succés");
         this.onGetTicketsPlaces(this.currentProjection)
       },(err:any)=>{
         console.log(err);
    })
  }
}
