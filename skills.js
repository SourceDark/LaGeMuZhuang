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
HitType = {
    Miss: 0,
    Hit: 1,
    Critical: 2,
    Block: 3
}
var SkillFactory = {
	skills : [
        {
        	type: SkillType.Normal,
            name: "三环套月",
            target: SkillTarget.Enemy,
            cdRest: 0,
            cdTime: 200,
            gcdLevel: 0,
            getWeaponCoef: function(avatar, target) {
                return 1.0;
            },
            getSkillCoef: function(avatar, target) {
                return 0.925;
            },
            getBasicDamage: function(avatar, target) {
                return randBetween(123, 136);
            },
            getWeaponDamage: function(avatar, target) {
                return avatar.attributes.weaponDamage;
            },
            getFinalAttackPower: function(avatar, target) {
                return avatar.attributes.finalAttackPower;
            },
            getCriticalHitChance: function(avatar, target) {
                // 奇穴：心固 + 秘籍
                return avatar.attributes.criticalHitChance + 0.02 + 0.03 + 0.04 + 0.1;
            },
            getCriticalHitDamage: function(avatar, target) {
                // 奇穴：心固
                return avatar.attributes.criticalHitDamage + 0.1;
            },
            getDefenseBreakRate: function(avatar, target) {
                return avatar.attributes.defenseBreakLevel / DEFENSE_BREAK_COEF / 100;
            },
            getGlobalBenefit: function(avatar, target) {
                // 秘籍
                return 1.05;
            },
            getTargetDefenseRate: function(avatar, target) {
                return target.attributes.defenseRate;
            },
            after: function(avatar, target, huixin, pianli) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                // 奇穴：深埋
                if (huixin) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
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
            after: function(avatar, target, huixin, pianli) {
                if (huixin) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
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
            getSkillCoef: function(avatar, target) {
                return this.skillCoefQidian1 + (this.skillCoefQidian10 - this.skillCoefQidian1) / 9 * (avatar.attributes.qidian - 1);
            },
            getBasicDamage: function(avatar, target) {
                return this.basicDamageQidian1 + (this.basicDamageQidian10 - this.basicDamageQidian1) / 9 * (avatar.attributes.qidian - 1);
            },
            getHuixinlv: function(avatar, target) {
                // 奇穴 + 秘籍
                return avatar.attributes.huixinlv + 3 + 4;
            },
            getHuixiaolv: function(avatar, target) {
                // 奇穴
                return avatar.attributes.huixiaolv;
            },
            getZengshang: function(avatar, target) {
                // 秘籍
                return 1.09;
            },
            after: function(avatar, target, huixin, pianli) {
                avatar.attributes.qidian = 0;
                if (huixin) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
            },
            calcDamage: function(avatar, target, huixin) {
                // 基础伤害
                var damage = (avatar.attributes.wuqishanghai * this.weaponCoef + this.getBasicDamage(avatar, target) + (this.getSkillCoef(avatar, target) - this.weaponCoef / 10) * avatar.attributes.zuizhonggongji) * 1.31 * (1 - target.attributes.fangyu / 100);
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

/*
 * Determine hit type of a skill
 */
function CalcSkillHitType(skill, avatar, target) {
    // Caculate the table
    var missChance = Math.max(target.attributes.requiredHitChance - avatar.attributes.hitChance, 0);
    var blockChance = Math.min(Math.max(target.attributes.requiredPrecisionChange - avatar.attributes.precisionChance, 0), 1 - missChance);
    var criticalHitChange = Math.min(avatar.attributes.criticalHitChange, 1 - missChance - blockChance);
    var hitChance = 1 - missChance - blockChance - criticalHitChange;
    // Roll once
    var roll = Math.random();
    if (roll < missChance) {
        return HitType.Miss;
    }
    if (roll < missChance + blockChance) {
        return HitType.Block;
    }
    if (roll < missChance + blockChance + criticalHitChange) {
        return HitType.Critical;
    }
    return HitType.Hit;
}

/*
 * Calc damage of a skill
 */
function CalcSkillDamage(skill, avatar, target, hitType) {
    // Miss
    if (hitType == HitType.Miss) {
        return 0;
    }
    // Basic damage
    var weaponDamage = skill.getWeaponCoef(avatar, target) * skill.getWeaponDamage(avatar, target);
    var skillDamage = (skill.getSkillCoef(avatar, target) - skill.getWeaponCoef(avatar, target) / 10) * skill.getFinalAttackPower(avatar, target);
    var damage = skill.getBasicDamage() + weaponDamage + skillDamage;
    // Defense break
    damage = damage * (1 + skill.getDefenseBreakRate(avatar, target));
    // Crit damage
    if (hitType == HitType.Critical) {
        damage = damage * skill.getCritHitDamage(avatar, target) / 100;
    }
    // Block damage
    if (hitType == HitType.Block) {
        damage = damage / 4;
    }
    // Global benefit
    damage = damage * skill.getGlobalBenefit(avatar, target);
    // Target's defense
    damage = damage * (1 - skill.getTargetDefenseRate(avatar, target));
    // Response
    return damage;
}