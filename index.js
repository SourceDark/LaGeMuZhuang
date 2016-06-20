var XinfaFactory = {
	Taixujianyi : 0,
	Zixiagong : 1,
	Shanjujianyi : 2,
	Wenshuijue : 2,
	isXinfaValid : function(xinfa) {
		if (xinfa == this.Taixujianyi) return true;
		if (xinfa == this.Zixiagong) return true;
		return false;
	}
};
var AvatarAttributesFactory = {
	createAvatarAttributes : function(paras) {
		return paras;
	}
}
var AvatarFactory = {
	createAvatar : function(xinfa, attributes) {
		var avatar = {
			xinfa : xinfa,
			attributes : attributes,
			autoSkills : [],
            gcds : [0, 0],
			useMacro(current, targetAvatar, macro) {
				for (var key in macro.orders) {
					var order = macro.orders[key];
					this.useOrder(current, targetAvatar, order);
				}
			},
			useOrder(current, targetAvatar, order) {
				if (!evalConditionNode(order.condition, this, null)) {
					return;
				}
				this.useSkill(current, targetAvatar, order.skill);
			},
			useSkill(current, target, skill) {
				// 检查GCD
				if (skill.gcdLevel != null && this.gcds[skill.gcdLevel] > 0) {
					return;
				}
				// 检查CD
				if (skill.cdRest > 0) {
					return;
				}
				//console.log(current + ' ' + this.attributes.qidian);
				if (skill.target == SkillTarget.Enemy) {
					// Determine hit type
					var hitType = CalcSkillHitType(skill, this, target);
					// Calculate damage
					var damage = CalcSkillDamage(skill, this, target, hitType);
					// Log
					Logger.logDamage(current, skill, this, target, damage, hitType);
					// Taken damage
					target.attributes.damageTaken += damage;
					// After effect
					skill.after(this, target, hitType);
				}
				else {
					if (skill.after) {
						skill.after(this, null, false, false);
					}
				}
				// 
				if (skill.gcdLevel != null) {
					this.gcds[skill.gcdLevel] = skill.cdTime;
				}
				skill.cdRest = skill.cdTime;
			},
			useOneFrame(current, targetAvatar) {
				// 自动释放的技能，如平砍和被动
				for (var key in this.xinfa.skills) {
					var skill = this.xinfa.skills[key];
					if (skill.type == SkillType.Auto) {
						this.useSkill(current, targetAvatar, skill);
					}
				}
				// GCD转动
				for (var key in this.gcds) {
					this.gcds[key] = Math.max(this.gcds[key] - 1, 0);
				}
				// CD转动
				for (var key in this.xinfa.skills) {
					var skill = this.xinfa.skills[key];
					skill.cdRest = Math.max(skill.cdRest - 1, 0);
				}
			}
		}
		return avatar;
	}
};
var MacroFactory = {
	createMacro : function(macroText) {
        macroText = macroText.replace(/\n/g, "");
        macroText = macroText.replace(/ /g, "");
        var orderTexts = macroText.split("/cast");
		var macro = {
			orders : [
			]
		};
        for (var key in orderTexts) {
            orderText = orderTexts[key];
        	lbra = orderText.indexOf('[');
        	rbra = orderText.indexOf(']');
        	if (lbra != -1 && rbra != -1) {
        		conditionText = orderText.substring(lbra + 1, rbra);
        	}
        	else {
        		conditionText = null;
        	}
        	orderText = orderText.substring(rbra + 1, orderText.length);
            skill = SkillFactory.getSkillByName(orderText);
            if (orderText.length > 0 && skill != null) {
                macro.orders.push({
                    skill: skill,
                    condition: parseConditionText(conditionText)
                });
            }
        }
		return macro;
	},
}
var PlayerFactory = {
	createPlayer : function(avatar, macro) {
		var player = {
			avatar : avatar,
			macro : macro,
			useOneFrame : function(current, targetAvatar) {
                if (macro != null) {
                	avatar.useMacro(current, targetAvatar, macro);
                }
                avatar.useOneFrame(current, targetAvatar);
			}
		}
		return player;
	}
}

var playerAvatarAttributes = AvatarAttributesFactory.createAvatarAttributes(
	{
		basicAttackPower: 2613,
		finalAttackPower: 3886,
		weaponDamage: 487,
		criticalHitChance: 0.327,
		criticalHitDamage: 2.1748,
		defenseBreakLevel: 1106,
		hasteLevel: 0,
		hitChance: 110.09,
		precisionChance: 24.65,
		qidian: 10
	}
);
var targetAvatarAttributes = AvatarAttributesFactory.createAvatarAttributes(
	{
		name: "中级试炼木桩",
		requiredHitChance: 105,
		requiredPrecisionChance: 20,
		defenseRate: 0.25,
		damageTaken: 0
	}
);
var xinfa = {
	type: XinfaFactory.Taixujianyi,
	skills: [
		//SkillFactory.getSkillByName("无我无剑"),
		SkillFactory.getSkillByName("三环套月"),
		//SkillFactory.getSkillByName("三柴剑法"),
		//SkillFactory.getSkillByName("被动回豆")
	]
}
var playerAvatar = AvatarFactory.createAvatar(xinfa, playerAvatarAttributes);
var targetAvatar = AvatarFactory.createAvatar(null, targetAvatarAttributes);
//var macro = MacroFactory.createMacro("/cast [qidian>7] 无我无剑\n/cast 三环套月\n");
var macro = MacroFactory.createMacro("/cast 三环套月");
var player = PlayerFactory.createPlayer(playerAvatar, macro);
console.log(player.macro);

var current = 0;
var total = 60000;
while (current < total) {
	player.useOneFrame(current, targetAvatar);
	current ++;
}

console.log("你的DPS为：", targetAvatar.attributes.damageTaken / 600);