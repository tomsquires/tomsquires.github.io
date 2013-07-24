		
$(function() {
	
	var activeSong, bpm;
		
	SC.initialize({
		client_id: "af032ce963c757ca0407ef20b88503bb",
		usePeakData: false,     
        useWaveformData: false,
	});

	var playSong = function(songid) {	
	
		stopSongs();
			
		$.get('http://api.soundcloud.com/tracks/' + songid + '.json?client_id=af032ce963c757ca0407ef20b88503bb', function(data) {
			var bpm = data.bpm;
			var factor = (bpm * bpm) /5000;
			_demo.setAnimate(true, factor);
		});
			
		/*SC.stream("/tracks/" + songid, function(sound){		
			
			activeSong = sound;			
			activeSong.play();
		});*/
		SC.stream("/tracks/" + songid,{
		  usePeakData: true,     
		  useWaveformData: true,
		  autoPlay: false,	  	
		  whileplaying : function() {
				console.log('Peaks, L/R: '+this.peakData.left+'/'+this.peakData.right);
				var amp = (this.peakData.left+ this.peakData.right) / 2;
				_demo.setBeatAmplitude(amp);
			}		
		}, function(sound){
			activeSong = sound;			
			activeSong.play();
		});
	}
	
		
	var stopSongs = function(){
	    _demo.setAnimate(false);
		if(activeSong){
			activeSong.stop();
			activeSong = undefined;
		}
	}
	
	$("#startSong1").click(function () {playSong(293)});
	$("#startSong2").click(function () {playSong(14044361)});
	$("#stop").click(function () {stopSongs()});
	
	$("#btnsearch").click(function () {
		var search = $('#search').val();
		SC.get('/tracks', {q: search,  bpm: { from: 1 } }, function(tracks) {
		  $("#searchResults").empty();
		  
		jQuery.each(tracks, function(index, item) {
			var el = $("#searchResults")
			.append('<li class=\'listitems\' id=\'' + item.id +'\' >' + item.title+ '</li>');
		});
		
		$('.listitems').on('click',function(el){playSong(el.target.id)});
		  
		  console.log(tracks);
		});
	});


	var getDemoContext = function () {
    var demoCtx,
        canvaName = "c01";

    if (window.JuliaWrkDrawer) {
        // 2D Canvas with WebWorker Context
        demoCtx = new JuliaWrkDrawer(canvaName);
    } else if (window.JuliaDrawer) {
        // 2D Canvas Context
        demoCtx = new JuliaDrawer(canvaName);
    } else if (window.JuliaGLDrawer) {
        // 3D WebGL Context
        demoCtx = new JuliaGLDrawer(canvaName);
    } else {
        throw "Missing includes to initialize demo.";
    }
    return demoCtx;
	}
	
	    var _demo        = getDemoContext(),
        _btAnimation = document.getElementById('btAnimation');


    var _constAValue = document.getElementById('constAValue'),
        _constBValue = document.getElementById('constBValue'),
        _constA      = document.getElementById('constA'),
        _constB      = document.getElementById('constB'),
        _chrono      = document.getElementById('chrono'),
        _chronoPass  = 0,
        _deltaTime   = 0,
        _drawTicks   = 0;
    
    _demo.subscribe(function(a, b) {
        _constAValue.innerHTML = a;
        _constBValue.innerHTML = b;
        _constA.value = a * 1000;
        _constB.value = b * 1000;
    });

    _demo.subscribe(function() {
        if (_chronoPass++ > 10) {
            var d     = new Date(),
                milli = d.valueOf();

            _deltaTime        = (milli - _drawTicks) / _chronoPass;
            _chrono.innerHTML = Math.round(1000 / _deltaTime, 2) + " fps";
            _drawTicks        = milli;
            _chronoPass       = 0;
        }
    });

    _constA.onchange = _constB.onchange = function () {
        _demo.setConstant(_constA.value / 1000, _constB.value / 1000);
    };
    _demo.start();
});		
		
		
