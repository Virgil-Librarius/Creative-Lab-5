window.sessionStorage;
var app = new Vue({
  el: '#app',
    data: {
    items: [],
    ready: false,
  },
   created() {
    this.getItems();
  },
    methods: {
    preview(item){
      this.ready = true;
      let storage = item.description;
      for(let r=0;r<20;r++){
      sessionStorage.setItem(r, storage[r]);
      }
      for(let i=0;i<this.items.length;i++){
        this.items[i].buyNow=false;
      }
      item.buyNow=true;
      setTimeout(1000);
      let canvas = document.getElementById("place");
      for(let u=0;u<20;u++){
        let s = item.description[u];
        for(let y=0;y<20;y++){
          let d = s.substr(y*2,1);
          let clr = 0;
            if(d=="E"){
              clr = 'red';
            }else if(d=="W"){
              clr = 'tan';
            }else if(d==="P"){
              clr = 'blue';
            }else{
              clr = 'grey';
            }
          var con = canvas.getContext("2d");
            con.fillStyle = clr;
            con.fillRect((y)*5,(u)*5,5,5);
        }
      }
      console.log(item.description);
    },
    select: function(X,Y,entity) {
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
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
});