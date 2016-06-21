var BuffType = {
	Benefit: 0,
	Harmful: 1
};
var BuffFactory = {
	buffs: [
		{
			type: BuffType.Benefit,
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
			type: BuffType.Benefit,
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
			type: BuffType.Benefit,
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
			type: BuffType.Harmful,
			name: "叠刃",
			duration: 0,
			duration_max: 24,
			tick_duration: 0,
			tick_duration_max: 3,
			level: 0,
			level_max: 5,
			skillCoef: 0.1163
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

/*
 * Determine hit type of a buff tick
 */
function CalcBuffHitType(buff, avatar, target) {
    // Caculate the table
    var blockChance = Math.max(target.attributes.requiredPrecisionChance - buff.attributes.precisionChance, 0);
    var criticalHitChance = Math.min(buff.attributes.criticalHitChance, 1 - blockChance);
    var hitChance = 1 - blockChance - criticalHitChance;
    // Roll once
    var roll = Math.random();
    if (roll < blockChance) {
        return HitType.Block;
    }
    if (roll < blockChance + criticalHitChance) {
        return HitType.Critical;
    }
    return HitType.Hit;
}

/*
 * Calc damage of a buff tick
 */
function CalcBuffTickDamage(buff, avatar, target, hitType) {
    // Basic damage
    var damage = buff.skillCoef * buff.attributes.attackPower;
    // Defense break
    damage = damage * (1 + buff.attributes.defenseBreakLevel / DEFENSE_BREAK_COEF / 100);
    // Crit damage
    if (hitType == HitType.Critical) {
        damage = damage * buff.attributes.criticalHitDamage;
    }
    // Block damage
    if (hitType == HitType.Block) {
        damage = damage / 4;
    }
    // Global benefit
    damage = damage * 1;
    // Target's defense
    damage = damage * (1 - target.attributes.defenseRate);
    // Response
    return damage;
}