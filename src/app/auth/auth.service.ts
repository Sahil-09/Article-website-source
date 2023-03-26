import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { promise } from "selenium-webdriver";
import { User } from "./user.model";

@Injectable({
    providedIn:'root'
})

export class AuthService{
    time
    token =new BehaviorSubject(null);
    name = new BehaviorSubject(null);
    islogin=false;
    constructor(private http:HttpClient,private router:Router){}

    Signup(data:User){
        this.http.post("http://localhost:4005/api/user/signup",data).subscribe(()=>{
            console.log("submitted!")
        })
    }

    Login(data:User){
        this.http.post<{token:string,name:string}>("http://localhost:4005/api/user/login",data).subscribe(data=>{

            if(data.token){
                this.token.next(data.token);
                this.islogin=true;
                this.name.next(data.name);
                localStorage.setItem("User",JSON.stringify({name:data.name.split(' ')[0],token:data.token}))
                this.AutoLogout()
                this.router.navigate(['/'])
            }
            else{
                console.log(data)
            }
        })
    }
    isauthenticate(){
        const promise=new Promise((resolve,reject)=>{
            resolve(this.islogin)
        })
        return promise;
    }
    Logout(){
        this.token.next(null)
        this.name.next(null)
        this.router.navigate(['/Auth'])
        localStorage.removeItem("User")
        if(this.time){
            clearTimeout(this.time)
        }
    }


    AutoLogin(data){
        this.islogin=true;
        this.token.next(data.token);
        this.name.next(data.name)
    }

    AutoLogout(){
        this.time=setTimeout(()=>{
            this.Logout()
        },3600000)
    }
}
