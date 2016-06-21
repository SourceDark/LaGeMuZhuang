Logger = {
	logDamage: function(current, skill, avatar, target, damage, hitType) {
		if (LOG_SKILL_DETAIL) {
			switch (hitType) {
				case HitType.Miss:
					console.log(current.toFixed(2) + ":你的[" + skill.name + "]偏离了。");
					break;
				case HitType.Block:
					console.log(current.toFixed(2) + ":你的[" + skill.name + "]的" + damage.toFixed(0) + "点伤害被[" + target.attributes.name + "]识破了。");
					break;
				case HitType.Critical:
					console.log(current.toFixed(2) + ":你的[" + skill.name + "]（会心）对[" + target.attributes.name + "]造成了" + damage.toFixed(0) + "点伤害。");
					break;
				default:
					console.log(current.toFixed(2) + ":你的[" + skill.name + "]对[" + target.attributes.name + "]造成了" + damage.toFixed(0) + "点伤害。");	
			}
		}
	},
	logDotDamage: function(current, buff, avatar, target, damage, hitType) {
		if (LOG_SKILL_DETAIL) {
			switch (hitType) {
				case HitType.Block:
					console.log(current.toFixed(2) + ":效果[" + buff.name + "]的" + damage.toFixed(0) + "点伤害被[" + target.attributes.name + "]识破了。");
					break;
				case HitType.Critical:
					console.log(current.toFixed(2) + ":效果[" + buff.name + "]（会心）对[" + target.attributes.name + "]造成了" + damage.toFixed(0) + "点伤害。");
					break;
				default:
					console.log(current.toFixed(2) + ":效果[" + buff.name + "]对[" + target.attributes.name + "]造成了" + damage.toFixed(0) + "点伤害。");	
			}
		}
	},
	logCasting: function(current, skill) {
		if (LOG_SKILL_DETAIL) {
			console.log(current.toFixed(2) + ":开始释放[" + skill.name + "]。");	
		}
	},
	logError: function(errorText) {
		if (LOG_SKILL_DETAIL) {
			console.log(current.toFixed(2) + ":" + errorText);
		}
	},
	logAddBuff: function(buff, avatar) {
		if (LOG_SKILL_DETAIL) {
			var target;
			if (avatar == null || avatar.attributes.name == null) {
				target = "你";
			}
			else {
				target = "[" + avatar.attributes.name + "]";
			}
			console.log(current.toFixed(2) + ":" + target + "获得了效果[" + buff.name + "]。");
		}
	},
	logRemoveBuff: function(buff) {
		if (LOG_SKILL_DETAIL) {
			console.log(current.toFixed(2) + ":效果[" + buff.name + "]从你身上消失了。");	
		}
	},
	logRemoveTargetBuff: function(buff, avatar) {
		if (LOG_SKILL_DETAIL) {
			console.log(current.toFixed(2) + ":效果[" + buff.name + "]从[" + avatar.name + "]身上消失了。");	
		}
	}
}