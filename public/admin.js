/*global require*/
//const log = ("./scriptLog.js");
/*global $*/

$(document).ready(() => {
reset();
let canvasElem = document.querySelector("canvas");
canvasElem.addEventListener("mousedown", function(e){
    cord(canvasElem, e);
});

document.getElementById("submit").addEventListener("click", function(){
  let canvas = document.getElementById("place");
  let d = document.getElementById("color").value;
  var con = canvas.getContext("2d");
  let clr = 0;
            if(d==0){
              clr = 'red';
            }else if(d==1){
              clr = 'tan';
            }else{
              clr = 'grey';
            }
            con.fillStyle = clr;
            con.fillRect(0,0,1000,1000);
            for(let i=0;i<20;i++){
              for(let j=0;j<20;j++){
                if(i===2&&j===2){
                  
                }else{
              app.select2(i,j,d);
                }
            }
            }
            console.log(app.grid);
            reset();
  console.log("fill");
});
function cord(canvas, event) {
      console.log("cord");
      //canvas = document.getElementById("place");
      
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            let d = document.getElementById("color").value;
            console.log(d);
            let clr = 0;
            if(d==0){
              clr = 'red';
            }else if(d==1){
              clr = 'tan';
            }else{
              clr = 'grey';
            }
            
            /*
          io().emit("color", {
      col: parseInt($("#x").val()),
      row: parseInt($("#y").val()),
      color: clr,
    });*/
            X = ((x-10)/50);
            Y = ((y-10)/50);
            X = X - X%1;
            Y = Y - Y%1;
            var con = canvas.getContext("2d");
            con.fillStyle = clr;
            con.fillRect((X)*50,(Y)*50,50,50);
            if(Y===2&&X===2){
              reset();
            }else{
              app.select(X,Y,d);
            }
            console.log("Coordinate x: " + X, "Coordinate y: " + Y);
            return;
}
});
const reset = function(){
  var canvas = document.getElementById("place");
  var con = canvas.getContext("2d");
  con.fillStyle = 'blue';
  con.fillRect((2)*50,(2)*50,50,50);
  app.select(2,2,3);
};
const MF = function(level){
  return level.maker===app.user;
};
/*global axios*/
/*global Vue*/
var X=0;
var Y=0;
var entity=0;

var app = new Vue({
  el: '#admin',
  data: {
    user: "",
    items: [],
    name: "",
    addMaker: "",
    addItem: null,
    addPrice: "",
    X: '',
    Y: '',
    grid: [20],
    findTitle: "",
    findGrid: "",
    findItem: null,
  },
  created() {
    this.user = sessionStorage.getItem("user");
    //this.user = LOG.user;
    this.getItems();
    this.X=1;
    this.Y=1;
    for(let i=0; i<20;i++){
      if(i===2){
        this.grid[i]="     P                                  ";
      }else{
        this.grid[i]="                                        ";
      }
    }
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
  methods: {
    select2: function(X,Y,entity) {
      if(X<0||X>19||Y<0||Y>19){
        return;
      }
      this.X=X;
      this.Y=Y;
      var change = this.grid[Y];
      var Z = X;
      Z=Z*2;
      var replace = change.substr(0,Z);
      let clr = 0;
            if(entity==0){
              clr = " E";
            }else if(entity==1){
              clr = " W";
            }else if(entity==2){
              clr = "  ";
            }else{
              clr = " P";
            }
      replace = replace.concat(clr);
      replace = replace.concat(change.substr(Z+2,40-Z-2));
      this.grid[Y] = replace;
    },
    select: function(X,Y,entity) {
      console.log("select");
      if(X<0||X>19||Y<0||Y>19){
        return;
      }
      this.X=X;
      this.Y=Y;
      var change = this.grid[Y];
      var Z = X;
      Z=Z*2;
      var replace = change.substr(0,Z);
      let clr = 0;
            if(entity==0){
              clr = " E";
            }else if(entity==1){
              clr = " W";
            }else if(entity==2){
              clr = "  ";
            }else{
              clr = " P";
            }
      replace = replace.concat(clr);
      replace = replace.concat(change.substr(Z+2,40-Z-2));
      this.grid[Y] = replace;
      //for(let i=0;i<20;i++){
      console.log(this.grid);
      //}
    },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async getItems() {
      console.log("CU:" + this.user);
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        this.items = this.items.filter(MF);
        return true;
      } catch (error) {
        console.log("no get");
        console.log(error);
      }
    },
    async upload() {
      for(let i=0; i<20;i++){
        this.grid[i]=this.grid[i].substr(1,39);
    }
      try {
        const formData = new FormData();
        let r2 = await axios.post('api/items', {
          name: this.name,
          maker: this.user,
          difficulty: this.addPrice,
          buys: 0,
          buyNow: false,
          description: this.grid,
        });
        this.addItem = r2.data;
        console.log("upload");
      } catch (error) {
        console.log("no upload");
        console.log(error);
      }
    },
    selectItem(item) {
      console.log("select");
      this.findTitle = "";
      this.findItem = item;
      this.findGrid = item.description;
    },
    async deleteItem(item) {
      console.log("delete");
      try {
        let response = axios.delete("/api/items/"+ item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log("no delete");
        console.log(error);
      }
    },
  },
  
});
