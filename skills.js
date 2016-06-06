SkillType = {
    Normal: 0,
    Auto: 1,
    Qidian: 2,
    Qixue: 3,
};
SkillTarget = {
    Enemy: 0,
    Self: 1
};
var SkillFactory = {
	skills : [
        {
        	type: SkillType.Normal,
            name: "三环套月",
            target: SkillTarget.Enemy,
            weaponCoef: 1.0,
            skillCoef: 0.925,
            basicDamage: 129.5, // 123 ~ 136
            cdTime: 200,
            cdRest: 0,
            gcdLevel: 0,
            after: function(avatar, target) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
            }
        },
        {
        	type: SkillType.Auto,
            name: "三柴剑法",
            target: SkillTarget.Enemy,
            weaponCoef: 1.2,
            skillCoef: 0.1572265625,
            basicDamage: 0.0,
            cdTime: 131.25,
            cdRest: 0,
            after: function(avatar, target) {
            }
        },
        {
        	type: SkillType.Qidian,
        	name: "无我无剑",
            target: SkillTarget.Enemy,
        	weaponCoef: 2.0,
        	skillCoefQidian10: 1.63125,
        	skillCoefQidian1: 0.3376,
        	basicDamageQidian10: 235.5, // 224 ~ 247
        	basicDamageQidian1: 23, // 22 ~ 24
        	cdTime: 150,
            cdRest: 0,
        	gcdLevel: 0,
            after: function(avatar, target) {
                avatar.attributes.qidian = 0;
            }
        },
        {
            type: SkillType.Auto,
            name: "被动回豆",
            target: SkillTarget.Self,
            cdTime: 100,
            cdRest: 0,
            after: function(avatar, target) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 1);
            }
        },
        {
            type: SkillType.Qidian,
            name: "无我无剑",
            target: SkillTarget.Enemy,
            weaponCoef: 2.0,
            skillCoefQidian10: 1.63125,
            skillCoefQidian1: 0.3376,
            basicDamageQidian10: 235.5, // 224 ~ 247
            basicDamageQidian1: 23, // 22 ~ 24
            cdTime: 150,
            cdRest: 0,
            gcdLevel: 0,
            after: function(avatar, target) {
                avatar.attributes.qidian = 0;
            }
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