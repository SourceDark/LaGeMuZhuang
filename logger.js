Logger = {
	logDamage: function(current, skill, avatar, target, damage, hitType) {
		switch (hitType) {
			case HitType.Miss:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]偏离了。");
				break;
			case HitType.Block:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]的" + damage.toFixed(0) + "点伤害被[" + target.attributes.name + "]识破了。");
				break;
			case HitType.Critical:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]（会心）对[" + target.attributes.name + "]造成了" + damage.toFixed(0) + "点伤害。");
				break;
			default:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]对[" + target.attributes.name + "]造成了" + damage.toFixed(0) + "点伤害。");	
		}
	},
	logCasting: function(current, skill) {
		console.log((current / 100).toFixed(2) + ":开始释放[" + skill.name + "]。");	
	},
	logError: function(errorText) {
		console.log((current / 100).toFixed(2) + ":" + errorText);
	}
	logAddBuff: function(buff) {
		
	}
}