var BuffFactory = {
	buffs: [
		{
			name: "碎星辰",
			duration: 0,
			duration_max: 36,
			level: 0,
			level_max: 1,
			effects: {
				criticalHitChance: 0.1,
				criticalHitDamage: 0.2
			}
		},
		{
			name: "玄门",
			duration: 0,
			duration_max: 40,
			level: 0,
			level_max: 3,
			effects: {
				criticalHitChance: 0.05,
				defenseBreakMultiply: 0.1
			}
		},
		{
			name: "期声",
			duration: 0,
			duration_max: 37,
			level: 0,
			level_max: 1,
			effects: {
				basicAttckPowerMultiply: 0.1
			}
		},
		{
			name: "叠刃",
			duration: 0,
			duration_max: 24,
			level: 0,
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