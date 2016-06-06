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
	Huixinxishu : 41.43,
	Huixiaoxishu : 15.06,
	Pofangxishu : 36.34,
	Mingzhongxishu : 34.25,
	Wushuangxishu : 25.69,
	createAvatarAttributes : function(jichugongji, ewaigongji, huixindengji, huixiaodengji, pofangdengji, jiasudengji, mingzhongdengji, wushuangdengji) {
		var avatarAttributes = {
			jichugongji: jichugongji,
			ewaigongji: ewaigongji,
			huixindengji: huixindengji,
			huixiaodengji: huixiaodengji,
			pofangdengji: pofangdengji,
			jiasudengji: jiasudengji,
			mingzhongdengji: mingzhongdengji,
			wushuangdengji: wushuangdengji,
			qidian: 10
		}
		return avatarAttributes;
	}
}
var AvatarFactory = {
	createAvatar : function(xinfa, attributes) {
		if (XinfaFactory.isXinfaValid(xinfa.type) == false) {
			return null;
		}
		var avatar = {
			xinfa : xinfa,
			attributes : attributes,
			autoSkills : [],
            gcds : [0, 0],
			useMacro(current, macro) {
				for (var key in macro.orders) {
					var order = macro.orders[key];
					this.useOrder(current, order);
				}
			},
			useOrder(current, order) {
				if (!evalConditionNode(order.condition, this, null)) {
					return;
				}
				this.useSkill(current, order.skill);
			},
			useSkill(current, skill) {
				// 检查GCD
				if (skill.gcdLevel != null && this.gcds[skill.gcdLevel] > 0) {
					return;
				}
				// 检查CD
				if (skill.cdRest > 0) {
					return;
				}
				// 输出日志
				if (skill.type == SkillType.Normal) {
					console.log(current / 100 + ":" + skill.name);
				}
				if (skill.type == SkillType.Qidian) {
					console.log(current / 100 + ":" + skill.name + "(" + this.attributes.qidian + ")");	
				}
				if (skill.gcdLevel != null) {
					this.gcds[skill.gcdLevel] = skill.cdTime;
				}
				skill.cdRest = skill.cdTime;
				if (skill.after) {
					skill.after(this, null);
				}
			},
			useOneFrame(current) {
				// 自动释放的技能，如平砍和被动
				for (var key in this.xinfa.skills) {
					var skill = this.xinfa.skills[key];
					if (skill.type == SkillType.Auto) {
						this.useSkill(current, skill);
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
			useOneFrame : function(current) {
                avatar.useMacro(current, macro);
                avatar.useOneFrame(current);
			}
		}
		return player;
	}
}

var avatarAttributes = AvatarAttributesFactory.createAvatarAttributes(2000, 1000, 1000, 5000, 1000, 0, 200, 200);
var xinfa = {
	type: XinfaFactory.Taixujianyi,
	skills: [
		SkillFactory.getSkillByName("无我无剑"),
		SkillFactory.getSkillByName("三环套月"),
		SkillFactory.getSkillByName("三柴剑法"),
		SkillFactory.getSkillByName("被动回豆")
	]
}
var avatar = AvatarFactory.createAvatar(xinfa, avatarAttributes);
var macro = MacroFactory.createMacro("/cast [qidian>7] 无我无剑\n/cast 三环套月\n");
var player = PlayerFactory.createPlayer(avatar, macro);
console.log(player.macro);

var current = 0;
var total = 6000;
while (current < total) {
	player.useOneFrame(current);
	current ++;
}