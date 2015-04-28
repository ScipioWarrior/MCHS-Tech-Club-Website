function Spinner(regions) {
	this.probs = {}; 
	this.spins = 0;
	this.regions = regions;
	for(var i = 0; i < regions; i++){ 
		this.probs[i] = 0; 
	} 
	this.spin = function(times){
		var c;
		while(times > 0){ 
			c = Math.floor(Math.random() * this.regions);
			this.probs[c]++;
			times--;
			this.spins++;
		}
	},
	this.report = function(){
		for(var color in this.probs){
			console.log(color + " | " + " Theoretical Probabilty: " + (1 / this.regions) * 100 + " | " + " Empirical Probability: " + (this.probs[color] / this.spins) * 100);
		}
	}
}
