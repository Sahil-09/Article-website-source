import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, tap } from "rxjs/operators";

@Injectable({
    providedIn:'root'
})

export class PostService{
    articles
    constructor(private http:HttpClient,private router:Router){}

    createpost(data){
        this.http.post('http://localhost:4005/api/article/create',data).subscribe((data)=>{
            this.router.navigate(["/explore"])
        })
    }

    updatepost(data,id){
        this.http.patch("http://localhost:4005/api/article/update/"+id,data).subscribe((data)=>{
            console.log(data)
            this.router.navigate(["/explore"])
        })
    }

    getposts(){
        return this.http.get("http://localhost:4005/api/article/get").pipe(tap(data=>{
            this.articles=data;
            console.log(this.articles)
        }))
    }


    getpost(i){
        return this.http.get("http://localhost:4005/api/article/get/"+i)
    }

    getmanagepost(){
        return this.http.get("http://localhost:4005/api/article/manage")
    }

    deletepost(id){
        return this.http.delete("http://localhost:4005/api/article/delete/"+id)
    }
}
