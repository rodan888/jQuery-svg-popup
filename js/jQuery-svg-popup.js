;(function($){
	$.fn.svgpopup = function(options){
		var defaults = {
				stepX:  12,
				stepY:  12,

				fill: '#03BDD6',
				fillOdd: null,
				fillEven: null,
				strokeFill: null,

				opacity: 0.8,
				speed: 1.8,
				figure: 'triangle',
				visible: false,
				randomize: true,
				closeButtonText: '&#10006;',

				width:  $(window).width(),
				height: $(window).height(),

				onAnimationComplate: function(){}
			};
			return this.each(function() {
				config = $.extend({},defaults,options),
				that   = $(this),
				popup = {
					svg: null,
					poligon: null,
					content: null,
					sizeX: config.width/config.stepX,
					sizeY: config.height/config.stepY,
					getRandomInt: function(min, max){				
						return Math.floor(Math.random() * (max - min + 1)) + min;
					},
					createPolygon: function(x,y){
						var res = null;
						if(config.figure === 'triangle'){
							res = {
								first: x*popup.sizeX+','+y*popup.sizeY+' '+(x+1)*popup.sizeX+','+y*popup.sizeY+' '+x*popup.sizeX+','+(y+1)*popup.sizeY,
								second: x*popup.sizeX+','+(y+1)*popup.sizeY+' '+(x+1)*popup.sizeX+','+y*popup.sizeY+' '+(x+1)*popup.sizeX+','+(y+1)*popup.sizeY
							};
						}else if(config.figure === 'rectangle'){
							res = x*popup.sizeX+','+y*popup.sizeY+' '+(x+1)*popup.sizeX+','+y*popup.sizeY+' '+(x+1)*popup.sizeX+','+(y+1)*popup.sizeY+' '+x*popup.sizeX+','+(y+1)*popup.sizeY;
						}
						return res;
					},
					createMarkup: function(){
						var posX = config.width/config.stepX,
							  posY = config.height/config.stepY,					
								html = '<svg class="svg-popup-particles-wrap">';  
						for(var i = 0; i < config.stepX; i++){
							for(var p = 0; p < config.stepY; p++){						
								var coords     = popup.createPolygon(i,p),
										figFill    = {
											odd: config.fillOdd === null ? config.fill : config.fillOdd,
											even: config.fillEven === null ? config.fill : config.fillEven
										},
										strokeFill = config.strokeFill === null ? config.fill : config.strokeFill,
										posXfirst  = popup.getRandomInt(0,config.width),
										posYfirst  = popup.getRandomInt(0,config.height),
										posXsecond = popup.getRandomInt(0,config.width),
										posYsecond = popup.getRandomInt(0,config.height),
										rotX       = config.randomize === true ? popup.getRandomInt(0,360) : 0,
										rotY       = config.randomize === true ? popup.getRandomInt(0,360) : 0,								
										styles1    = 'opacity: '+config.opacity+';position:absolute;transform:translate('+ posXfirst +'px,'+ posYfirst +'px) rotateX('+rotX+'deg) rotateY('+rotY+'deg);',
										styles2    = 'opacity: '+config.opacity+';position:absolute;transform:translate('+ posXsecond +'px,'+ posYsecond +'px) rotateX('+rotX+'deg) rotateY('+rotY+'deg);';

										if(config.figure === 'triangle'){
											html+= '<polygon data-posx="'+ posXfirst +'" data-rotationy="'+ rotY +'" data-rotationx="'+ rotX +'" data-posy="'+ posYfirst +'" style="'+styles1+'" fill="'+figFill.odd+'" stroke="'+strokeFill+'" points="'+ coords.first +'"></polygon>';
											html+= '<polygon data-posx="'+ posXsecond +'" data-rotationy="'+ rotY +'" data-rotationx="'+ rotX +'" " data-posy="'+ posYsecond +'" style="'+styles2+'" fill="'+figFill.even+'" stroke="'+strokeFill+'" points="'+ coords.second +'"></polygon>';
										}else if(config.figure === 'rectangle'){
											var fill = (p+i) % 2 === 0 ? figFill.odd : figFill.even,
													strokeFill = config.strokeFill === null ? fill : config.strokeFill;									
											html+= '<polygon data-posx="'+ posXfirst +'" data-rotationy="'+ rotY +'" data-rotationx="'+ rotX +'" data-posy="'+ posYfirst +'" style="'+styles1+'" fill="'+fill+'" stroke="'+strokeFill+'" points="'+ coords +'"></polygon>';
										};
							};
						};
						html += '</svg>';
						return html;
					},
					destroyPolygon:	function(close){			
						for(var i = 0; i < this.polygon.length; i++){
							var el   = $(this.polygon[i]),
									left = el.attr('data-posx'),
									top  = el.attr('data-posy'),
									rotY = el.attr('data-rotationy'),
									rotX = el.attr('data-rotationx');
							el.css({
								'transform':'translate('+ left +'px,'+ top +'px) rotateX('+rotX+'deg) rotateY('+rotY+'deg)',
								'opacity': config.visible === false ? 0 : config.opacity
							});
						};
						close.detach();
						this.content.css({
							'top': '110%'
						});
						setTimeout(function(){
							popup.svg.css({
								'z-index': '-1'
							});					
						},config.speed*1000);
					},
					animPolygon: function(){
						this.svg.css({
							'opacity': config.opacity,
							'z-index': '10000'
						});
						this.polygon.css({
							'transform': ' translate(0,0) rotateX(0deg) rotateY(0deg)',
							'transition': 'all '+config.speed+'s',
							'opacity': '1'
						});
						setTimeout(function(){
							popup.content.css({
								'top': '50%'
							}).append('<span class="svg-popup-close">'+ config.closeButtonText +'</span>');
							$('.svg-popup-close').on('click', function(){
								popup.destroyPolygon($(this));
							});
							config.onAnimationComplate(that);
						},config.speed*1000);
					},
					init: function(){					
						this.content = $('#'+that.data('svg-popup'))
							.append(popup.createMarkup())
							.find('.svg-popup-content').css({
								'position': 'fixed',								
								'left': '50%',
								'top': '110%',
								'z-index': '10001',
								'transform': 'translate(-50%,-50%)',
								'transition': 'top 0.3s'
						});

						this.svg     = $('#'+that.data('svg-popup')).find('svg.svg-popup-particles-wrap');
						this.polygon = this.svg.find('polygon');
						this.svg.css({
							'width': config.width+'px',
							'height': config.height+'px',
							'opacity': config.visible === false ? 0 : 1,
							'position': 'fixed',
							'top': '0px',
							'left': '0px',
							'overflow': 'hidden',					
							'z-index': '-1'
						});
						that.on('click', function(){				
							popup.animPolygon();
						});
					}
				};
			popup.init();
		});			
	};
})(jQuery);