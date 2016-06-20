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
            },
            getHuixinlv: function(avatar, target) {
                // 奇穴 + 秘籍
                return avatar.attributes.huixinlv + 2 + 3 + 4 + 10;
            },
            getHuixiaolv: function(avatar, target) {
                // 奇穴
                return avatar.attributes.huixiaolv + 10;
            },
            getZengshang: function(avatar, target) {
                // 秘籍
                return 1.05;
            },
            calcDamage: function(avatar, target, huixin) {
                // 基础伤害
                var damage = (avatar.attributes.wuqishanghai * this.weaponCoef + this.basicDamage + (this.skillCoef - this.weaponCoef / 10) * avatar.attributes.zuizhonggongji) * 1.31 * (1 - target.attributes.fangyu / 100);
                // 会心伤害
                if (huixin) damage = damage * this.getHuixiaolv(avatar, target) / 100;
                // 增益伤害
                damage = damage * this.getZengshang(avatar, target);
                // 返回
                return damage;
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
            },
            calcDamage: function(avatar, target, huixin) {
                var damage = (avatar.attributes.wuqishanghai * this.weaponCoef + this.basicDamage + (this.skillCoef - this.weaponCoef / 10) * avatar.attributes.zuizhonggongji) * 1.31 * (1 - target.attributes.fangyu / 100);
                if (huixin) damage = damage * avatar.attributes.huixiaolv / 100;
                return damage;
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
            },
            calcDamage: function(avatar, target, huixin) {
                var skillCoef = this.skillCoefQidian1 + (this.skillCoefQidian10 - this.skillCoefQidian1) / 9 * (avatar.attributes.qidian - 1)
                var basicDamage = this.basicDamageQidian1 + (this.basicDamageQidian10 - this.basicDamageQidian1) / 9 * (avatar.attributes.qidian - 1)
                var damage = (avatar.attributes.wuqishanghai * this.weaponCoef + basicDamage + (skillCoef - this.weaponCoef / 10) * avatar.attributes.zuizhonggongji) * 1.31 * (1 - target.attributes.fangyu / 100);
                if (huixin) damage = damage * avatar.attributes.huixiaolv / 100;
                return damage;
            }
        },
        {
            type: SkillType.Auto,
            name: "被动回豆",
            target: SkillTarget.Self,
            cdTime: 100,
            cdRest: 0,
            bimingzhong: true,
            bubaoji: true,
            after: function(avatar, target) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 1);
            },
            calcDamage: function(avatar, target, huixin) {
                return 0;
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