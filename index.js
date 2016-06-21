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
			buffs : [],
			castingSkill: null,
			castingDuration: 0,
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
				this.castSkill(current, targetAvatar, order.skill);
			},
			castSkill(current, target, skill) {
				// Casting protection
				if (this.castingSkill != null) {
					return;
				}
				// 检查GCD
				if (skill.gcdLevel != null && this.gcds[skill.gcdLevel] > 0) {
					return;
				}
				// 检查CD
				if (skill.cdRest > 0) {
					return;
				}
				if (skill.type == SkillType.Casting) {
					this.castingSkill = skill;
					this.castingDuration = skill.getCastingDuration();
					Logger.logCasting(current, skill);
				}
				else {
					this.useSkill(current, target, skill);
				}
				// Trigger GCD
				if (skill.gcdLevel != null) {
					this.gcds[skill.gcdLevel] = 1.5;
				}
			},
			useSkill(current, target, skill) {
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
						skill.after(this, target, hitType);
					}
				}
				// Trigger CD
				skill.cdRest = skill.getColdTime();
			},
			useOneFrame(current, target) {
				// 自动释放的技能，如平砍和被动
				if (this.castingSkill == null) {
					for (var key in this.xinfa.skills) {
						var skill = this.xinfa.skills[key];
						if (skill.type == SkillType.Auto) {
							this.castSkill(current, target, skill);
						}
					}
				}
				// Casting
				if (this.castingSkill != null) {
					this.castingDuration = Math.max(this.castingDuration - TIME_PER_FRAME, 0);
					if (this.castingDuration == 0) {
						this.useSkill(current, target, this.castingSkill);
						this.castingSkill = null;
					}
				}
				// GCD转动
				for (var key in this.gcds) {
					this.gcds[key] = Math.max(this.gcds[key] - TIME_PER_FRAME, 0);
				}
				// CD转动
				for (var key in this.xinfa.skills) {
					var skill = this.xinfa.skills[key];
					skill.cdRest = Math.max(skill.cdRest - TIME_PER_FRAME, 0);
				}
				// buffs use a frame
				var bufflist = [];
				for (var key in this.buffs) {
					var buff = this.buffs[key];
					buff.duration = Math.max(buff.duration - TIME_PER_FRAME, 0);
					if (buff.duration > 0) {
						bufflist.push(buff);
					}
					else {
						Logger.logRemoveBuff(buff);
					}
				}
				this.buffs = bufflist;
			},
			getBuffByName(buffname) {
		        for (var key in this.buffs) {
		            var buff = this.buffs[key];
		            if (buff.name == buffname) {
		                return buff;
		            }
		        }
		        return null;
			},
			addBuff(buffname, levels) {
				if (typeof(levels)==='undefined') levels = 1;
				buff = this.getBuffByName(buffname);
				if (buff == null) {
					buff = BuffFactory.getBuffByName(buffname);
					if (buff == null) {
						Logger.logError("Wrong buffname :" + buffname);
					}
					this.buffs.push(buff);
					buff.level = 0;
					Logger.logAddBuff(buff);
				}
				buff.duration = buff.duration_max;
				buff.level = Math.min(buff.level + levels, buff.level_max);
			},
			removeBuff(buffname) {
				var bufflist = [];
		        for (var key in this.buffs) {
		            var buff = this.buffs[key];
		            if (buff.name != buffname) {
		                bufflist.push(buff);
		            }
		        }
		        this.buffs = bufflist;
			},
			getExtraAttributes() {
				var ret = {
					criticalHitChance: 0,
					criticalHitDamage: 0,
					defenseBreakMultiply: 0,
					basicAttckPowerMultiply: 0,
				}
		        for (var key in this.buffs) {
		            var buff = this.buffs[key];
		            if (buff.effects.criticalHitChance != null) {
		            	ret.criticalHitChance += buff.effects.criticalHitChance * buff.level;
		            }
		            if (buff.effects.criticalHitDamage != null) {
		            	ret.criticalHitDamage += buff.effects.criticalHitDamage * buff.level;
		            }
		            if (buff.effects.defenseBreakMultiply != null) {
		            	ret.defenseBreakMultiply += buff.effects.defenseBreakMultiply * buff.level;
		            }
		            if (buff.effects.basicAttckPowerMultiply != null) {
		            	ret.basicAttckPowerMultiply += buff.effects.basicAttckPowerMultiply * buff.level;
		            }
		        }
		        return ret;
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

var sumDPS = 0;
var totalTimes = 1;
for (var i = 0; i < totalTimes; i++) {
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
			damageTaken: 0,
			hp: 5000000,
			currentHp: 5000000,
		}
	);
	var xinfa = {
		type: XinfaFactory.Taixujianyi,
		skills: [
			SkillFactory.getSkillByName("无我无剑"),
			SkillFactory.getSkillByName("三环套月"),
			SkillFactory.getSkillByName("三柴剑法"),
			SkillFactory.getSkillByName("被动回豆"),
			SkillFactory.getSkillByName("天地无极"),
			SkillFactory.getSkillByName("八荒归元"),
			SkillFactory.getSkillByName("碎星辰"),
			SkillFactory.getSkillByName("人剑合一")
		]
	}
	var playerAvatar = AvatarFactory.createAvatar(xinfa, playerAvatarAttributes);
	var targetAvatar = AvatarFactory.createAvatar(null, targetAvatarAttributes);
	var macro = MacroFactory.createMacro("/cast [qidian>7] 无我无剑\n/cast[bufftime:玄门<5|buff:玄门<3]人剑合一\n/cast [nobuff:碎星辰] 碎星辰\n/cast 八荒归元\n/cast 天地无极\n/cast 三环套月\n");
	var player = PlayerFactory.createPlayer(playerAvatar, macro);
	//console.log(player.macro);

	var current = 0;
	playerAvatar.addBuff("玄门", 3);
	playerAvatar.addBuff("碎星辰", 3);
	playerAvatar.addBuff("期声", 1);
	var total = 600;
	while (current < total) {
		player.useOneFrame(current, targetAvatar);
		current = current + TIME_PER_FRAME;
	}
	sumDPS += targetAvatar.attributes.damageTaken / total;
	console.log("你第" + i + "次的DPS为：", targetAvatar.attributes.damageTaken / total);
}

console.log("平均输出：", sumDPS / totalTimes);