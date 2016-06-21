var BuffFactory = {
	buffs: [
		{
			name: "碎星辰",
			duration: 0,
			duration_max: 4800,
			level: 0,
			level_max: 1,
			effects: {
				criticalHitChance: 0.1,
				criticalHitDamage: 0.2
			}
		}
	],
	getBuffByName: function(buffname) {
	    for (var key in this.buffs) {
	        var buff = this.buffs[key];
	        if (buff.name == buffname) {
	            return buff;
	        }
	    }
	    return null;
	},
}