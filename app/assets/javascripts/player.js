window.onload = function() {
    location.href="spotify://";
    init();

    var PI_2        = Math.PI * 2;
    var canvasW     = 400;
    var canvasH     = 400;
    var numMovers   = 200;
    var friction    = .96;
    var movers      = [];
    var counter     = 0;
    var repeat      = 3000 / document.getElementById("bpm").value;
    var canvas;
    var ctx;

    function init(){
        canvas = document.getElementById("effect_canvas");
        if ( canvas.getContext ){
        setup();
        setInterval( draw , 20 );
        }
    }
    
    function setup(){
        ctx       = canvas.getContext("2d");
        
        var i = numMovers;
        while ( i-- ){
            var m = new Mover();
            m.x   = canvasW * 0.5;
            m.y   = canvasH * 0.5;
            m.vX  = Math.cos(i) * Math.random() * 34;
            m.vY  = Math.sin(i) * Math.random() * 34;
            movers[i] = m;
        }
    }
    
    function draw(){
        counter++;
        if (counter >= repeat)
        {
            var i = numMovers;
            while ( i-- ){
                var m = new Mover();
                m.x   = canvasW * 0.5;
                m.y   = canvasH * 0.5;
                m.vX  = Math.cos(i) * Math.random() * 34;
                m.vY  = Math.sin(i) * Math.random() * 34;
                movers[i] = m;
            }
            counter -= repeat;
        }
        //ctx.globalCompositeOperation = "source-over";
        //ctx.fillStyle = "rgba(8,8,12,.65)";
        ctx.fillStyle = "rgba(256,256,256,256)";
        ctx.fillRect( 0 , 0 , canvasW , canvasH );
        //ctx.globalCompositeOperation = "lighter";
        
        var Mrnd = Math.random;
        var Mabs = Math.abs;
        
        var i = numMovers;
        while ( i-- ){
            var m  = movers[i];
            var x  = m.x;
            var y  = m.y;
            var vX = m.vX;
            var vY = m.vY;
            
            var dX = x;
            var dY = y; 
            var d  = Math.sqrt( dX * dX + dY * dY );
            if( d == 0 ) d = 0.001;
            dX /= d;
            dY /= d;
            
            vX *= friction;
            vY *= friction;
            
            var avgVX = Mabs( vX );
            var avgVY = Mabs( vY );
            var avgV  = ( avgVX + avgVY ) * 0.5;
            
            if( avgVX < .1 ) vX *= Mrnd() * 3;
            if( avgVY < .1 ) vY *= Mrnd() * 3;
            
            var sc = avgV * 0.45;
            sc = Math.max( Math.min( sc , 3.5 ) , 0.4 );
            
            var nextX = x + vX;
            var nextY = y + vY;
            
            m.vX = vX;
            m.vY = vY;
            m.x  = nextX;
            m.y  = nextY;
            
            ctx.fillStyle = m.color;
            ctx.beginPath();
            ctx.arc( nextX , nextY , sc , 0 , PI_2 , true );
            ctx.closePath();
            ctx.fill();     
        }
    }
    
    function Mover(){
        this.color = "rgb(" + Math.floor( Math.random()*255 ) + "," + Math.floor( Math.random()*255 ) + "," + Math.floor( Math.random()*255 ) + ")";
        this.y     = 0;
        this.x     = 0;
        this.vX    = 0;
        this.vY    = 0;
        this.size  = 1; 
    }
    
    function rect( context , x , y , w , h ){
        context.beginPath();
        context.rect( x , y , w , h );
        context.closePath();
        context.fill();
    }
};
