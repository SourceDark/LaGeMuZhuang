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
			jichugongji : jichugongji,
			ewaigongji : ewaigongji,
			huixindengji : huixindengji,
			huixiaodengji : huixiaodengji,
			pofangdengji : pofangdengji,
			jiasudengji : jiasudengji,
			mingzhongdengji : mingzhongdengji,
			wushuangdengji : wushuangdengji
		}
		return avatarAttributes;
	}
}
var AvatarFactory = {
	createAvatar : function(xinfa, attributes) {
		if (XinfaFactory.isXinfaValid(xinfa) == false) {
			return null;
		}
		var avatar = {
			xinfa : xinfa,
			attributes : attributes,
            gcd : [0, 0],
            useSkill : function(skill) {

            }

		}
		return avatar;
	}
};
var SkillFactory = {
	skills : [
        {
            name : "三环套月",
            weaponCoef : 1.0,
            skillCoef : 0.925,
            basicDamage : 129.5, // 123 ~ 136
            cdTime : 2.0,
            gcdLevel : 1,
            autoUse : false,
        },
        {
            name : "三柴剑法",
            weaponCoef : 1.2,
            skillCoef : 0.1572265625,
            basicDamage : 0.0,
            cdTime : 1.3125,
            gcdLevel : 0,
            autoUse : true,
        }
    ],
    getSkillByName : function(name) {
        for (var key in this.skills) {
            var skill = this.skills[key];
            if (skill.name === name) {
                return skill;
            }
        }
        return null;
    }
}
var MacroFactory = {
	createMacro : function(macroText) {
        macroText = macroText.replace(/\n/g, "");
        macroText = macroText.replace(/ /g, "");
        var orderTexts = macroText.split("/cast");
		var macro = {
			orders : [
			],
            getNextSkill : function(avatar) {
                for (var key in this.orders) {
                    var order = this.orders[key];
                    if (avatar.gcd[order.skill.gcdLevel] == 0) {
                        return order.skill;
                    }
                }
                return null;
            }
		};
        for (var key in orderTexts) {
            orderText = orderTexts[key];
            skill = SkillFactory.getSkillByName(orderText);
            if (orderText.length > 0 && skill != null) {
                macro.orders.push({
                    skill : skill
                });
            }
        }
		return macro;
	}
}
var PlayerFactory = {
	createPlayer : function(avatar, macro) {
		var player = {
			avatar : avatar,
			macro : macro,
			useOneFrame : function() {
                var skill = null;
                do {
                    skill = this.macro.getNextSkill(this.avatar);
                    avatar.useSkill(skill);
                } while (skill != null);
			}
		}
		return player;
	}
}

var avatarAttributes = AvatarAttributesFactory.createAvatarAttributes(2000, 1000, 1000, 5000, 1000, 0, 200, 200);
var avatar = AvatarFactory.createAvatar(XinfaFactory.Taixujianyi, avatarAttributes);
var macro = MacroFactory.createMacro("/cast 三环套月\n/cast 三柴剑法\n");
var player = PlayerFactory.createPlayer(avatar, macro);
console.log(player.macro);

var current = 0;
var total = 9600;
while (current ++ < total) {
	//console.log("frame : " + current);
	player.useOneFrame();
}