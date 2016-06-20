Logger = {
	logDamage: function(current, skill, avatar, target, damage, hitType) {
		switch (hitType) {
			case hitType.Miss:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]偏离了。");
				break;
			case hitType.Block:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]的" + damage + "点伤害被[" + target.attributes.name + "]识破了。");
				break;
			case hitType.Critical:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]（会心）对[" + target.attributes.name + "]造成了" + damage + "点伤害。");
				break;
			default:
				console.log((current / 100).toFixed(2) + ":你的[" + skill.name + "]对[" + target.attributes.name + "]造成了" + damage + "点伤害。");	
		}
	}
}