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
				if (skill.target == SkillTarget.Enemy) {
				// 计算命中/会心/偏离/识破
					var pianlilv = Math.max(target.attributes.mingzhongyaoqiu - attributes.mingzhonglv, 0);
					var shipolv = Math.min(Math.max(target.attributes.wushuangyaoqiu - attributes.wushuanglv, 0), 100 - pianlilv);
					var huixinlv = Math.min(attributes.huixinlv, 100 - pianlilv - shipolv);
					var mingzhonglv = 100 - pianlilv - shipolv - huixinlv;
					var roll = Math.random() * 100;
					// 偏离
					if (!skill.bimingzhong && roll < pianlilv) {
						console.log(current / 100 + ":你的[" + skill.name + "]偏离了。");
						target.attributes.damageTaken += 0;
					}
					// 识破
					else if (!skill.bimingzhong && roll - pianlilv < shipolv) {
						console.log(current / 100 + ":你的[" + skill.name + "]的" + skill.calcDamage(this, target, false) / 4 + "点伤害被[" + target.attributes.name + "]识破了。");
						target.attributes.damageTaken += skill.calcDamage(this, target, false) / 4;
					}
					// 会心
					else if (!skill.bubaoji && roll - pianlilv - shipolv < huixinlv) {
						console.log(current / 100 + ":你的[" + skill.name + "]（会心）对[" + target.attributes.name + "]造成了" + skill.calcDamage(this, target, true) + "点伤害。");
						target.attributes.damageTaken += skill.calcDamage(this, target, true);
					}
					else {
						console.log(current / 100 + ":你的[" + skill.name + "]对[" + target.attributes.name + "]造成了" + skill.calcDamage(this, target, false) + "点伤害。");	
						target.attributes.damageTaken += skill.calcDamage(this, target, false);
					}
				}
				else {
				}
				if (skill.gcdLevel != null) {
					this.gcds[skill.gcdLevel] = skill.cdTime;
				}
				skill.cdRest = skill.cdTime;
				if (skill.after) {
					skill.after(this, null);
				}
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
		jichugongji: 2613,
		zuizhonggongji: 3886,
		wuqishanghai: 487,
		huixinlv: 32.7,
		huixiaolv: 217.48,
		pofangdengji: 1106,
		jiasudengji: 0,
		mingzhonglv: 110.09,
		wushuanglv: 24.65,
		qidian: 10
	}
);
var targetAvatarAttributes = AvatarAttributesFactory.createAvatarAttributes(
	{
		name: "中级试炼木桩",
		mingzhongyaoqiu: 105,
		wushuangyaoqiu: 20,
		fangyu: 25,
		damageTaken: 0
	}
);
var xinfa = {
	type: XinfaFactory.Taixujianyi,
	skills: [
		SkillFactory.getSkillByName("无我无剑"),
		SkillFactory.getSkillByName("三环套月"),
		SkillFactory.getSkillByName("三柴剑法"),
		SkillFactory.getSkillByName("被动回豆")
	]
}
var playerAvatar = AvatarFactory.createAvatar(xinfa, playerAvatarAttributes);
var targetAvatar = AvatarFactory.createAvatar(null, targetAvatarAttributes);
var macro = MacroFactory.createMacro("/cast [qidian>7] 无我无剑\n/cast 三环套月\n");
var player = PlayerFactory.createPlayer(playerAvatar, macro);
console.log(player.macro);

var current = 0;
var total = 6000;
while (current < total) {
	player.useOneFrame(current, targetAvatar);
	current ++;
}

console.log("你的DPS为：", targetAvatar.attributes.damageTaken / 60);